import { Component, OnInit, TrackByFunction } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { ConfigState } from '@abp/ng.core';
import { Store } from '@ngxs/store';

import { ABP, SettingTabsService } from '@abp/ng.core';
import { Subscription } from 'rxjs';
// import { addSettingTab, getSettingTabs, SettingTab } from '@shared';
import { SetSelectedSettingTab } from '../actions/setting-management.actions';
import { SettingManagementState } from '../states/setting-management.state';

@Component({
  selector: 'abp-setting-management',
  templateUrl: './setting-management.component.html',
})
export class SettingManagementComponent implements OnInit {
  private subscription = new Subscription();
  settings: ABP.Tab[] = [];

  get hasSettings() {
    return this.settings.length > 0;
  }

  set selected(value: ABP.Tab) {
    this.store.dispatch(new SetSelectedSettingTab(value));
  }

  get selected(): ABP.Tab {
    const value = this.store.selectSnapshot(SettingManagementState.getSelectedTab);

    if ((!value || !value.component) && this.settings.length) {
      return this.settings[0];
    }
    return value;
  }

  trackByFn: TrackByFunction<ABP.Tab> = (_, item) => item.name;

  constructor(private store: Store, private settingTabs: SettingTabsService) {}

  ngOnInit() {
    this.settingTabs.visible$.subscribe((settings) => {
      this.settings = settings;
      if (!this.selected && this.settings.length) {
        this.selected = this.settings[0];
      }
    });
    //   .filter((setting) => this.store.selectSnapshot(ConfigState.getGrantedPolicy(setting.requiredPolicy)))
    //   .sort((a, b) => a.order - b.order);

    // if (!this.selected && this.settings.length) {
    //   this.selected = this.settings[0];
    // }
  }
}
