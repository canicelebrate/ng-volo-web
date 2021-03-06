import { ABP } from '@abp/ng.core';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { PagedListingComponentBase } from '@shared';
import { UsersEditComponent } from './edit/edit.component';

import { Identity, IdentityState, IdentityStateService } from 'src/app/volo/identity';
import { Select, Store } from '@ngxs/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, zip } from 'rxjs';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import snq from 'snq';
import { UsersCreateComponent } from './create/create.component';

@Component({
  selector: 'app-users-users',
  templateUrl: './users.component.html',
})
export class UsersComponent extends PagedListingComponentBase<ABP.BasicItem> implements OnInit {
  @Select(IdentityState.getUsers)
  data$: Observable<Identity.UserItem[]>;

  @Select(IdentityState.getUsersTotalCount)
  totalCount$: Observable<number>;

  pageQuery: ABP.PageQueryParams = { maxResultCount: 10 };

  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名',
      },
    },
  };

  @ViewChild('st', { static: true }) st: STComponent;
  columns: STColumn[] = [
    { title: '用户名', index: 'userName' },
    { title: '全名', index: 'name' },
    { title: '邮件', width: '50px', index: 'email' },
    { title: '已锁定', type: 'yn', index: 'isLockedOut' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          modal: {
            component: UsersEditComponent,
          },
          // paramsName: 'record',
          params: (record: STData) => {
            return { record };
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
          popTitle: '确定删除该用户？',
          click: (record: STData, modal?: any, instance?: STComponent) => {
            this.confirmDelete(record, modal, instance);
          },
        },
      ],
    },
  ];

  constructor(
    injector: Injector,
    private http: _HttpClient,
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
    this.modal.createStatic(UsersCreateComponent, { i: { id: 0 } }).subscribe((m) => {
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
      .dispatchGetUsers(this.pageQuery)
      .pipe(
        finalize(() => {
          finishedCallback();
        }),
      )
      .subscribe((result: any) => {
        // this.data = this.identityStateService.getUsers();

        zip(this.data$, this.totalCount$).subscribe(([data, totalCount]) => {
          // this.users = result.items;
          this.showPaging(data, totalCount, pageNumber);
        });
      });
  }

  confirmDelete(record: STData, modal?: any, instance?: STComponent) {
    this.identityStateService.dispatchDeleteUser(record.id).subscribe(() => {
      this.message.create('success', '删除用户成功！');
      this.refresh();
    });
  }

  protected delete(entity: ABP.BasicItem) {}

  change(evt: STChange) {
    if (evt.type === 'pi') {
      this.getDataPage(evt.pi);
    }
  }

  doSearch(val: any) {
    this.pageQuery.filter = val.name;
    console.log(val);
    this.getDataPage(1);
  }
}
