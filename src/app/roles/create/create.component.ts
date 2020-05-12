import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import { CreateRole, Identity, IdentityState, IdentityStateService } from 'src/app/volo/identity';

@Component({
  selector: 'app-roles-create',
  templateUrl: './create.component.html',
})
export class RolesCreateComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf: SFComponent;
  record: any = {};
  i: Identity.RoleSaveRequest = { name: '', isDefault: false, isPublic: false };
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
    $name: {
      widget: 'string',
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private identityStateService: IdentityStateService) {}

  ngOnInit(): void {}

  save() {
    const value = this.sf.value as Identity.RoleSaveRequest;

    this.saving = true;
    this.identityStateService
      .dispatchCreateRole(value)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe((_) => {
        this.msgSrv.success('角色创建成功');
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }
}
