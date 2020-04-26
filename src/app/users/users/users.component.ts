import { ABP } from '@abp/ng.core';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { PagedListingComponentBase } from '@shared';
import { UsersEditComponent } from './edit/edit.component';

import { Identity, IdentityState, IdentityStateService } from '@abp/ng.identity';
import { Select, Store } from '@ngxs/store';
import { Observable, zip } from 'rxjs';
import { finalize, pluck, switchMap, take } from 'rxjs/operators';
import snq from 'snq';

@Component({
  selector: 'app-users-users',
  templateUrl: './users.component.html',
})
export class UsersComponent extends PagedListingComponentBase<ABP.BasicItem> implements OnInit {
  data: Identity.UserItem[];

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
    { title: '激活状态', type: 'yn', index: '!isDeleted' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'modal',
          component: UsersEditComponent,
          // paramsName: 'record',
          params: (record: STData) => {
            return { i: record };
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
  ) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.st.page.front = false;
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
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
        this.data = this.identityStateService.getUsers();

        zip(this.totalCount$).subscribe(([totalCount]) => {
          // this.users = result.items;
          this.showPaging(this.data, totalCount, pageNumber);
        });
      });
  }

  confirmDelete(record: STData, modal?: any, instance?: STComponent) {
    // this.delete(record as UserDto);
  }

  delete(user: any): void {
    // this._userService
    //   .delete(user.id)
    //   .pipe(finalize(() => {}))
    //   .subscribe(() => {
    //     abp.notify.info(`删除用户${user.name}成功!`);
    //     this.refresh();
    //   });
  }

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
