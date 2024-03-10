import request from "utils/request.ts";
import { visitor } from "@/types/common.ts";
import { responseData } from "@/types/userInfo";
// 记录访问记录
export const visitorRecord = (data: visitor) => {
  return request.post("/w1/sys/visitor/record", data);
};
// 上传文件
export const uploadFile = (data: any) => {
  return request.post("/w1/common/upload", data);
};
// 网站信息加载
export const loadWebSetting = () => {
  return request.get<responseData>("/w1/common/webSetting");
};
// 更新网站信息设置
export const updateWebSetting = (data: any) => {
  return request.post<responseData>("/w1/common/webSetting/update", data);
};
