import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import {
  permissionsListType,
  createPermissionsType,
  updatePermissionsType,
} from "@/types/permissions.ts";

// 获取权限列表
export const getPermissionsList = (params: permissionsListType) => {
  return request.get<responseData>("/w1/sys/permissions/list", params);
};

// 新建权限
export const createPermissions = (data: createPermissionsType) => {
  return request.post<responseData>("/w1/sys/permissions/create", data);
};

// 更新权限
export const updatePermissions = (data: updatePermissionsType) => {
  return request.post<responseData>("/w1/sys/permissions/update", data);
};
