import request, { get } from "@/utils/request";
import { Role, RoleFilter } from "@/types";

/**
 * 保存或者更新角色
 * @param data
 */
export const saveOrUpdate = (data: Role) => {
  return request({
    url: "/boss/role/saveOrUpdate",
    method: "POST",
    data
  });
};

/**
 * 按条件查询角色
 * @param data
 */
export const getRolePages = (data: RoleFilter) => {
  return request({
    url: "/boss/role/getRolePages",
    method: "POST",
    data
  });
};

/**
 * 删除资源
 */
export const delRole = (id: string | number) => {
  return request({
    url: `/boss/role/${id}`,
    method: "DELETE"
  });
};

/**
 * 获取所有角色
 */
export const getRoleAll = () => {
  return get(`/boss/role/all`);
};

/**
 * 查询用户角色
 */
export const getRoleUsers = (id: string | number) => {
  return get(`/boss/role/user/${id}`);
};

/**
 * 给用户分配角色
 * @param data
 */
export const allocateUserRoles = (data: object) => {
  return request({
    url: "/boss/role/allocateUserRoles",
    method: "POST",
    data
  });
};
