import { newRegister } from "./home.ts";
// 用户操作
export interface userOptlogsItem {
  actionId: string;
  address: string;
  content: string;
  createdAt: string;
  module: string;
  operator: string;
  operatorIP: string;
  operatorId: string;
  platform: string;
  updatedAt: string;
}
// 请求参数
export interface userOptlogsParamsType extends newRegister {
  nickname: string;
  module: string;
  platform: string;
  operatorIP: string;
}
