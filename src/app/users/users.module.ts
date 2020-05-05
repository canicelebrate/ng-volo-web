// import { IdentityModule } from '@abp/ng.identity';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UsersRoutingModule } from './users-routing.module';
import { UsersCreateComponent } from './users/create/create.component';
import { UsersEditComponent } from './users/edit/edit.component';
import { UsersComponent } from './users/users.component';
import { UsersViewComponent } from './users/view/view.component';

const COMPONENTS = [UsersComponent];
const COMPONENTS_NOROUNT = [UsersEditComponent, UsersViewComponent, UsersCreateComponent];

@NgModule({
  imports: [SharedModule, UsersRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class UsersModule {}
