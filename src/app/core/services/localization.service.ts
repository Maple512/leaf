import { Injectable, Injector, NgZone, Optional, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { noop, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetLanguage } from '../actions/session.actions';
import { AppConfig } from '../configs';
import { AppConfigState } from '../states/config.state';
import { registerLocale } from '../utils/initial.util';
import { createLocalizer, createLocalizerWithFallback } from '../utils/localization.util';

type ShouldReuseRoute = (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) => boolean;

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  /**
   * Returns currently selected language
   */
  get currentLang(): string {
    return this.store.selectSnapshot(state => state.SessionState.language);
  }

  get languageChange(): Observable<SetLanguage> {
    return this.actions.pipe(ofActionSuccessful(SetLanguage));
  }

  constructor(
    private actions: Actions,
    private store: Store,
    private injector: Injector,
    private ngZone: NgZone,
    @Optional()
    @SkipSelf()
    otherInstance: LocalizationService,
  ) {
    if (otherInstance) {
      throw new Error('LocalizationService should have only one instance.');
    }

    this.listenToSetLanguage();
  }

  private listenToSetLanguage() {
    this.languageChange.subscribe(({ payload }) => this.registerLocale(payload));
  }

  registerLocale(locale: string) {
    const router = this.injector.get(Router);
    const { shouldReuseRoute } = router.routeReuseStrategy;
    router.routeReuseStrategy.shouldReuseRoute = () => false;
    router.navigated = false;

    return registerLocale(locale).then(() => {
      this.ngZone.run(async () => {
        await router.navigateByUrl(router.url).catch(noop);
        router.routeReuseStrategy.shouldReuseRoute = shouldReuseRoute;
      });
    });
  }

  /**
   * Returns an observable localized text with the given interpolation parameters in current language.
   * @param key Localizaton key to replace with localized text
   * @param interpolateParams Values to interpolate
   */
  get(
    key: string | AppConfig.LocalizationWithDefault,
    ...interpolateParams: string[]
  ): Observable<string> {
    return this.store.select(AppConfigState.getLocalization(key, ...interpolateParams));
  }

  /**
   * Returns localized text with the given interpolation parameters in current language.
   * @param key Localization key to replace with localized text
   * @param interpolateParams Values to intepolate.
   */
  instant(key: string | AppConfig.LocalizationWithDefault, ...interpolateParams: string[]): string {
    return this.store.selectSnapshot(AppConfigState.getLocalization(key, ...interpolateParams));
  }

  localize(resourceName: string, key: string, defaultValue: string): Observable<string> {
    return this.store.select(AppConfigState.getOne('localization')).pipe(
      map(createLocalizer),
      map(localize => localize(resourceName, key, defaultValue)),
    );
  }

  localizeSync(resourceName: string, key: string, defaultValue: string): string {
    const localization = this.store.selectSnapshot(AppConfigState.getOne('localization'));
    return createLocalizer(localization)(resourceName, key, defaultValue);
  }

  localizeWithFallback(
    resourceNames: string[],
    keys: string[],
    defaultValue: string,
  ): Observable<string> {
    return this.store.select(AppConfigState.getOne('localization')).pipe(
      map(createLocalizerWithFallback),
      map(localizeWithFallback => localizeWithFallback(resourceNames, keys, defaultValue)),
    );
  }

  localizeWithFallbackSync(resourceNames: string[], keys: string[], defaultValue: string): string {
    const localization = this.store.selectSnapshot(AppConfigState.getOne('localization'));
    return createLocalizerWithFallback(localization)(resourceNames, keys, defaultValue);
  }
}
