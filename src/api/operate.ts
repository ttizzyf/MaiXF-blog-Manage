import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { userOptlogsParamsType } from "@/types/userOpt.ts";

// 获取用户操作日志列表
export const getOptlogsList = (params: userOptlogsParamsType) => {
  return request.get<responseData>("/w1/manage/operate/list", params);
};

// 批量删除用户操作日志
export const delOptlogsList = (data: Array<string>) => {
  return request.post<responseData>("/w1/manage/operate/deteleList", data);
};
