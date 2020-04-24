import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AEAuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private store: Store, private router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | UrlTree {
    const hasValidAccessToken = this.oauthService.hasValidAccessToken();
    if (hasValidAccessToken) {
      return hasValidAccessToken;
    }

    return this.router.createUrlTree(['/passport/login'], { state: { redirectUrl: state.url } });
  }
}
