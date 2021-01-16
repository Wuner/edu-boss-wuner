<template>
  <div class="CreateOrEdit">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择资源分类">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button v-if="!edit" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getCategoryAll, saveOrUpdate, getResource } from "@/services/resource";
import { Form } from "element-ui";

export default Vue.extend({
  name: "CreateOrEdit",
  props: {
    edit: Boolean
  },
  data() {
    return {
      categoryList: [],
      form: {
        name: "",
        url: "",
        categoryId: "",
        description: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入资源名称",
            trigger: "blur"
          }
        ],
        categoryId: [
          {
            required: true,
            message: "请选择资源分类",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "请输入资源路径",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      (this.$refs.form as Form).validate((valid: boolean) => {
        if (valid) {
          saveOrUpdate(this.form)
            .then(() => {
              this.$message.success(this.edit ? "修改成功" : "添加成功");
              this.$router.go(-1);
            })
            .catch(e => this.$message.error(e));
        } else {
          return false;
        }
      });
    },
    resetForm() {
      console.log(this.$refs.form as Form);
      (this.$refs.form as Form).resetFields();
    }
  },
  async created() {
    this.categoryList = await getCategoryAll();
    if (this.edit) {
      this.form = await getResource(this.$route.params.id);
    }
  }
});
</script>

<style lang="scss" scoped>
.CreateOrEdit {
}
</style>
