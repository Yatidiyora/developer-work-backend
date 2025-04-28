import { RolePermissionDetailsModel } from '../../models/pg';

export interface RolePermission {
  roleId?: string;
  permissionId: string;
  permissionName: string;
  view: number;
  edit: number;
  delete: number;
}
export interface RolePermissionsById {
  id: string;
  name: string;
  permissions: RolePermissionDetailsModel[];
  createdAt: Date;
  updatedAt: Date;
}
