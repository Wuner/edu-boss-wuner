import { Lesson } from "@/types";
import request from "@/utils/request";

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
