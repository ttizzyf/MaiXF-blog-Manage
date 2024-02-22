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
