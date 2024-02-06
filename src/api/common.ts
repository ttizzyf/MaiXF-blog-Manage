import request from "utils/request.ts";
import { visitor } from "@/types/common.ts";
// 记录访问记录
export const visitorRecord = (data: visitor) => {
  return request.post("/w1/sys/visitor/record", data);
};
// 上传文件
export const uploadFile = (data: any) => {
  return request.post("/w1/common/upload", data);
};
