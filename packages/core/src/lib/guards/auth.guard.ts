
import { Injectable, Injector } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { AppConfigState } from '../states';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private injector: Injector,
    private store: Store
  ) { }

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean | UrlTree {
    ;
    const router = this.injector.get(Router);

    const hasValidAccessToken = this.oauthService.hasValidAccessToken();
    if (hasValidAccessToken) {
      return hasValidAccessToken;
    }

    const login = this.store.selectSnapshot(AppConfigState.getUrl('login'));

    router.navigate([login], { state: { redirectUrl: state.url } });

    return true;
  }
}
