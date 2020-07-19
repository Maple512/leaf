import { Injectable } from '@angular/core';
import {
  Action,
  Actions,
  ofActionSuccessful,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { ModelCommon, SessionModel } from '../models';
import { GetAppConfiguration } from '../actions/config.actions';
import { ModifyOpenedTabCount, SetLanguage, SetTenant, SetRemember } from '../actions/session.actions';

@State<SessionModel.State>({
  name: 'SessionState',
  defaults: { sessionDetail: { openedTabCount: 0 } } as SessionModel.State,
})
@Injectable()
export class SessionState {
  @Selector()
  static getLanguage({ language }: SessionModel.State): string {
    return language;
  }

  @Selector()
  static getTenant({ tenant }: SessionModel.State): ModelCommon.BasicItem {
    return tenant;
  }

  @Selector()
  static getSessionDetail({ sessionDetail }: SessionModel.State): SessionModel.SessionDetail {
    return sessionDetail;
  }

  constructor(private oAuthService: OAuthService, private store: Store, private actions: Actions) {
    actions
      .pipe(ofActionSuccessful(GetAppConfiguration))
      .pipe(take(1))
      .subscribe(() => {
        const { sessionDetail } = this.store.selectSnapshot(SessionState) || { sessionDetail: {} };

        const fiveMinutesBefore = new Date().valueOf() - 5 * 60 * 1000;

        if (
          sessionDetail.lastExitTime &&
          sessionDetail.openedTabCount === 0 &&
          this.oAuthService.hasValidAccessToken() &&
          sessionDetail.remember === false &&
          sessionDetail.lastExitTime < fiveMinutesBefore
        ) {
          this.oAuthService.logOut();
        }

        this.store.dispatch(new ModifyOpenedTabCount('increase'));

        fromEvent(window, 'unload').subscribe(event => {
          this.store.dispatch(new ModifyOpenedTabCount('decrease'));
        });
      });
  }

  @Action(SetLanguage)
  setLanguage(
    { patchState, dispatch }: StateContext<SessionModel.State>,
    { payload, dispatchAppConfiguration = true }: SetLanguage,
  ) {
    patchState({
      language: payload,
    });

    if (dispatchAppConfiguration) {
      return dispatch(new GetAppConfiguration());
    }
  }

  @Action(SetTenant)
  setTenant({ patchState }: StateContext<SessionModel.State>, { payload }: SetTenant) {
    patchState({
      tenant: payload,
    });
  }

  @Action(SetRemember)
  setRemember(
    { getState, patchState }: StateContext<SessionModel.State>,
    { payload: remember }: SetRemember,
  ) {
    const { sessionDetail } = getState();

    patchState({
      sessionDetail: {
        ...sessionDetail,
        remember,
      },
    });
  }

  @Action(ModifyOpenedTabCount)
  modifyOpenedTabCount(
    { getState, patchState }: StateContext<SessionModel.State>,
    { operation }: ModifyOpenedTabCount,
  ) {
    // tslint:disable-next-line: prefer-const
    let { openedTabCount, lastExitTime, ...detail } =
      getState().sessionDetail || ({ openedTabCount: 0 } as SessionModel.SessionDetail);

    if (operation === 'increase') {
      openedTabCount++;
    } else if (operation === 'decrease') {
      openedTabCount--;
      lastExitTime = new Date().valueOf();
    }

    if (!openedTabCount || openedTabCount < 0) {
      openedTabCount = 0;
    }

    patchState({
      sessionDetail: {
        openedTabCount,
        lastExitTime,
        ...detail,
      },
    });
  }
}
