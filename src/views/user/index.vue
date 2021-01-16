<template>
  <div class="user">
    <el-form
      :inline="true"
      ref="form"
      :model="userFilter"
      class="demo-form-inline"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="userFilter.phone" clearable placeholder="手机号" />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="dateRange"
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
        <el-button type="primary" @click="onSelect">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="records" style="width: 100%">
      <el-table-column
        align="center"
        label="用户ID"
        prop="id"
        min-width="100"
      />
      <el-table-column align="center" label="头像" prop="portrait">
        <template slot-scope="scope">
          <img
            style="width: 30px;height: 30px"
            :src="
              scope.row.portrait ||
                'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
            "
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        prop="name"
        min-width="160"
      />
      <el-table-column
        align="center"
        label="手机号"
        prop="phone"
        min-width="120"
      />
      <el-table-column
        align="center"
        label="注册时间"
        prop="createTime"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <vm-status :is-disabled="scope.row.status === 'DISABLE'" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 'ENABLE'"
            type="danger"
            size="mini"
            @click="handleDisabled(scope.row)"
          >
            禁用
          </el-button>
          <el-button
            v-else
            type="success"
            size="mini"
            @click="handleEnable(scope.row)"
          >
            启用
          </el-button>
          <el-button size="mini" @click="handleAssigningRoles(scope.row)">
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-loading="loading"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userFilter.current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="userFilter.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      title="分配角色"
      :visible.sync="show"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="selectedRoles"
        multiple
        placeholder="请选择"
        style="width: 100%"
      >
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">
          取 消
        </el-button>
        <el-button type="primary" @click="onSubmit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { DatePicker } from "element-ui";
import { enableUser, forbidUser, getUserPages } from "@/services/user";
import { UserInfo } from "@/types";
import { allocateUserRoles, getRoleAll, getRoleUsers } from "@/services/role";

import VmStatus from "@/components/status/index.vue";

export default Vue.extend({
  components: { VmStatus },
  name: "UserIndex",
  data() {
    return {
      show: false,
      currentUserInfo: {} as UserInfo,
      roles: [],
      selectedRoles: [] as number[],
      userFilter: {
        currentPage: 1,
        pageSize: 10,
        phone: "",
        startCreateTime: "",
        endCreateTime: ""
      },
      total: 0,
      dateRange: "",
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
      records: [],
      loading: false
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { id: userId } = this.currentUserInfo;
        const roleIdList = this.selectedRoles;
        await allocateUserRoles({ userId, roleIdList });
        await this.loadUserPages();
        this.show = false;
        this.$message.success("分配角色成功");
      } catch (e) {
        this.$message.error(e);
      }
    },
    onSelect() {
      console.log(this.dateRange);
      this.userFilter.currentPage = 1;
      if (this.dateRange) {
        this.userFilter.startCreateTime = this.dateRange[0];
        this.userFilter.endCreateTime = this.dateRange[1];
      } else {
        this.userFilter.startCreateTime = "";
        this.userFilter.endCreateTime = "";
      }
      this.loadUserPages();
    },
    async loadUserPages() {
      try {
        const { records, total } = await getUserPages(this.userFilter);
        console.log(records);
        this.total = total;
        this.records = records;
      } catch (e) {
        this.$message.error(e);
      }
    },
    async handleDisabled(item: UserInfo) {
      try {
        await forbidUser(item.id as number);
        await this.loadUserPages();
        this.$message.success("禁用成功");
      } catch (e) {
        this.$message.error(e);
      }
    },
    async handleEnable(item: UserInfo) {
      try {
        await enableUser(item.id as number);
        await this.loadUserPages();
        this.$message.success("启用成功");
      } catch (e) {
        this.$message.error(e);
      }
    },
    handleAssigningRoles(item: UserInfo) {
      this.show = true;
      this.currentUserInfo = item;
      this.loadRoleAll();
    },
    handleSizeChange(size: number) {
      this.userFilter.currentPage = 1;
      this.userFilter.pageSize = size;
      console.log(this.userFilter);
      this.loadUserPages();
    },
    handleCurrentChange(current: number) {
      this.userFilter.currentPage = current;
      this.loadUserPages();
    },
    async loadRoleAll() {
      try {
        this.roles = await getRoleAll();
      } catch (e) {
        this.roles = [];
      }
      try {
        const data = await getRoleUsers(this.currentUserInfo.id + "");
        this.selectedRoles = [];
        (data as UserInfo[]).forEach(user =>
          this.selectedRoles.push(user.id || -1)
        );
        console.log(data);
      } catch (e) {
        this.selectedRoles = [];
      }
    }
  },
  created() {
    this.loadUserPages();
  }
});
</script>

<style lang="scss" scoped>
.user {
}
</style>
