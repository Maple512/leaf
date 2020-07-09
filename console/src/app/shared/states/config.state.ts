import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext, Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { GetAppConfiguration, RestOccurError, SetEnvironment, SetLanguage } from '../actions';
import { AppConfig } from '../configs';
import { AppConfigResponse } from '../responses';
import { SessionState } from './session.state';

@State<AppConfig.State>({
  name: 'ConfigState',
  defaults: {} as AppConfig.State,
})
@Injectable()
export class AppConfigState {
  @Selector()
  static getAll(state: AppConfig.State) {
    return state;
  }

  @Selector()
  static getAppInfo(state: AppConfig.State): AppConfig.AppInfo {
    return state.environment.application || ({} as AppConfig.AppInfo);
  }

  static getOne(key: string) {
    const selector = createSelector([AppConfigState], (state: AppConfig.State) => {
      return state[key];
    });

    return selector;
  }

  static getDeep(keys: string[] | string) {
    if (typeof keys === 'string') {
      keys = keys.split('.');
    }

    if (!Array.isArray(keys)) {
      throw new Error('The argument must be a dot string or an string array.');
    }

    const selector = createSelector([AppConfigState], (state: AppConfig.State) => {
      return (keys as string[]).reduce((acc, val) => {
        if (acc) {
          return acc[val];
        }

        return undefined;
      }, state);
    });

    return selector;
  }

  static getApiUrl(key?: string) {
    const selector = createSelector([AppConfigState], (state: AppConfig.State): string => {
      return (state.environment.apis[key || 'default'] || state.environment.apis.default).url;
    });

    return selector;
  }

  static getSetting(key: string) {
    const selector = createSelector([AppConfigState], (state: AppConfig.State) => {
      return state.setting?.values[key];
    });

    return selector;
  }

  static getSettings(keyword?: string) {
    const selector = createSelector([AppConfigState], (state: AppConfig.State) => {
      const settings = state.setting?.values;

      if (!keyword) {
        return settings;
      }

      const keysFound = Object.keys(settings).filter(key => key.indexOf(keyword) > -1);

      return keysFound.reduce((acc, key) => {
        acc[key] = settings[key];
        return acc;
      }, {});
    });

    return selector;
  }

  static getGrantedPolicy(key: string) {
    const selector = createSelector([AppConfigState], (state: AppConfig.State): boolean => {
      if (!key) {
        return true;
      }

      const getPolicy = (k: string) => state.auth.grantedPolicies?.[k];

      const orRegexp = /\|\|/g;
      const andRegexp = /&&/g;

      // TODO: Allow combination of ANDs & ORs
      if (orRegexp.test(key)) {
        const keys = key.split('||').filter(Boolean);

        if (keys.length < 2) {
          return false;
        }

        return keys.some(k => getPolicy(k.trim()));
      } else if (andRegexp.test(key)) {
        const keys = key.split('&&').filter(Boolean);

        if (keys.length < 2) {
          return false;
        }

        return keys.every(k => getPolicy(k.trim()));
      }

      return getPolicy(key);
    });

    return selector;
  }

  static getLocalization(
    key: string | AppConfig.LocalizationWithDefault,
    ...interpolateParams: string[]
  ) {
    if (!key) {
      key = '';
    }

    let defaultValue: string;

    if (typeof key !== 'string') {
      defaultValue = key.defaultValue;
      key = key.key;
    }

    const keys = key.split('::') as string[];
    const selector = createSelector([AppConfigState], (state: AppConfig.State): string => {
      const warn = (message: string) => {
        if (!state.environment.production) {
          console.warn(message);
        }
      };

      if (keys.length < 2) {
        warn('The localization source separator (::) not found.');
        return defaultValue || (key as string);
      }
      if (!state.localization) {
        return defaultValue || keys[1];
      }

      const sourceName =
        keys[0] ||
        state.environment.localization?.defaultResourceName ||
        state.localization.defaultResourceName;

      const sourceKey = keys[1];

      if (sourceName === '_') {
        return defaultValue || sourceKey;
      }

      if (!sourceName) {
        warn(
          'Localization source name is not specified and the defaultResourceName was not defined!',
        );

        return defaultValue || sourceKey;
      }

      const source = state.localization.values[sourceName];
      if (!source) {
        warn('Could not find localization source: ' + sourceName);
        return defaultValue || sourceKey;
      }

      let localization = source[sourceKey];
      if (typeof localization === 'undefined') {
        return defaultValue || sourceKey;
      }

      interpolateParams = interpolateParams.filter(params => params != null);
      if (localization && interpolateParams && interpolateParams.length) {
        interpolateParams.forEach(param => {
          localization = localization.replace(/[\'\"]?\{[\d]+\}[\'\"]?/, param);
        });
      }

      if (typeof localization !== 'string') {
        localization = '';
      }

      return localization || defaultValue || (key as string);
    });

    return selector;
  }

  constructor(private http: HttpClient, private store: Store) { }

  @Action(GetAppConfiguration)
  addData({ patchState, dispatch }: StateContext<AppConfig.State>) {
    const apiName = 'default';
    const api = this.store.selectSnapshot(AppConfigState.getApiUrl(apiName));
    return this.http
      .get<AppConfigResponse.Response>(`${api}/api/abp/application-configuration`)
      .pipe(
        tap(configuration =>
          patchState({
            ...configuration,
          }),
        ),
        switchMap(configuration => {
          let defaultLang: string = configuration.setting.values['Abp.Localization.DefaultLanguage'];

          if (defaultLang.includes(';')) {
            defaultLang = defaultLang.split(';')[0];
          }

          document.documentElement.setAttribute(
            'lang',
            configuration.localization.currentCulture.cultureName,
          );
          return this.store.selectSnapshot(SessionState.getLanguage)
            ? of(null)
            : dispatch(new SetLanguage(defaultLang, false));
        }),
        catchError((err: HttpErrorResponse) => {
          dispatch(new RestOccurError(err));
          return throwError(err);
        }),
      );
  }

  @Action(SetEnvironment)
  setEnvironment({ patchState }: StateContext<AppConfig.State>, { environment }: SetEnvironment) {
    return patchState({
      environment,
    });
  }
}
