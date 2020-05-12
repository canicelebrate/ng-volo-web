import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { Select, Store } from '@ngxs/store';
import {
  GetPermissions,
  PermissionManagement,
  PermissionManagementState,
  PermissionManagementStateService,
  UpdatePermissions,
} from '@permission-management';
import { ProviderWithTitle } from './models';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { Observable } from 'rxjs';
import { finalize, map, pluck, take, takeLast, tap } from 'rxjs/operators';

@Component({
  selector: 'app-permissions',
  templateUrl: './permission.component.html',
})
export class PermissionComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private permissionMgrStateService: PermissionManagementStateService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {}

  // 父组件传递过来的参数
  i = {} as ProviderWithTitle;
  title = '';

  @ViewChild('permissionTree', { static: false })
  treeComponent: NzTreeComponent;

  @Select(PermissionManagementState.getPermissionGroups)
  groups$: Observable<PermissionManagement.Group[]>;

  selectedGroup: PermissionManagement.Group;
  permissions: PermissionManagement.Permission[];

  grpTreeNodeMap = new Map<string, NzTreeNode[]>();

  tabPosition = 'left';
  expandAll = true;

  grpData: NzTreeNode[];
  expandedKeys = [];
  checkedKeys = [];

  changedPermissions = [] as PermissionManagement.MinimumPermission[];

  grpExpandedKeysMap = new Map<string, string[]>();
  grpCheckedKeysMap = new Map<string, string[]>();

  saving = false;

  ngOnInit(): void {
    if (this.i) {
      this.title = this.i.title;
    }

    this.permissionMgrStateService
      .dispatchGetPermissions({
        providerKey: this.i.providerKey,
        providerName: this.i.providerName,
      })
      .subscribe((_) => {
        const grps = this.permissionMgrStateService.getPermissionGroups();
        this.selectedGroup = grps[0];
        this.permissions = this.getPermissions(grps);
        this.buildSelectedGrpData();
      });
  }

  save(value: any) {
    this.saving = true;
    this.store
      .dispatch(
        new UpdatePermissions({
          providerKey: this.i.providerKey,
          providerName: this.i.providerName,
          permissions: this.changedPermissions,
        }),
      )
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }

  private getPermissions(groups: PermissionManagement.Group[]) {
    return groups.reduce((acc, val) => [...acc, ...val.permissions], []);
  }

  selectedGrpIndexChange(index: number) {
    console.log(index);

    const grps = this.permissionMgrStateService.getPermissionGroups();
    if (grps) {
      this.selectedGroup = grps[index];
      this.expandedKeys = [];
      this.checkedKeys = [];

      this.buildSelectedGrpData();
    }
  }

  buildSelectedGrpData(): void {
    if (!this.selectedGroup) {
      this.grpData = [];
      this.expandedKeys = [];
      this.checkedKeys = [];
      return;
    }

    if (this.grpTreeNodeMap.has(this.selectedGroup.name)) {
      this.grpData = this.grpTreeNodeMap.get(this.selectedGroup.name);
      this.expandedKeys = this.grpExpandedKeysMap.get(this.selectedGroup.name);
      this.checkedKeys = this.grpCheckedKeysMap.get(this.selectedGroup.name);
      return;
    }

    if (this.selectedGroup) {
      const permissionTreeRootNodes = [] as NzTreeNode[];
      const expandedKeys = [] as string[];
      const checkedKeys = [] as string[];

      this.selectedGroup.permissions
        .filter((value) => !value.parentName || value.parentName.length === 0)
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .forEach((value, index, permissions) => {
          const node = {
            title: value.displayName,
            key: value.name,
            level: 0,
          } as NzTreeNode;

          expandedKeys.push(value.name);
          permissionTreeRootNodes.push(node);
          if (value.isGranted) {
            if (this.permissions.filter((c) => c.parentName === value.name && !c.isGranted).length === 0) {
              checkedKeys.push(value.name);
            }
          }

          this.populateChildrenNodes(value, node, checkedKeys);
        });

      this.grpTreeNodeMap.set(this.selectedGroup.name, permissionTreeRootNodes);
      this.grpExpandedKeysMap.set(this.selectedGroup.name, expandedKeys);
      this.grpCheckedKeysMap.set(this.selectedGroup.name, checkedKeys);

      this.grpData = permissionTreeRootNodes;
      this.expandedKeys = expandedKeys;
      this.checkedKeys = checkedKeys;
    } else {
      this.grpData = [];
      this.expandedKeys = [];
      this.checkedKeys = [];
    }
  }

  private populateChildrenNodes(parentPermission: PermissionManagement.Permission, parentNode: NzTreeNode, checkedKeys: string[]): void {
    parentNode.children = [];
    this.permissions
      .filter((v) => v.parentName === parentPermission.name)
      .forEach((child) => {
        parentNode.children.push({
          title: child.displayName,
          key: `${child.name}`,
          level: 1,
          isLeaf: true,
          isDisableCheckbox: this.isGrantedByOtherProviderName(child.grantedProviders),
        } as NzTreeNode);

        if (child.isGranted) {
          checkedKeys.push(child.name);
        }
      });
  }

  isGrantedByOtherProviderName(grantedProviders: PermissionManagement.GrantedProvider[]): boolean {
    if (grantedProviders.length) {
      return grantedProviders.findIndex((p) => p.providerName !== this.i.providerName) > -1;
    }
    return false;
  }

  //region events
  checkBoxChange($event: NzFormatEmitEvent) {
    const permission = this.permissions.find((p) => p.name === $event.node?.key);

    // 更新checkbox的选中状态
    this.grpCheckedKeysMap.set(this.selectedGroup.name, this.treeComponent.getCheckedNodeList().map((n) => n.key) ?? []);
    if ($event.node?.isChecked && this.hasChildPermission(permission)) {
      const childKeys = this.getChildMutablePermissions(permission).map((p) => p.name);
      const existingCheckedKeys = this.grpCheckedKeysMap.get(this.selectedGroup.name);
      this.grpCheckedKeysMap.set(this.selectedGroup.name, [...existingCheckedKeys, ...childKeys]);
    }

    this.trackChange({ name: permission.name, isGranted: $event.node?.isChecked });
  }

  trackChange(permission: PermissionManagement.MinimumPermission) {
    const found = this.changedPermissions.findIndex((v, i, arr) => v.name === permission.name) !== -1;

    // 记录修改情况
    if (!found) {
      this.changedPermissions.push(permission);
    } else {
      const p = this.changedPermissions.find((p) => p.name === permission.name);
      if (p) {
        p.isGranted = permission.isGranted;
      }
    }

    if (this.hasChildPermission(permission)) {
      const childMutablePermissions = this.getChildMutablePermissions(permission);
      for (const childPermission of childMutablePermissions) {
        this.trackChange({ name: childPermission.name, isGranted: permission.isGranted });
      }
    }
  }

  hasChildPermission(permission: PermissionManagement.MinimumPermission): boolean {
    return this.permissions.findIndex((p) => p.parentName === permission.name) !== -1;
  }

  getChildMutablePermissions(permission: PermissionManagement.MinimumPermission): PermissionManagement.MinimumPermission[] {
    return this.permissions
      .filter(
        (p) =>
          p.parentName === permission.name && (!p.isGranted || (p.isGranted && !this.isGrantedByOtherProviderName(p.grantedProviders))),
      )
      .map((p1) => ({ name: p1.name, isGranted: p1.isGranted }));
  }

  expandChange($event: NzFormatEmitEvent) {
    this.grpExpandedKeysMap.set(
      this.selectedGroup.name,
      this.treeComponent.getExpandedNodeList().map((n) => n.key),
    );
  }
}
