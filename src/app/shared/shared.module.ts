import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';

// import { AppComponentBase } from './app-component-base';
// import { PagedListingComponentBase } from './paged-listing-component-base';
// #region third libs
import { noop } from '@abp/ng.core';
import { AEErrorHandler } from './handlers/aeerror-handler.service';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
const THIRDMODULES = [];

// #endregion

// #region your componets & directives

const COMPONENTS = [];
const DIRECTIVES = [];

// #endregion

// #region baisic components
// const ABSTRACT_COMPONENTS = [AppComponentBase, PagedListingComponentBase];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  providers: [{ provide: APP_INITIALIZER, deps: [AEErrorHandler], useFactory: noop, multi: true }],
  // providers: [{ provide: AEErrorHandler, useClass: AEErrorHandler, multi: false }],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
