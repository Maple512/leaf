import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { GetAppConfiguration } from '../actions';
import { AppConfigState } from '../states/config.state';
import { SessionState } from '../states/session.state';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private rest: RestService,
    private oAuthService: OAuthService,
    private store: Store,
    @Optional() @Inject('ACCOUNT_OPTIONS') private options: any,
  ) { }

  login(username: string, password: string): Observable<any> {
    const tenant = this.store.selectSnapshot(SessionState.getTenant);

    return from(this.oAuthService.loadDiscoveryDocument()).pipe(
      switchMap(() =>
        from(
          this.oAuthService.fetchTokenUsingPasswordFlow(
            username,
            password,
            new HttpHeaders({ ...(tenant && tenant.id && { __tenant: tenant.id }) }),
          ),
        ),
      ),
      switchMap(() => this.store.dispatch(new GetAppConfiguration())),
      tap(() => {
        const redirectUrl = window.history.state?.redirectUrl
          || this.options?.redirectUrl || '/';

        this.store.dispatch(new Navigate([redirectUrl]));
      }),
      take(1),
    );
  }

  logout(): Observable<void> {
    const issuer = this.store.selectSnapshot(AppConfigState.getDeep('environment.oAuthConfig.issuer'));
    const logout = this.store.selectSnapshot(AppConfigState.getApi('logout'));

    return this.rest
      .request(
        {
          method: 'GET',
          url: logout,
        },
        null,
        issuer,
      )
      .pipe(
        switchMap(() => {
          this.oAuthService.logOut(true);
          return this.store.dispatch(new GetAppConfiguration());
        }),
      );
  }
}
