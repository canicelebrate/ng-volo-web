
import { DecodedUserInfo } from './decoded-user-info';
export class MpAuthenticateResultModel  {
  accessToken: string;
  externalUser: any;
  sessionKey: string;

  constructor(initialValues: Partial<MpAuthenticateResultModel> = {}) {
    if (initialValues) {
      for (const key in initialValues) {
        if (initialValues.hasOwnProperty(key)) {
          this[key] = initialValues[key];
        }
      }
    }
  }
}
