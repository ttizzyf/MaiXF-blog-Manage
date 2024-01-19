import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { browsing } from "@/types/home";
// 获取博客首页列表
export const getBlogInfoList = () => {
  return request.get<responseData>("/w1/manage/home/browsing");
};
// 获取一周内用户注册和访问情况
export const getWeekVistorAndRegister = () => {
  return request.get<responseData<browsing>>(
    "/w1/manage/home/weekVistorAndRegister"
  );
};
