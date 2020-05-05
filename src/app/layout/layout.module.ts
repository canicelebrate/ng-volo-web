import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';

import { LayoutDefaultComponent } from './default/default.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';

import { SettingDrawerItemComponent } from './default/setting-drawer/setting-drawer-item.component';
import { SettingDrawerComponent } from './default/setting-drawer/setting-drawer.component';

const SETTINGDRAWER = [SettingDrawerComponent, SettingDrawerItemComponent];

const COMPONENTS = [LayoutDefaultComponent, LayoutFullScreenComponent, HeaderComponent, SidebarComponent, ...SETTINGDRAWER];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
];

// passport
import { AccountLanguagesComponent } from './passport/account-languages/account-languages.component';
import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule, TranslateModule.forChild()],
  entryComponents: SETTINGDRAWER,
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS, ...PASSPORT, AccountLanguagesComponent],
  exports: [...COMPONENTS, ...PASSPORT],
})
export class LayoutModule {}
