import { CreateUser, Identity, IdentityStateService } from '@abp/ng.identity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-users-create',
  templateUrl: './create.component.html',
})
export class UsersCreateComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('sfRoles', { static: false }) sfRoles: SFComponent;
  record: any = {};
  i: any = {};
  saving = false;
  schema: SFSchema = {
    properties: {
      userName: { type: 'string', title: '用户名' },
      name: { type: 'string', title: '姓名', maxLength: 15 },
      phoneNumber: { type: 'string', title: '电话', maxLength: 15 },
      email: { type: 'string', title: '邮箱', format: 'email' },
      password: { type: 'string', title: '密码' },
      confirmPassword: { type: 'string', title: '确认密码' },
    },
    required: ['userName', 'name', 'phoneNumber', 'email', 'password', 'confirmPassword'],
    ui: {
      order: ['userName', 'name', 'phoneNumber', 'email', 'password', 'confirmPassword', '*'],
    },
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $password: {
      widget: 'string',
      type: 'password',
    },
    $confirmPassword: {
      widget: 'string',
      type: 'password',
    },
  };

  rolesSchema: SFSchema = {
    properties: {
      roleNames: {
        type: 'string',
        title: '角色',
        ui: {
          widget: 'transfer',
          titles: ['未拥有', '已拥有'],
        },
      },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private identityStateService: IdentityStateService,
  ) {}

  ngOnInit(): void {
    // if (this.record.id > 0) {
    //   this.http.get(`/user/${this.record.id}`).subscribe((res) => (this.i = res));
    // }
  }

  save() {
    const value = this.sf.value;
    value.lockoutEnabled = false;
    value.twoFactorEnabled = false;
    value.surname = '';
    value.roleNames = this.sfRoles.value.roleNames;
    value.skipHandleError = true;
    this.saving = true;
    this.identityStateService

      .dispatchCreateUser(value as Identity.UserSaveRequest)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe(() => {
        // 尝试从API获取新的用户列表数据
        this.identityStateService.dispatchGetUsers();
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }

  get valid(): boolean {
    if (!this.sf || !this.sfRoles) {
      return false;
    }
    return this.sf.valid; // && this.sfRoles.valid;
  }
}
