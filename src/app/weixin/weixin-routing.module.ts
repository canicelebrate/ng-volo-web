import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetingsComponent } from './setting.component';

const routes: Routes = [{ path: 'setting', component: SetingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeixinRoutingModule {}
