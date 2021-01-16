/**
 * 阿里云上传
 */

import request, { get } from "@/utils/request";

/**
 * 获取媒体信息
 */
export const getMediaByLessonId = (lessonId: string | number) => {
  return get("/boss/course/upload/getMediaByLessonId.json", { lessonId });
};

/**
 * 获取阿里云图片上传凭证
 */
export const aliyunImagUploadAddressAdnAuth = () => {
  return get("/boss/course/upload/aliyunImagUploadAddressAdnAuth.json");
};

/**
 * 获取阿里云视频上传凭证
 * @param params
 */
export const aliyunVideoUploadAddressAdnAuth = (params: object) => {
  return get(
    "/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json",
    params
  );
};

/**
 * 阿里云转码请求
 * @param data
 */
export const transCodeVideo = (data: object) => {
  return request({
    method: "POST",
    url: "/boss/course/upload/aliyunTransCode.json",
    data
  });
};

/**
 * 阿里云转码进度
 * @param lessonId
 */
export const getAliyunTransCodePercent = (lessonId: string | number) => {
  return get("/boss/course/upload/aliyunTransCodePercent.json", { lessonId });
};
