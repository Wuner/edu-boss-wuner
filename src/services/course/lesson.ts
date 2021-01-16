import { Lesson } from "@/types";
import request, { get } from "@/utils/request";

/**
 * 保存或者更新课时
 * @param data
 */
export const saveOrUpdateLesson = (data: Lesson) => {
  return request({
    method: "POST",
    url: "/boss/course/lesson/saveOrUpdate",
    data
  });
};

/**
 * 通过Id获取课时
 * @param lessonId
 */
export const getLessonById = (lessonId: number | string) => {
  return get("/boss/course/lesson/getById", { lessonId });
};
