import request from "utils/request.ts";
import {
  userLogin,
  userRegister,
  userEmail,
  responseData,
  emitUserInfo,
  getUserListParams,
} from "@/types/userInfo";

// 用户登录
export const userLoginAPI = (data: userLogin) => {
  return request.post<responseData>("/w1/sys/auth/login", data);
};

// 用户注册
export const userRegisterAPI = (data: userRegister) => {
  return request.post<responseData>("/w1/sys/auth/register", data);
};

// 邮箱验证码
export const userEmailAPI = (params: userEmail) => {
  return request.get<responseData>("/w1/sys/auth/emailConfirmCode", params);
};

// 登录验证码
export const userLoginCodeAPI = () => {
  return request.get<responseData>("/w1/sys/auth/captcha");
};

// 修改用户信息
export const emitUserInfoAPI = (data: emitUserInfo) => {
  return request.post<responseData>("/w1/sys/auth/emitUser", data);
};

// 获取用户列表
export const getUserList = (params: getUserListParams) => {
  return request.get<responseData>("/w1/manage/user/list", params);
};

// 重置用户密码
export const resetUserPassword = (data: { userId: string }) => {
  return request.post<responseData>("/w1/manage/user/resetPassword", data);
};

// 是否启用账户
export const userIsEnable = (data: { userId: string; status: number }) => {
  return request.post<responseData>("/w1/manage/user/userIsEnable", data);
};
