import { CoreModule } from '@abp/ng.core';
import { NgModule, Provider } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { IdentityState } from './states/identity.state';

@NgModule({
  imports: [
    NgxsModule.forFeature([IdentityState]),
    CoreModule,
  ],
})
export class IdentityModule {}
