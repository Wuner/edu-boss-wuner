import request, { get, post } from "@/utils/request";
import { User, UserFilter } from "@/types";

export const login = (params: User) => {
  return post("/front/user/login", params);
};

export const getInfo = () => {
  return get("/front/user/getInfo", {});
};

/**
 * 分页查询用户信息
 * @param data
 */
export const getUserPages = (data: UserFilter) => {
  return request({
    method: "POST",
    url: "/boss/user/getUserPages",
    data
  });
};

/**
 * 启用用户
 * @param userId 用户ID
 */
export const enableUser = (userId: number | string) => {
  return get("/boss/user/enableUser", { userId });
};

/**
 * 封禁用户
 * @param userId 用户ID
 */
export const forbidUser = (userId: number | string) => {
  return request({
    method: "POST",
    url: "/boss/user/forbidUser",
    data: { userId }
  });
};
