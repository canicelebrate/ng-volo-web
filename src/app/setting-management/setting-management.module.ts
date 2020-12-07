import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SettingManagementComponent } from './component/setting-management.component';
import { SettingManagementRoutingModule } from './setting-management-routing.module';

const COMPONENTS = [SettingManagementComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, SettingManagementRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SettingManagementModule {}
