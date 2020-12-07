import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ConfigStateService } from '@abp/ng.core';

import { WexinService } from './wexin/services/wexin.service';

@Component({
  selector: 'app-weixin-setings-setting',
  templateUrl: './setting.component.html',
})
export class SetingsComponent implements OnInit {
  // id = this.route.snapshot.params.id;
  title = '小程序设置';
  i: any;
  schema: SFSchema = {
    properties: {
      appid: { type: 'string', title: 'AppID', maxLength: 32 },
      appsecret: { type: 'string', title: 'AppSecret', maxLength: 256 },
    },
    required: ['appid', 'appsecret'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $appid: {
      widget: 'string',
    },
    $appsecret: {
      widget: 'string',
    },
  };

  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private config: ConfigStateService,
    private wexinService: WexinService,
  ) {
    this.i = {};
  }

  ngOnInit(): void {
    this.i.appid = this.config.getSetting('WeixinManagement.MiniAppId');
    this.i.appsecret = this.config.getSetting('WeixinManagement.MiniAppSecret');
  }

  save(value: any) {
    const settings = [];
    settings.push({ settingKey: 'WeixinManagement.MiniAppId', settingValue: value.appid });
    settings.push({ settingKey: 'WeixinManagement.MiniAppSecret', settingValue: value.appsecret });

    this.wexinService.updateSettingsBySettings(settings).subscribe((res) => {
      if (res) {
        this.config.dispatchGetAppConfiguration();
        this.msgSrv.success('保存成功');
      } else {
        this.msgSrv.error('保存失败');
      }
    });
  }
}
