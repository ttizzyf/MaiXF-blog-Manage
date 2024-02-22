import { newRegister } from "./home.ts";

export interface getRolesListType extends newRegister {
  roleName: string;
}

export interface createRolesType {
  roleId: string;
  roleName: string;
  roleAuth: string;
  remark: string;
  perms: string;
}
