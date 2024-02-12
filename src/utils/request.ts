import axios, { ResponseType, AxiosRequestConfig } from "axios";
import Storage from "../utils/storage.ts";
import { WNotification } from "./toast.ts";
import storage from "../utils/storage.ts";
import router from "@/router";

const Request = axios.create({
  // 基础路径到代理服务器被转换
  baseURL: "/w1",
  timeout: 60 * 1000,
});
// 请求拦截器，携带token
Request.interceptors.request.use(
  (config) => {
    let userInfo = Storage.get("userInfo");
    if (userInfo?.token) {
      config.headers.authorization = userInfo.token;
    } else {
      router.push("/login");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
Request.interceptors.response.use(
  (response) => {
    // const { data } = response;
    const contentType = response.headers["Content-Type"];
    if (
      contentType === "application/octet-stream" ||
      contentType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return response;
    } else {
      return Promise.resolve(response);
    }
  },
  (error) => {
    return errorHandler(error);
  }
);
// 错误处理函数
const errorHandler = (error: any) => {
  if (error.response) {
    // 服务器响应错误
    let status = error.response.status;
    // 响应数据
    let data = error.response.data;
    console.log(status);
    switch (status) {
      case 400:
        // console.error("参数校验失败" + data.message);
        WNotification.error(data.message || "参数校验失败");
        return Promise.reject(data.message ?? "参数校验失败");
      case 401:
        router.push("/login");
        storage.remove("userInfo");
        WNotification.error(data.message || "未授权");
        return Promise.reject(data.message ?? "未授权");
      case 404:
        // console.error("404:" + data.message);
        WNotification.error(data.message || "资源不存在");
        return Promise.reject({ error: "接口不存在", message: data.message });
      case 500:
        // console.error("服务器内部错误:" + data.message);
        WNotification.error(data.message || "服务器内部错误");
        return Promise.reject({
          error: "服务器内部错误",
          message: data.message,
        });
      default:
        WNotification.error("服务器响应错误");
        console.error("服务器响应错误" + data.message);
    }
  } else if (error.request) {
    // 请求未收到响应
    // console.error("请求未收到响应", error.request);
    WNotification.error("请求未收到响应");
    // return Promise.reject(error);
  } else {
    // 请求配置出错
    console.error("请求配置出错", error.message);
    WNotification.error("请求配置出错");
    // return Promise.reject(error);
  }
};

// 封装请求方法;
class AxiosService {
  // GET 请求
  get<T>(url: string, params?: AxiosRequestConfig["params"]) {
    return Request<T>({
      method: "get",
      url,
      params,
    });
  }

  // POST 请求
  post<T>(
    url: string,
    data: AxiosRequestConfig["data"],
    params?: AxiosRequestConfig["params"],
    responseType?: ResponseType | undefined
  ) {
    return Request<T>({
      method: "post",
      url,
      data,
      params,
      responseType,
    });
  }

  // PUT 请求
  put<T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    params?: AxiosRequestConfig["params"]
  ) {
    return Request<T>({
      method: "put",
      url,
      data,
      params,
    });
  }

  // DELETE 请求
  delete<T>(url: string, params: AxiosRequestConfig["params"]) {
    return Request<T>({
      method: "delete",
      url,
      params,
    });
  }
}
const request = new AxiosService();

export default request;
