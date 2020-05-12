import { PermissionManagement } from '@permission-management';

export type ProviderWithTitle = PermissionManagement.GrantedProvider & { title: string };
