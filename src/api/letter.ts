import request from "utils/request.ts";
import { responseData } from "@/types/userInfo";
import { letterListType } from "@/types/letter.ts";

// 获取私信列表
export const getLetterList = (params: letterListType) => {
  return request.get<responseData>("/w1/sys/letter/list", params);
};

// 回复私信
export const replyLetter = (data: {
  replyContent: string;
  email: string;
  id: string;
}) => {
  return request.post<responseData>("/w1/sys/letter/reply", data);
};

// 更新私信状态
export const updateLetter = (data: {
  id: string;
  isRead?: number;
  isReply?: number;
  status?: number;
}) => {
  return request.post<responseData>("/w1/sys/letter/update", data);
};
