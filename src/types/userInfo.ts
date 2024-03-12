import { newRegister } from "./home.ts";
import { userOptlogsItem } from "./userOpt.ts";
// 邮箱验证码
export interface userEmail {
  email: string;
}

// 响应数据
export interface responseData<T = any> {
  status: number;
  message: string;
  time: number;
  data: T;
}

// 用户信息
export interface GenerateThemeColor extends userEmail {
  userId: Number; // 用户id
  nickname: string; // 用户昵称
  status: Number; //用户状态
  avatar: string; //用户头像
  website: string; // 用户站点
  platform: string; //用户平台
}
// 用户登录
export interface userLogin extends userEmail {
  password: string;
  code: number | null;
  visitor?: string;
}
// 用户注册
export interface userRegister extends userEmail {
  password: string;
  emailCode: number | null;
  nickname?: string;
  website?: string;
}

// 修改用户信息
export interface emitUserInfo {
  email?: string;
  nickname?: string;
  avatar?: string | null;
  website?: string | null;
}

// 获去用户列表参数
export interface getUserListParams {
  pageNum: number;
  pageSize: number;
  email: string;
  nickname: string;
}

export interface userOptLogs extends newRegister {
  userId: string;
}

export interface userOptLogsDataType {
  params: userOptLogs;
  userOptLogsList: Array<userOptlogsItem>;
  username: string;
  userOptlogsTotal: number | null;
}
