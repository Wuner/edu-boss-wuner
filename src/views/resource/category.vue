<template>
  <div class="resource-category">
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="show = true"
    >
      添加
    </el-button>
    <el-table v-loading="loading" :data="categoryList" style="width: 100%">
      <el-table-column label="编号" type="index" />
      <el-table-column label="名称" prop="name" min-width="180" />
      <el-table-column label="排序" prop="sort" min-width="180" />
      <el-table-column label="创建时间" prop="createdTime" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.createdTime | date }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加分类" :visible.sync="show">
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="form.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  delCategory,
  getCategoryAll,
  saveOrUpdateCategory
} from "@/services/resource";
import { ResourceCategory } from "@/types";
import { Form } from "element-ui";

export default Vue.extend({
  name: "resourceCategory",
  data() {
    return {
      loading: false,
      form: {
        name: "",
        sort: ""
      } as ResourceCategory,
      rules: {
        name: {
          required: true,
          message: "请输入名称",
          trigger: "blur"
        },
        sort: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur"
          },
          {
            type: "number",
            message: "排序必须为数字值"
          }
        ]
      },
      show: false,
      categoryList: []
    };
  },
  methods: {
    handleEdit(item: ResourceCategory) {
      this.show = true;
      this.form = item;
    },
    handleDelete(item: ResourceCategory) {
      this.$confirm("是否删除该资源分类？").then(async () => {
        try {
          await delCategory(item.id || "");
          this.loadCategoryAll();
          this.$message.success("删除成功");
        } catch (e) {
          this.$message.error(e);
        }
      });
    },
    async loadCategoryAll() {
      try {
        this.loading = true;
        this.categoryList = await getCategoryAll();
        this.loading = false;
      } catch (e) {
        this.$message.error(e);
      }
    },
    onCancel() {
      this.show = false;
      (this.$refs.form as Form).resetFields();
    },
    onSubmit(edit: boolean) {
      (this.$refs.form as Form).validate((valid: boolean) => {
        if (valid) {
          saveOrUpdateCategory(this.form)
            .then(() => {
              this.$message.success(edit ? "修改成功" : "添加成功");
              this.loadCategoryAll();
              this.onCancel();
            })
            .catch(e => this.$message.error(e));
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.loadCategoryAll();
  }
});
</script>

<style lang="scss" scoped>
.resource-category {
}
</style>
