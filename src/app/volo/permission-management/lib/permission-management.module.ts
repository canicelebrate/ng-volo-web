import { CoreModule } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { PermissionManagementState } from './states/permission-management.state';

@NgModule({
  imports: [CoreModule, NgxsModule.forFeature([PermissionManagementState])],
})
export class PermissionManagementModule {}
