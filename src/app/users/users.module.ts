import { IdentityModule } from '@abp/ng.identity';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UsersRoutingModule } from './users-routing.module';
import { UsersEditComponent } from './users/edit/edit.component';
import { UsersComponent } from './users/users.component';
import { UsersViewComponent } from './users/view/view.component';

const COMPONENTS = [UsersComponent];
const COMPONENTS_NOROUNT = [UsersEditComponent, UsersViewComponent];

@NgModule({
  imports: [SharedModule, UsersRoutingModule, IdentityModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class UsersModule {}
