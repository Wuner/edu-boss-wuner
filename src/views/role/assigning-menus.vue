<template>
  <div class="assigning-menus">
    <el-card class="box-card">
      <el-tree
        ref="tree"
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selected"
        :props="defaultProps"
      >
      </el-tree>
      <div class="assigning-menus-button">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onClear">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { allocateRoleMenus, getRoleMenus } from "@/services/menu";
import { Menu } from "@/types";
import { Tree } from "element-ui";

export default Vue.extend({
  name: "assigning-menus",
  data() {
    return {
      data: [],
      defaultProps: {
        children: "subMenuList",
        label: "name"
      },
      selected: [] as number[]
    };
  },
  methods: {
    getSelectedMenus(menus: Menu[]) {
      menus.forEach((menu: Menu) => {
        if (menu.selected) {
          this.selected = [...this.selected, menu.id || -1];
        } else {
          this.selected = this.selected.filter(
            value => menu.parentId !== value
          );
        }
        if (menu.subMenuList && menu.subMenuList.length > 0) {
          this.getSelectedMenus(menu.subMenuList);
        }
      });
    },
    onClear() {
      (this.$refs.tree as Tree).setCheckedNodes([]);
    },
    onSave() {
      this.$confirm("是否确认分配菜单？").then(async () => {
        try {
          await allocateRoleMenus({
            roleId: this.$route.params.id,
            menuIdList: (this.$refs.tree as Tree).getCheckedKeys()
          });
          this.$message.success("分配菜单成功");
          this.$router.go(-1);
        } catch (e) {
          this.$message.error(e);
        }
      });
    }
  },
  async created() {
    try {
      const data = await getRoleMenus({ roleId: this.$route.params.id });
      this.data = data;
      this.getSelectedMenus(data);
      console.log(data);
    } catch (e) {
      this.$message.error(e);
    }
  }
});
</script>

<style lang="scss" scoped>
.assigning-menus {
  &-button {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
