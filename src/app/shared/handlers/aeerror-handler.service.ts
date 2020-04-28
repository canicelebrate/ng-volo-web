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
import { /*ErrorHandler*/ ErrorScreenErrorCodes, HttpErrorConfig } from '@abp/ng.theme.shared';
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
export class AEErrorHandler /*extends ErrorHandler*/ {
  constructor(
    private actions: Actions,
    private store: Store,
    private appRef: ApplicationRef,
    private cfRes: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private injector: Injector,
    @Inject('HTTP_ERROR_CONFIG') private httpErrorConfig: HttpErrorConfig,
    private modal: NzModalService,
    private localizationService: LocalizationService,
  ) {
    // super(actions, store, appRef, cfRes, rendererFactory, injector, httpErrorConfig);

    this.listenToRestError();
    // this.listenToRouterError();
    this.listenToRouterDataResolved();
  }

  // private listenToRouterError() {
  //   this.actions.pipe(ofActionSuccessful(RouterError), filter(this.filterRouteErrors)).subscribe(
  //     () => this.show404Page())
  //     ;
  // }

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
        filter(this.filterRestErrors),
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

  // private show401Page() {
  //   this.createErrorComponent({
  //     title: {
  //       key: 'AbpAccount::401Message',
  //       defaultValue: DEFAULT_ERROR_MESSAGES.defaultError401.title,
  //     },
  //     status: 401,
  //   });
  // }

  // private show404Page() {
  //   this.createErrorComponent({
  //     title: {
  //       key: 'AbpAccount::404Message',
  //       defaultValue: DEFAULT_ERROR_MESSAGES.defaultError404.title,
  //     },
  //     status: 404,
  //   });
  // }

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

  // createErrorComponent(instance: Partial<HttpErrorWrapperComponent>) {
  // const renderer = this.rendererFactory.createRenderer(null, null);
  // const host = renderer.selectRootElement(document.body, true);
  // this.componentRef = this.cfRes
  //   .resolveComponentFactory(HttpErrorWrapperComponent)
  //   .create(this.injector);
  // for (const key in instance) {
  //   /* istanbul ignore else */
  //   if (this.componentRef.instance.hasOwnProperty(key)) {
  //     this.componentRef.instance[key] = instance[key];
  //   }
  // }
  // this.componentRef.instance.hideCloseIcon = this.httpErrorConfig.errorScreen.hideCloseIcon;
  // if (this.canCreateCustomError(instance.status as ErrorScreenErrorCodes)) {
  //   this.componentRef.instance.cfRes = this.cfRes;
  //   this.componentRef.instance.appRef = this.appRef;
  //   this.componentRef.instance.injector = this.injector;
  //   this.componentRef.instance.customComponent = this.httpErrorConfig.errorScreen.component;
  // }
  // this.appRef.attachView(this.componentRef.hostView);
  // renderer.appendChild(host, (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0]);
  // const destroy$ = new Subject<void>();
  // this.componentRef.instance.destroy$ = destroy$;
  // destroy$.subscribe(() => {
  //   this.componentRef.destroy();
  //   this.componentRef = null;
  // });
  // }

  canCreateCustomError(status: ErrorScreenErrorCodes): boolean {
    return snq(() => this.httpErrorConfig.errorScreen.component && this.httpErrorConfig.errorScreen.forWhichErrors.indexOf(status) > -1);
  }

  private filterRestErrors = ({ status }: HttpErrorResponse): boolean => {
    if (typeof status !== 'number') {
      return false;
    }

    return this.httpErrorConfig.skipHandledErrorCodes.findIndex((code) => code === status) < 0;
  }

  private filterRouteErrors = (instance: RouterError<any>): boolean => {
    return (
      snq(() => instance.event.error.indexOf('Cannot match') > -1) &&
      this.httpErrorConfig.skipHandledErrorCodes.findIndex((code) => code === 404) < 0
    );
  }
}
