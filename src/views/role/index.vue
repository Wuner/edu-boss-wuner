<template>
  <div class="role">
    <el-form
      :inline="true"
      ref="form"
      :model="roleFilter"
      class="demo-form-inline"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="roleFilter.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色编号" prop="code">
        <el-input v-model="roleFilter.code" placeholder="角色编号"></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="dateRange">
        <el-date-picker
          v-model="roleFilter.dateRange"
          @change="onDateChange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
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
      @click="show = true"
    >
      添加角色
    </el-button>
    <el-table v-loading="loading" :data="records" style="width: 100%">
      <el-table-column
        align="center"
        label="编号"
        prop="code"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="角色名称"
        prop="name"
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
          <el-button size="mini" @click="handleAssigningMenus(scope.row)">
            分配菜单
          </el-button>
          <el-button size="mini" @click="handleAssigningResources(scope.row)">
            分配资源
          </el-button>
          <el-button
            style="margin-top: 10px"
            size="mini"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            style="margin-top: 10px"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-loading="loading"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="roleFilter.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="roleFilter.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="show"
      @close="onCancel"
    >
      <el-form ref="roleForm" :rules="rules" :model="roleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="code">
          <el-input v-model="roleForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSaveOrUpdateSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DatePicker, Form } from "element-ui";
import { delRole, getRolePages, saveOrUpdate } from "@/services/role";
import { Role } from "@/types";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    return {
      loading: false,
      show: false,
      isEdit: false,
      roleForm: {
        name: "",
        code: "",
        description: ""
      } as Role,
      rules: {
        name: {
          required: true,
          message: "请输入角色名称",
          trigger: "blur"
        },
        code: [
          {
            required: true,
            message: "请输入角色编号",
            trigger: "blur"
          }
        ]
      },
      total: 0,
      roleFilter: {
        name: "",
        dateRange: "",
        code: "",
        startCreateTime: "",
        endCreateTime: "",
        current: 1,
        size: 10
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker: DatePicker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker: DatePicker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker: DatePicker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      records: []
    };
  },
  methods: {
    reload() {
      this.resetForm();
      this.onSubmit();
    },
    onCancel() {
      (this.$refs.roleForm as Form).resetFields();
      this.roleForm = {} as Role;
      this.show = false;
    },
    async onSaveOrUpdateSubmit() {
      try {
        await saveOrUpdate(this.roleForm);
        this.$message.success("添加成功");
        this.onCancel();
        this.reload();
      } catch (e) {
        this.$message.error(e);
      }
    },
    onSubmit() {
      this.roleFilter.current = 1;
      this.loadRolePages();
    },
    resetForm() {
      this.roleFilter.startCreateTime = "";
      this.roleFilter.endCreateTime = "";
      (this.$refs.form as Form).resetFields();
    },
    onDateChange(val: string[]) {
      this.roleFilter.startCreateTime = val[0];
      this.roleFilter.endCreateTime = val[1];
    },
    async loadRolePages() {
      try {
        this.loading = true;
        const { records, total } = await getRolePages(this.roleFilter);
        this.loading = false;
        this.total = total;
        this.records = records;
        console.log(records);
      } catch (e) {
        this.loading = false;
        this.$message.error(e);
      }
    },
    handleAssigningMenus(item: Role) {
      this.$router.push({
        name: "roleAssigningMenus",
        params: {
          id: item.id + ""
        }
      });
    },
    handleAssigningResources(item: Role) {
      this.$router.push({
        name: "roleAssigningResource",
        params: {
          id: item.id + ""
        }
      });
    },
    handleEdit(item: Role) {
      this.isEdit = true;
      this.show = true;
      this.roleForm = JSON.parse(JSON.stringify(item));
    },
    handleDelete(item: Role) {
      this.$confirm("是否删除角色？").then(async () => {
        try {
          await delRole(item.id);
          this.reload();
          this.$message.success("删除成功");
        } catch (e) {
          this.$message.error(e);
        }
      });
    },
    handleSizeChange(size: number) {
      this.roleFilter.current = 1;
      this.roleFilter.size = size;
      this.loadRolePages();
    },
    handleCurrentChange(current: number) {
      this.roleFilter.current = current;
      this.loadRolePages();
    }
  },
  created() {
    this.loadRolePages();
  }
});
</script>
