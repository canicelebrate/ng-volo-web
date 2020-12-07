

import { DecodeEntityBase } from './decode-entity-base';

export class DecodedUserInfo extends DecodeEntityBase {
  openId: string;
  nickName: string;
  gender: number;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
  unionId: string;

  constructor(initialValues: Partial<DecodedUserInfo> = {}) {
    super(initialValues);
  }
}
