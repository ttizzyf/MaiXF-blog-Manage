import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { browsing, newRegister } from "@/types/home";
// 获取博客首页列表
export const getBlogInfoList = () => {
  return request.get<responseData<browsing>>("/w1/manage/home/browsing");
};
// 获取一周内用户注册和访问情况
export const getWeekVistorAndRegister = () => {
  return request.get<responseData>("/w1/manage/home/weekVistorAndRegister");
};
// 获取用户访问平台方式
export const getvisitorBrowserType = () => {
  return request.get<responseData>("/w1/manage/home/visitorBrowserType");
};
// 获取最新注册用户列表
export const getNewRegisiterList = (params: newRegister) => {
  return request.get<responseData>("/w1/manage/home/registerList", params);
};
