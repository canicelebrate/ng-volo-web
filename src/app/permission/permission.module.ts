import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionComponent } from './permission.component';
const COMPONENTS = [];
const COMPONENTS_NOROUNT = [PermissionComponent];

@NgModule({
  imports: [SharedModule, PermissionRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class PermissionModule {}
