import { newRegister } from "./home.ts";
// 获取权限列表参数
export interface permissionsListType {
  remark: string;
}
export interface createPermissionsType {
  remark?: string;
  key?: string;
  parent_key?: string;
  auth?: number;
  permissionId: string;
}

export interface updatePermissionsType extends createPermissionsType {
  status?: number;
  disabled?: number;
}
