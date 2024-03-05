import request from "utils/request.ts";
import { friendParamsType, FriendLinkItem } from "@/types/friendLink";
import { responseData } from "@/types/userInfo";

// 获取申请友链列表
export const manageFriendList = (params: friendParamsType) => {
  return request.get<responseData>("/w1/sys/friend/manageList", params);
};

// 更新友链
export const updateFriendLink = (data: FriendLinkItem) => {
  return request.post<responseData>("/w1/sys/friend/update", data);
};

// 创建友链
export const createFriendLink = (data: FriendLinkItem) => {
  return request.post<responseData>("/w1/sys/friend/create", data);
};
