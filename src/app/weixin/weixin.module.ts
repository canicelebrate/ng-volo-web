import { ABP, SettingTabsService } from '@abp/ng.core';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SetingsComponent } from './setting.component';
import { WeixinRoutingModule } from './weixin-routing.module';

const COMPONENTS = [SetingsComponent];
const COMPONENTS_NOROUNT = [];

// 模块初始化代码
// 利用SettingTabsService.add方法将设置页面组件添加到设置组件集合中
// 整个应用的设置组件也会使用SettingTabsService来获取需要显示的相关配置组件
export function setupWeixinSettingsFactory(settingTabsService: SettingTabsService) {
  return () => settingTabsService.add([{ component: SetingsComponent, name: '微信设置' } as ABP.Tab]);
}

@NgModule({
  imports: [SharedModule, WeixinRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class WeixinModule {
  // 在上层业务模块中调用forRoot方法
  static forRoot(): ModuleWithProviders<WeixinModule> {
    return {
      ngModule: WeixinModule,
      providers: [
        {
          // 通过APP_INITIALIZER方式来触发factory方法
          provide: APP_INITIALIZER,
          multi: true,
          deps: [SettingTabsService],
          useFactory: setupWeixinSettingsFactory,
        },
      ],
    };
  }
}
