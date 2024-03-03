import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { letterListType } from "@/types/letter.ts";

// 获取私信列表
export const getLetterList = (params: letterListType) => {
  return request.get<responseData>("/w1/sys/letter/list", params);
};
