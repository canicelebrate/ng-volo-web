import { Config, RestOccurError } from '@abp/ng.core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Injectable,
  Injector,
  RendererFactory2,
} from '@angular/core';
import { Navigate, RouterDataResolved, RouterError, RouterState } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import snq from 'snq';

import { LocalizationService } from '@abp/ng.core';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

export const DEFAULT_ERROR_MESSAGES = {
  defaultError: {
    title: 'An error has occurred!',
    details: 'Error detail not sent by server.',
  },
  defaultError401: {
    title: 'You are not authenticated!',
    details: 'You should be authenticated (sign in) in order to perform this operation.',
  },
  defaultError403: {
    title: 'You are not authorized!',
    details: 'You are not allowed to perform this operation.',
  },
  defaultError404: {
    title: 'Resource not found!',
    details: 'The resource requested could not found on the server.',
  },
  defaultError500: {
    title: 'Internal server error',
    details: 'Error detail not sent by server.',
  },
};

@Injectable({ providedIn: 'root' })
export class AEErrorHandler {
  constructor(
    private actions: Actions,
    private store: Store,
    // private confirmationService: ConfirmationService,s
    private cfRes: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private injector: Injector,
    // @Inject('HTTP_ERROR_CONFIG') private httpErrorConfig: HttpErrorConfig,
    private modal: NzModalService,
    private localizationService: LocalizationService,
  ) {
    // super(_actions, store, confirmationService, appRef, cfRes, rendererFactory, injector, httpErrorConfig);

    this.listenToRestError();
    // this.listenToRouterError();
    this.listenToRouterDataResolved();
  }

  private listenToRouterError() {
    // this.actions.pipe(ofActionSuccessful(RouterError), filter(this.filterRouteErrors)).subscribe(
    //   () => this.show404Page())
    //   ;
  }

  private listenToRouterDataResolved() {
    this.actions
      .pipe(
        ofActionSuccessful(RouterDataResolved),
        // filter(() => !!this.componentRef),
      )
      .subscribe(() => {
        // this.componentRef.destroy();
        // this.componentRef = null;
      });
  }

  private listenToRestError() {
    this.actions
      .pipe(
        ofActionSuccessful(RestOccurError),
        map((action) => action.payload),
      )
      .subscribe((err) => {
        const body = snq(() => err.error.error, DEFAULT_ERROR_MESSAGES.defaultError.title);

        if (err instanceof HttpErrorResponse && err.headers.get('_AbpErrorFormat')) {
          const confirmation$ = this.showError(null, null, body);

          if (err.status === 401) {
            confirmation$.subscribe(() => {
              this.navigateToLogin();
            });
          }
        } else {
          switch (err.status) {
            case 401:
              this.showError(
                {
                  key: 'AbpAccount::DefaultErrorMessage401',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError401.title,
                },
                {
                  key: 'AbpAccount::DefaultErrorMessage401Detail',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError401.details,
                },
              ).subscribe(() => this.navigateToLogin());
              break;
            case 403:
              this.showError(
                {
                  key: 'AbpAccount::DefaultErrorMessage403',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError403.title,
                },
                {
                  key: 'AbpAccount::DefaultErrorMessage403Detail',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError403.details,
                },
              );
              break;
            case 404:
              this.showError(
                {
                  key: 'AbpAccount::DefaultErrorMessage404',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError404.details,
                },
                {
                  key: 'AbpAccount::DefaultErrorMessage404Detail',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError404.title,
                },
              );
              break;
            case 500:
              this.showError(
                {
                  key: 'AbpAccount::500Message',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError500.title,
                },
                {
                  key: 'AbpAccount::InternalServerErrorMessage',
                  defaultValue: DEFAULT_ERROR_MESSAGES.defaultError500.details,
                },
              );
              break;
            case 0:
              if (err.statusText === 'Unknown Error') {
                this.showError(
                  {
                    key: 'AbpAccount::DefaultErrorMessage',
                    defaultValue: DEFAULT_ERROR_MESSAGES.defaultError.title,
                  },
                  err.message,
                );
              }
              break;
            default:
              this.showError(DEFAULT_ERROR_MESSAGES.defaultError.details, DEFAULT_ERROR_MESSAGES.defaultError.title);
              break;
          }
        }
      });
  }

  private showError(message?: Config.LocalizationParam, title?: Config.LocalizationParam, body?: any): Observable<boolean> {
    if (body) {
      if (body.details) {
        message = body.details;
        title = body.message;
      } else if (body.message) {
        title = DEFAULT_ERROR_MESSAGES.defaultError.title;
        message = body.message;
      } else {
        message = body.message || DEFAULT_ERROR_MESSAGES.defaultError.title;
      }
    }

    const strTitle = this.localizationService.instant(title);
    const strMsg = this.localizationService.instant(message);

    const closeCB = new EventEmitter<boolean>();

    this.modal.error({
      nzTitle: strTitle,
      nzContent: strMsg,
      nzAfterClose: closeCB,
    });

    return closeCB;
  }

  private navigateToLogin() {
    this.store.dispatch(
      new Navigate(['/passport/login'], null, {
        state: { redirectUrl: this.store.selectSnapshot(RouterState.url) },
      }),
    );
  }
}
