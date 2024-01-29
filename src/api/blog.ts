import request from "utils/request.ts";
import { blogArticleType } from "@/types/blog.ts";
import { responseData } from "@/types/userInfo";

export const getBlogArticleList = (params: blogArticleType) => {
  return request.get<responseData>("/w1/blog/blog_article/list", params);
};
