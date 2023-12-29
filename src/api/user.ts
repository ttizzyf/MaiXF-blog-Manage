import request from "utils/request.ts";
import {
  userLogin,
  userRegister,
  userEmail,
  responseData,
  emitUserInfo,
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
