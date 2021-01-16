<template>
  <div class="menu">
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="toAdd"
    >
      添加菜单
    </el-button>
    <el-table v-loading="loading" :data="menus" style="width: 100%">
      <el-table-column align="center" label="编号" type="index" />
      <el-table-column
        align="center"
        label="菜单名称"
        prop="name"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="菜单级数"
        prop="level"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="前端图标"
        prop="icon"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="排序"
        prop="orderNum"
        min-width="180"
      />
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAll, delMenu } from "@/services/menu";
import { Menu } from "@/types";

export default Vue.extend({
  name: "MenuIndex",
  data() {
    return {
      loading: false,
      menus: []
    };
  },
  methods: {
    toAdd() {
      this.$router.push("menu/add");
    },
    handleEdit(item: Menu) {
      this.$router.push({
        name: "menuEdit",
        params: {
          id: item.id + "" || ""
        }
      });
    },
    handleDelete(item: Menu) {
      this.$confirm("是否删除该菜单？").then(async () => {
        try {
          await delMenu(item.id || "");
          this.loadMenus();
          this.$message.success("删除成功");
        } catch (e) {
          this.$message.error(e);
        }
      });
    },
    async loadMenus() {
      try {
        this.loading = true;
        this.menus = await getAll();
        this.loading = false;
      } catch (e) {
        this.$message.error(e);
      }
    }
  },
  created() {
    this.loadMenus();
  }
});
</script>
