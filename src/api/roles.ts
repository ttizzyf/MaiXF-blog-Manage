import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { getRolesListType, createRolesType } from "@/types/roles.ts";
// 获取角色列表
export const getRolesList = (params: getRolesListType) => {
  return request.get<responseData>("/w1/manage/roles/list", params);
};
// 新建角色
export const createRoles = (data: createRolesType) => {
  return request.post<responseData>("/w1/manage/roles/create", data);
};
// 更新角色
export const updateRoles = (data: createRolesType) => {
  return request.post<responseData>("/w1/manage/roles/update", data);
};
// 删除角色
export const deleteRoleById = (data: { roleId: string }) => {
  return request.post<responseData>("/w1/manage/roles/delete", data);
};
// 根据角色查询权限
export const getRolesPerms = (params: { roleAuth: string }) => {
  return request.get<responseData>("/w1/manage/roles/rolesPerms", params);
};
