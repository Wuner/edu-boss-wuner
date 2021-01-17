<template>
  <el-card class="CreateOrEdit">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="广告名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="广告位置" prop="spaceId">
        <el-select v-model="form.spaceId" placeholder="请选择">
          <el-option
            v-for="item in spaces"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.startTime"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="到期时间" prop="endTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.endTime"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="上线/下线" prop="categoryId">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="广告图片">
        <course-image v-model="form.img" :limit="5" />
      </el-form-item>
      <el-form-item label="广告链接" prop="link">
        <el-input v-model="form.link"></el-input>
      </el-form-item>
      <el-form-item label="广告备注" prop="text">
        <el-input v-model="form.text"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import CourseImage from "@/components/course-image/index.vue";
import { getAdById, getAllSpaces, saveOrUpdate } from "@/services/space";

export default Vue.extend({
  components: { CourseImage },
  name: "CreateOrEdit",
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      spaces: [],
      form: {
        name: "",
        spaceId: "",
        img: "",
        link: "",
        startTime: "",
        endTime: "",
        status: 0,
        text: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入广告名称",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur"
          }
        ],
        endTime: [
          {
            required: true,
            message: "请选择到期时间",
            trigger: "blur"
          }
        ],
        link: [
          {
            required: true,
            message: "请输入广告链接",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      console.log(this.$refs.form as Form);
      (this.$refs.form as Form).resetFields();
    },
    onSubmit() {
      (this.$refs.form as Form).validate((valid: boolean) => {
        if (valid) {
          saveOrUpdate(this.form)
            .then(() => {
              this.$message.success(this.isEdit ? "修改成功" : "添加成功");
              this.$router.go(-1);
            })
            .catch(e => this.$message.error(e));
        } else {
          return false;
        }
      });
    },
    async loadAllSpaces() {
      try {
        this.spaces = await getAllSpaces();
        console.log(this.spaces);
      } catch (e) {
        this.$message.error(e);
      }
    },
    async loadAdInfo() {
      try {
        this.form = await getAdById(this.$route.params.id);
      } catch (e) {
        this.$message.error(e);
      }
    }
  },
  created() {
    this.loadAllSpaces();
    this.isEdit && this.loadAdInfo();
  }
});
</script>
