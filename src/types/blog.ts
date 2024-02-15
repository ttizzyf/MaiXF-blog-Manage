// 博客列表查询
export interface blogArticleType {
  pageNum: number;
  pageSize: number;
  title?: string;
  category?: number | string;
  recommended?: number | string;
  isReship?: number | string;
}

// 更新博客文章
export interface updateArticleType {
  id?: string;
  title?: string;
  cover?: string;
  abstract?: string;
  content?: string;
  userId?: string;
  remark?: string;
  category?: number;
  isReship?: number;
  isReshipUrl?: string;
  isReshipName?: string;
  recommended?: number;
  likeToken?: number;
  status?: number;
}

// 博客参数
export interface blogParamType extends updateArticleType {
  viewNum?: number;
  likeNum?: number;
  [key: string]: any;
}

// 获取文章评论参数
export interface getArticleCommentType {
  pageNum: number;
  pageSize: number;
  comment: string | null;
}
// 文章点赞或者反对
export interface articleLikeType {
  id: string;
  likeOrOppose: string;
}
// 文章下拉列表
export interface articleSelect {
  id: string;
  title: string;
}
// 新增留言或评论
export interface newCreateCommentType {
  messagePid?: string | null;
  toUserId?: string | null;
  relatedArticleId?: string | null;
  content: string;
}
// 修改留言或评论及删除
export interface updateCommentType {
  messageId: string | null;
  relatedArticleId: string | null;
  content: string;
  hidden?: number;
}
