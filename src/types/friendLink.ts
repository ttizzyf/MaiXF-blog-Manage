export interface friendParamsType {
  id?: string;
  pageSize: number;
  pageNum: number;
  email: string;
  linkName: string;
}

export interface FriendLinkItem {
  id?: string;
  email?: string;
  linkName?: string;
  link?: string;
  describe?: string;
  isShow?: number;
  status?: number;
  [key: string]: string | number | undefined; // 添加索引签名
}
