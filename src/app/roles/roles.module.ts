import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PermissionComponent } from '../permission/permission.component';
import { RolesCreateComponent } from './create/create.component';
import { RolesEditComponent } from './edit/edit.component';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';

const COMPONENTS = [RolesComponent];
const COMPONENTS_NOROUNT = [RolesEditComponent, RolesCreateComponent, PermissionComponent];

@NgModule({
  imports: [SharedModule, RolesRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RolesModule {}
