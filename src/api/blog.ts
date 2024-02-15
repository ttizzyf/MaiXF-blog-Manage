import request from "utils/request.ts";
import {
  blogArticleType,
  updateArticleType,
  getArticleCommentType,
  articleLikeType,
  newCreateCommentType,
  updateCommentType,
} from "@/types/blog.ts";
import { responseData } from "@/types/userInfo";
// 获取文章列表
export const getBlogArticleList = (params: blogArticleType) => {
  return request.get<responseData>("/w1/blog/blog_article/list", params);
};
// 更新文章
export const updateArticle = (data: updateArticleType) => {
  return request.post<responseData>("/w1/blog/blog_article/update", data);
};
// 获取文章详情
export const getArticleDetails = (data: { id: string }) => {
  return request.post<responseData>("/w1/blog/blog_article/details", data);
};
// 删除博文
export const deleteArticle = (data: { id: string }) => {
  return request.post<responseData>("/w1/blog/blog_article/delete", data);
};
// 新建博文
export const newCreateArticle = (data: updateArticleType) => {
  return request.post<responseData>("/w1/blog/blog_article/create", data);
};

//获取文章评论列表
export const getBlogCommentList = (params: getArticleCommentType) => {
  return request.get<responseData>("/w1/blog/blog_comment/list", params);
};
// 文章评论点赞或反对
export const updateBlogCommentLikeOrOppose = (data: articleLikeType) => {
  return request.post<responseData>("/w1/blog/blog_comment/likeOrOppose", data);
};
// 获取文章列表
export const getArticleSelectList = () => {
  return request.get<responseData>("/w1/blog/blog_article/selectList");
};
// 新增留言或评论
export const newCreateComment = (data: newCreateCommentType) => {
  return request.post<responseData>("/w1/blog/blog_comment/create", data);
};
// 修改留言或评论及删除
export const updateComment = (data: updateCommentType) => {
  return request.post<responseData>("/w1/blog/blog_comment/update", data);
};
