import request, { get } from "@/utils/request";
import { Resource, ResourceCategory, ResourceFilter } from "@/types";

/**
 * 保存或者更新资源
 * @param data
 */
export const saveOrUpdate = (data: Resource) => {
  return request({
    url: "/boss/resource/saveOrUpdate",
    method: "POST",
    data
  });
};

/**
 * 获取资源
 */
export const getResource = (id: string) => {
  return get(`/boss/resource/${id}`);
};

/**
 * 按条件分页查询资源
 * @param data
 */
export const getResourcePages = (data: ResourceFilter) => {
  return request({
    url: "/boss/resource/getResourcePages",
    method: "POST",
    data
  });
};

/**
 * 查询资源分类列表
 */
export const getCategoryAll = () => {
  return get("/boss/resource/category/getAll");
};

/**
 * 删除资源
 */
export const delResource = (id: string | number) => {
  return request({
    url: `/boss/resource/${id}`,
    method: "DELETE"
  });
};

/**
 * 保存或更新资源分类
 */
export const saveOrUpdateCategory = (data: ResourceCategory) => {
  return request({
    url: `/boss/resource/category/saveOrderUpdate`,
    method: "POST",
    data
  });
};

/**
 * 删除资源分类，如果资源分类下有资源，不允许删除
 */
export const delCategory = (id: string | number) => {
  return request({
    url: `/boss/resource/category/${id}`,
    method: "DELETE"
  });
};

/**
 * 获取角色拥有的资源列表
 * @param roleId 角色ID
 */
export const getRoleResources = (roleId: number | string) => {
  return get("/boss/resource/getRoleResources", { roleId });
};

/**
 * 给角色分配资源
 */
export const allocateRoleResources = (data: object) => {
  return request({
    url: `/boss/resource/allocateRoleResources`,
    method: "POST",
    data
  });
};
