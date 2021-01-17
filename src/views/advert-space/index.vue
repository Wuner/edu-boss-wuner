<template>
  <div class="advert-space">
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="show = true"
    >
      添加广告
    </el-button>
    <el-table :data="spaces" style="width: 100%">
      <el-table-column align="center" label="spaceKey" prop="spaceKey" />
      <el-table-column
        align="center"
        label="广告位名称"
        prop="name"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="创建时间"
        prop="createdTime"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createdTime | date }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | date }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="show"
      @close="onCancel"
    >
      <el-form ref="spaceForm" :rules="rules" :model="spaceForm">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="spaceForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSaveOrUpdateSubmit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllSpaces, saveOrUpdateSpace } from "@/services/space";
import { Form } from "element-ui";

export default Vue.extend({
  name: "AdvertSpaceIndex",
  data() {
    return {
      show: false,
      isEdit: false,
      spaceForm: {
        name: ""
      },
      spaces: [],
      rules: {
        name: [
          {
            required: true,
            message: "请输入广告位名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async loadAllSpaces() {
      try {
        this.spaces = await getAllSpaces();
        console.log(this.spaces);
      } catch (e) {
        this.$message.error(e);
      }
    },
    handleEdit(space: any) {
      this.isEdit = true;
      this.show = true;
      this.spaceForm = JSON.parse(JSON.stringify(space));
    },
    onCancel() {
      (this.$refs.spaceForm as Form).resetFields();
      this.spaceForm = { name: "" };
      this.show = false;
    },
    onSaveOrUpdateSubmit() {
      (this.$refs.spaceForm as Form).validate(async (valid: boolean) => {
        if (valid) {
          try {
            await saveOrUpdateSpace(this.spaceForm);
            this.$message.success(this.isEdit ? "修改成功" : "添加成功");
            this.onCancel();
            await this.loadAllSpaces();
          } catch (e) {
            this.$message.error(e);
          }
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.loadAllSpaces();
  }
});
</script>
