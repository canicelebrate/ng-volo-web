import { Component, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import { Identity, IdentityState, IdentityStateService, UpdateRole } from 'src/app/volo/identity';

@Component({
  selector: 'app-roles-edit',
  templateUrl: './edit.component.html',
})
export class RolesEditComponent implements OnInit {
  record: Identity.RoleItem;
  saving = false;

  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 50 },
      isDefault: { type: 'boolean', title: '默认' },
      isPublic: { type: 'boolean', title: '公开' },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private identityStateService: IdentityStateService,
  ) {}

  ngOnInit(): void {}

  save(value: any) {
    const roleValue = value as Identity.RoleItem;
    roleValue.id = this.record.id;
    roleValue.isStatic = this.record.isStatic;
    roleValue.concurrencyStamp = this.record.concurrencyStamp;

    this.saving = true;
    this.identityStateService
      .dispatchUpdateRole(roleValue)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((_) => {
        this.msgSrv.success('角色编辑成功');
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }
}
