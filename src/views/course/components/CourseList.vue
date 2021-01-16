<template>
  <div class="course-list">
    <div class="course-list-header">
      <el-form
        ref="form"
        :inline="true"
        :model="courseFilter"
        class="demo-form-inline"
      >
        <el-form-item prop="courseName" label="课程名称">
          <el-input
            v-model="courseFilter.courseName"
            clearable
            placeholder="请输入课程名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select v-model="courseFilter.status" placeholder="请选则状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onReset">重置</el-button>
          <el-button type="primary" @click="onSelect">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="toCreate">
        新建课程
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="courses"
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column
        align="center"
        label="课程名称"
        prop="courseName"
        min-width="180"
      />
      <el-table-column align="center" label="价格" prop="price" min-width="180">
        <template slot-scope="scope"> ¥{{ scope.row.price }} </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="排序"
        prop="sortNum"
        min-width="180"
      />
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleSection(scope.row)">
            内容管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-loading="loading"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="courseFilter.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="courseFilter.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { changeState, getQueryCourses } from "@/services/course";
import { Course } from "@/types";
import { Form } from "element-ui";

export default Vue.extend({
  name: "CourseIndex",
  data() {
    return {
      loading: false,
      courses: [],
      total: 0,
      courseFilter: {
        courseName: "",
        status: "",
        currentPage: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    onReset() {
      (this.$refs.form as Form).resetFields();
    },
    async onChange(course: Course) {
      try {
        const { id: courseId, status } = course;
        await changeState({ courseId, status });
        this.$message.success(status === 0 ? "下架成功" : "上架成功");
      } catch (e) {
        course.status = course.status === 0 ? 1 : 0;
        this.$message.error(e);
      }
    },
    onSelect() {
      this.courseFilter.currentPage = 1;
      this.loadAllCourses();
    },
    toCreate() {
      this.$router.push("course/create");
    },
    handleEdit(course: Course) {
      this.$router.push({
        name: "courseEdit",
        params: {
          courseId: course.id + ""
        }
      });
    },
    handleSection(course: Course) {
      this.$router.push({
        name: "courseSection",
        params: {
          courseId: course.id + ""
        }
      });
    },
    async loadAllCourses() {
      this.loading = true;
      try {
        const { records, total } = await getQueryCourses(this.courseFilter);
        this.courses = records;
        this.total = total;
        console.log(records);
      } catch (e) {
        this.$message.error(e);
      }
      this.loading = false;
    },
    handleSizeChange(size: number) {
      this.courseFilter.currentPage = 1;
      this.courseFilter.pageSize = size;
      this.loadAllCourses();
    },
    handleCurrentChange(current: number) {
      this.courseFilter.currentPage = current;
      this.loadAllCourses();
    }
  },
  created() {
    this.loadAllCourses();
  }
});
</script>

<style lang="scss" scoped>
.course-list {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
