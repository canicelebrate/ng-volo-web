import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { Identity, IdentityState, IdentityStateService } from '@identity';
import { createSelector, Select, Selector, Store } from '@ngxs/store';
import { AppComponentBase } from '@shared/app-component-base';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { forkJoin, Observable, zip } from 'rxjs';
import { finalize, take, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-users-users-edit',
  templateUrl: './edit.component.html',
})
export class UsersEditComponent extends AppComponentBase implements OnInit, AfterViewInit {
  constructor(
    injector: Injector,
    private store: Store,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private identityStateService: IdentityStateService,
  ) {
    super(injector);
    this.selectedUsersRoles$ = this.store.select((state) => state.IdentityState.selectedUserRoles);
  }

  get valid(): boolean {
    if (!this.record || !this.sf || !this.sfRoles) {
      return false;
    }
    return this.sf.valid && this.sfRoles.valid;
  }
  @Select(IdentityState.getRoles)
  allRoles$: Observable<Identity.RoleItem[]>;

  selectedUsersRoles$: Observable<Identity.RoleItem[]>;

  record: any = {};
  // i: any;

  saving = false;

  @ViewChild('sf', { static: false }) sf: SFComponent;
  @ViewChild('sfRoles', { static: false }) sfRoles: SFComponent;

  schema: SFSchema = {
    properties: {
      userName: { type: 'string', title: '用户名' },
      name: { type: 'string', title: '姓名', maxLength: 15 },
      phoneNumber: { type: 'string', title: '电话', maxLength: 15 },
      email: { type: 'string', title: '邮箱', format: 'email' },
    },
    required: ['userName', 'name', 'phoneNumber', 'email'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $userName: {
      widget: 'string',
    },
    $name: {
      widget: 'string',
    },
    $phoneNumber: {
      widget: 'string',
    },
    $email: {
      widget: 'string',
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

  @Selector()
  static getSelectedUserRoles() {
    const selector = createSelector([IdentityState], (state: Identity.State) => {
      return state.selectedUserRoles;
    });
    return selector;
  }

  // @Selector()
  // static getCurrentUserRoles({ selectedUserRoles }: Identity.State): Identity.RoleItem[] {
  //   return roles.items || [];
  // }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.record.id && this.record.id.length > 0) {
      this.rolesSchema.properties.roleNames.enum = [];

      zip(this.identityStateService.dispatchGetUserRoles(this.record.id), this.identityStateService.dispatchGetRoles()).subscribe(
        ([storeCtx, _]) => {
          this.rolesSchema.properties.roleNames.enum = [];
          const selectedUserRoles = storeCtx.IdentityState.selectedUserRoles as Identity.RoleItem[];

          this.allRoles$.subscribe((allRoles) => {
            allRoles.forEach((v) => {
              if (this.userInRole(v, selectedUserRoles)) {
                this.rolesSchema.properties.roleNames.enum.push({
                  title: v.name,
                  value: v.name,
                  direction: 'right',
                  disabled: false,
                });
              } else {
                this.rolesSchema.properties.roleNames.enum.push({ title: v.name, value: v.name });
              }
            });

            this.sfRoles.refreshSchema();
          });
        },
      );
    }
  }

  save() {
    this.saving = true;

    const value = this.sf.value;
    value.roleNames = this.sfRoles.value.roleNames;
    value.id = this.record.id;

    const request = value as Identity.UserSaveRequest & { id: string };

    request.password = this.record.password;

    this.identityStateService
      .dispatchUpdateUser(request)
      .pipe(
        finalize(() => {
          this.saving = false;
        }),
      )
      .subscribe(() => {
        this.msgSrv.success(this.l('BookStore::SavedSuccessfully'));
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }

  userInRole(role: Identity.RoleItem, assignedRoles: Identity.RoleItem[]): boolean {
    if (assignedRoles.map((r) => r.name).indexOf(role.name) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}
