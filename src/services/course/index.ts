import request, { get } from "@/utils/request";
import { Course, CourseFilter } from "@/types";

/**
 * 保存或者更新课程信息
 * @param data
 */
export const saveOrUpdateCourse = (data: Course) => {
  return request({
    url: "/boss/course/saveOrUpdateCourse",
    method: "POST",
    data
  });
};

/**
 * 分页查询课程信息
 * @param data
 */
export const getQueryCourses = (data: CourseFilter) => {
  return request({
    url: "/boss/course/getQueryCourses",
    method: "POST",
    data
  });
};

/**
 * 课程上下架
 * @param params
 */
export const changeState = (params: object) => {
  return get("/boss/course/changeState", params);
};

/**
 * 通过课程Id获取课程信息
 * @param courseId 课程ID
 */
export const getCourseById = (courseId: number | string) => {
  return get("/boss/course/getCourseById", { courseId });
};

/**
 * 上传图片
 * @param data
 * @param onUploadProgress
 */
export const uploadCourseImage = (
  data: any,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: "POST",
    url: "/boss/course/upload",
    data,
    // HTML5 新增的上传响应事件：progress
    onUploadProgress
  });
};
