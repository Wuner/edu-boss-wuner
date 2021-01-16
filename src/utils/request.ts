import axios from "axios";
import qs from "qs";
import store from "@/store";
import { Store } from "vuex";
import { RootState } from "@/types";
import { Message } from "element-ui";
import router from "@/router";

// 是否处于刷新token中
let isRefreshToken = false;
// 处于刷新token时的接口请求数组
let requests: Function[] = [];

const request = axios.create({
  timeout: 10000
});

/**
 * 刷新 token
 * @param data
 */
const refreshToken = (data: object) => {
  return axios.create()({
    url: "/front/user/refresh_token",
    method: "POST",
    data: qs.stringify(data),
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

/**
 * 跳转登陆页
 */
const redirectToLogin = () => {
  store.commit("user/setUserLoginInfo", null);
  router.push({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    const { access_token: accessToken } =
      (store as Store<RootState>).getters["user/userLoginInfo"] || {};
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const { data } = response;
    const { state, content, message, mesg, code, data: rData } = data;
    if (state === 200 || state === 1) {
      if (typeof content === "string") return JSON.parse(content);
      else return content;
    } else if (code === "000000") {
      return rData;
    } else {
      return Promise.reject(message || mesg);
    }
  },
  async function(error) {
    // 对响应错误做点什么
    if (error.response) {
      // 请求成功并收到响应，但是状态码超出了 2xx 到范围
      const { status, config } = error.response;
      if (status === 401) {
        // 去除重复调用刷新token接口
        if (!isRefreshToken) {
          const userLoginInfo = store.getters["user/userLoginInfo"];
          // 如果用户登陆信息不存在，直接跳转登陆页
          if (userLoginInfo) {
            // 将状态置为 token 刷新中
            isRefreshToken = true;
            const { refresh_token: refreshtoken } = userLoginInfo;
            // 调用token刷新接口，获取用户登陆信息
            return refreshToken({ refreshtoken })
              .then(({ data }) => {
                // 重置接口调用失败
                if (!data.success) {
                  throw new Error("token 刷新失败");
                }
                // 更新用户登录信息
                store.commit("user/setUserLoginInfo", JSON.parse(data.content));
                // 将requests数组中挂起的请求，重新发送出去
                requests.forEach(cb => cb());
                // 将数组重置
                requests = [];
                // 将上一次的请求，重新发送
                return request(config);
              })
              .catch(() => {
                redirectToLogin();
              })
              .finally(() => {
                // 将状态重置
                isRefreshToken = false;
              });
          } else {
            redirectToLogin();
          }
        }
        // 在刷新状态下时，将请求的接口挂起到requests数组中
        return new Promise(resolve =>
          requests.push(() => resolve(request(config)))
        );
      } else if (status === 404) {
        Message.error("请求资源不存在");
      } else {
        Message.error("接口请求失败，请联系管理员");
      }
    } else if (error.request) {
      // 请求成功并未收到响应
      Message.error("请求超时");
      console.log(error.request);
    } else {
      // 设置请求时触发的某些错误
      Message.error("请求错误");
      console.log("Error", error.message);
    }
    return Promise.reject(error);
  }
);

const post = (url: string, data?: object) => {
  return request({
    url,
    method: "POST",
    data: qs.stringify(data),
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

const get = (url: string, params?: object) => {
  return request({
    url,
    method: "GET",
    params,
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export { post, get };

export default request;
