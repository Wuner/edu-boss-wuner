import request, { get } from "@/utils/request";
import { Section } from "@/types";

/**
 * 保存或者更新章节内容
 * @param data
 */
export const saveOrUpdateSection = (data: Section) => {
  return request({
    method: "POST",
    url: "/boss/course/section/saveOrUpdateSection",
    data
  });
};

/**
 * 获取章节内容
 * @param sectionId
 */
export const getSectionById = (sectionId: number | string) => {
  return get("/boss/course/section/getBySectionId", { sectionId });
};

export const getSectionAndLesson = (courseId: number | string) => {
  return get("/boss/course/section/getSectionAndLesson", { courseId });
};
