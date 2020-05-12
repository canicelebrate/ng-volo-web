import { ABP } from '@abp/ng.core';
import { Select, Store } from '@ngxs/store';
import { PagedListingComponentBase } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, zip } from 'rxjs';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import { Identity, IdentityState, IdentityStateService } from 'src/app/volo/identity';

import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STColumnButton, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';

import { PermissionComponent } from '../permission/permission.component';
import { RolesCreateComponent } from './create/create.component';
import { RolesEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-roles-roles',
  templateUrl: './roles.component.html',
})
export class RolesComponent extends PagedListingComponentBase<ABP.BasicItem> implements OnInit {
  @Select(IdentityState.getRoles)
  data$: Observable<Identity.RoleItem[]>;

  @Select(IdentityState.getRolesTotalCount)
  totalCount$: Observable<number>;

  pageQuery: ABP.PageQueryParams = { maxResultCount: 10 };

  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '角色名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '默认', index: 'isDefault', type: 'yn' },
    { title: '公开', index: 'isPublic', type: 'yn' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: RolesEditComponent,
            params: (record: STData) => {
              return { record };
            },
          },

          click: (record, modal) => {
            // 在编辑页面，用户成功保持了数据
            if (modal === true) {
              this.refresh();
            }
          },
        },
        {
          text: '权限',
          icon: 'security-scan',
          type: 'modal',
          modal: {
            component: PermissionComponent,
            params: (record: STData) => {
              const i = { providerName: 'R', providerKey: record.name, title: `角色${record.name}` };
              return { i };
            },
            paramsName: 'i',
          },
          click: (record, modal) => {
            // 在编辑页面，用户成功保持了数据
            if (modal === true) {
              this.refresh();
            }
          },
        },
        {
          text: '删除',
          icon: 'close',
          type: 'del',
          iif: (item: STData, btn: STColumnButton, column: STColumn) => !item.isStatic,
          iifBehavior: 'disabled',
          popTitle: '确定删除该角色？',
          click: (record: STData, modal?: any, instance?: STComponent) => {
            this.confirmDelete(record, modal, instance);
          },
        },
      ],
    },
  ];

  constructor(
    injector: Injector,
    private modal: ModalHelper,
    private identityStateService: IdentityStateService,
    private message: NzMessageService,
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.st.page.front = false;
  }

  add() {
    this.modal.createStatic(RolesCreateComponent, { i: { id: 0 } }).subscribe((m) => {
      if (m === true) {
        this.st.reload();
      }
    });
  }

  protected getReq(): ABP.PageQueryParams {
    return this.pageQuery;
  }

  protected list(request: ABP.PageQueryParams, pageNumber: number, finishedCallback: any): void {
    this.identityStateService
      .dispatchGetRoles(this.pageQuery)
      .pipe(
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe((result: any) => {
        zip(this.data$, this.totalCount$).subscribe(([data, totalCount]) => {
          // this.users = result.items;
          this.showPaging(data, totalCount, pageNumber);
        });
      });
  }

  confirmDelete(record: STData, modal?: any, instance?: STComponent) {
    this.identityStateService.dispatchDeleteRole(record.id).subscribe(() => {
      this.message.create('success', '删除角色成功！');
      this.refresh();
    });
  }

  protected delete(entity: ABP.BasicItem) {}

  change(evt: STChange) {
    if (evt.type === 'pi') {
      this.getDataPage(evt.pi);
    }
  }
}
