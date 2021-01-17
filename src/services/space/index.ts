import request, { get } from "@/utils/request";

/**
 * 获取所有的广告位
 */
export const getAllSpaces = () => {
  return get(`/front/ad/space/getAllSpaces`);
};

/**
 * 获取所有的广告列表
 */
export const getAdList = () => {
  return get(`/front/ad/getAdList`);
};

/**
 * 更新广告的状态
 */
export const updateStatus = (params: object) => {
  return get(`/front/ad/updateStatus`, params);
};

/**
 * 根据Id获取广告信息
 */
export const getAdById = (id: number | string) => {
  return get(`/front/ad/getAdById`, { id });
};

/**
 * 新增或者修改广告信息
 * @param data
 */
export const saveOrUpdate = (data: object) => {
  return request({
    url: "/front/ad/saveOrUpdate",
    method: "POST",
    data
  });
};

/**
 * 新增或者修改广告位
 * @param data
 */
export const saveOrUpdateSpace = (data: object) => {
  return request({
    url: "/front/ad/space/saveOrUpdate",
    method: "POST",
    data
  });
};
