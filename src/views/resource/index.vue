<template>
  <div class="resource">
    <el-form ref="form" :model="resourceFilter" class="demo-form-inline">
      <el-form-item label="资源名称" prop="name">
        <el-input
          v-model="resourceFilter.name"
          placeholder="资源名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input
          v-model="resourceFilter.url"
          placeholder="资源路径"
        ></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select
          v-model="resourceFilter.categoryId"
          placeholder="全部"
          clearable
        >
          <el-option
            v-for="category in categoryList"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="toAdd"
    >
      添加资源
    </el-button>
    <el-button style="margin-bottom: 20px" type="primary" @click="toCategory">
      资源分类
    </el-button>
    <el-table v-loading="loading" :data="resources" style="width: 100%">
      <el-table-column align="center" label="编号" type="index" />
      <el-table-column
        align="center"
        label="资源名称"
        prop="name"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="资源路径"
        prop="url"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="描述"
        prop="description"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="添加时间"
        prop="createdTime"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createdTime | date }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-loading="loading"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="resourceFilter.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="resourceFilter.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import {
  getResourcePages,
  getCategoryAll,
  delResource
} from "@/services/resource";
import { Resource } from "@/types";

export default Vue.extend({
  name: "ResourceIndex",
  data() {
    return {
      loading: false,
      categoryList: [],
      resourceFilter: {
        current: 1,
        size: 10,
        name: "",
        url: "",
        categoryId: ""
      },
      total: 0,
      resources: []
    };
  },
  methods: {
    toAdd() {
      this.$router.push("resource/add");
    },
    toCategory() {
      this.$router.push("resource/category");
    },
    async loadResourcePages() {
      try {
        this.loading = true;
        const { records, total } = await getResourcePages(this.resourceFilter);
        this.loading = false;
        this.resources = records;
        this.total = total;
      } catch (e) {
        this.$message.error(e);
      }
    },
    onSubmit() {
      this.resourceFilter.current = 1;
      this.loadResourcePages();
    },
    resetForm() {
      (this.$refs.form as Form).resetFields();
    },
    handleEdit(item: Resource) {
      this.$router.push({
        name: "resourceEdit",
        params: {
          id: item.id + "" || ""
        }
      });
    },
    handleDelete(item: Resource) {
      this.$confirm("是否删除该资源？").then(async () => {
        try {
          await delResource(item.id || "");
          await this.loadResourcePages();
          this.$message.success("删除成功");
        } catch (e) {
          this.$message.error(e);
        }
      });
    },
    handleSizeChange(size: number) {
      this.resourceFilter.current = 1;
      this.resourceFilter.size = size;
      this.loadResourcePages();
    },
    handleCurrentChange(current: number) {
      this.resourceFilter.current = current;
      this.loadResourcePages();
    }
  },
  async created() {
    this.categoryList = await getCategoryAll();
    this.loadResourcePages();
  }
});
</script>

<style lang="scss" scoped></style>
