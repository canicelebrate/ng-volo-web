import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MpAuthenticateModel, MpAuthenticateResultModel} from '../models';

@Injectable({providedIn: 'root'})
export class WexinService {
  apiName = 'Default';

  constructor(private restService: RestService) {}

 miniAuthByLoginModel(body: MpAuthenticateModel): Observable<MpAuthenticateResultModel> {
   return this.restService.request({ url: '/api/weixin/wexin/miniAuth', method: 'POST', body }, { apiName: this.apiName });
 }
 updateSettingsBySettings(body: any): Observable<boolean> {
   return this.restService.request({ url: '/api/weixin/wexin/settings', method: 'PUT', body }, { apiName: this.apiName });
 }
}
