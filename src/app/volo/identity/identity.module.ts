import { CoreModule, LazyModuleFactory } from '@abp/ng.core';
import { ModuleWithProviders, NgModule, NgModuleFactory } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { PermissionManagementModule } from '../permission-management';
import { IdentityState } from './states/identity.state';

@NgModule({
  imports: [NgxsModule.forFeature([IdentityState]), CoreModule, PermissionManagementModule],
})
export class IdentityModule {
  static forChild(): ModuleWithProviders<IdentityModule> {
    return {
      ngModule: IdentityModule,
      providers: [],
    };
  }

  static forLazy(): NgModuleFactory<IdentityModule> {
    return new LazyModuleFactory(IdentityModule.forChild());
  }
}
