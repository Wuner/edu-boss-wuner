<template>
  <div class="assigning-resource">
    <el-card class="box-card">
      <el-card
        style="margin-top: 10px"
        v-for="(item, index) in data"
        :key="index"
      >
        <div slot="header" class="clearfix">
          <el-checkbox
            :indeterminate="item.indeterminate"
            v-model="item.checkAll"
            @change="handleCheckAllChange(item)"
          >
            {{ item.name }}
          </el-checkbox>
        </div>
        <el-checkbox-group v-model="item.checkedList">
          <el-checkbox
            v-for="resource in item.resourceList"
            :key="resource.id"
            :label="resource.id"
            @change="handleCheckedCitiesChange(item)"
          >
            {{ resource.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-card>
      <div class="assigning-resource-button">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onClear">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getRoleResources, allocateRoleResources } from "@/services/resource";
import { Tree } from "element-ui";
import { Resource } from "@/types";

export default Vue.extend({
  name: "AssigningResource",
  data() {
    return {
      data: [] as Resource[],
      defaultProps: {
        children: "resourceList",
        label: "name"
      },
      selected: [] as number[]
    };
  },
  methods: {
    onClear() {
      this.data.forEach(value => {
        value.checkedList = [];
        value.checkAll = false;
        value.indeterminate = false;
      });
    },
    onSave() {
      this.$confirm("是否确认分配资源？").then(async () => {
        try {
          let resourceIdList = [] as number[];
          this.data.forEach(value => {
            resourceIdList = resourceIdList.concat(value.checkedList || []);
          });
          await allocateRoleResources({
            roleId: this.$route.params.id,
            resourceIdList
          });
          this.$message.success("分配资源成功");
          this.$router.go(-1);
        } catch (e) {
          this.$message.error(e);
        }
      });
    },
    getSelectedResources(resources: Resource[]) {
      resources.forEach((resource: Resource) => {
        resource.checkedList = [];
        if (resource.selected) {
          if (resource.resourceList && resource.resourceList.length > 0) {
            resource.resourceList.forEach(
              value =>
                value.selected && resource.checkedList!.push(value.id || -1)
            );
            resource.indeterminate =
              resource.resourceList.length !== resource.checkedList.length;
            resource.checkAll =
              resource.resourceList.length === resource.checkedList.length;
          } else {
            resource.checkAll = true;
            resource.indeterminate = true;
          }
        } else {
          resource.checkAll = false;
          resource.indeterminate = false;
        }
      });
      return resources;
    },
    handleCheckAllChange(resource: Resource) {
      resource.indeterminate = false;
      if (resource.checkAll) {
        resource.resourceList &&
          resource.resourceList.forEach(value =>
            resource.checkedList!.push(value.id || -1)
          );
      } else {
        resource.checkedList = [];
      }
    },
    handleCheckedCitiesChange(resource: Resource) {
      resource.indeterminate =
        resource.checkedList!.length > 0 &&
        resource.resourceList!.length !== resource.checkedList!.length;
      resource.checkAll =
        resource.resourceList!.length === resource.checkedList!.length;
      console.log(resource);
    }
  },
  async created() {
    try {
      const data = await getRoleResources(this.$route.params.id);
      (data as object[]).forEach((val: any) => {
        val.checkAll = false;
        val.checkedCities = [];
      });
      this.data = this.getSelectedResources(data);
      console.log(this.data);
    } catch (e) {
      this.$message.error(e);
    }
  }
});
</script>

<style lang="scss" scoped>
.assigning-resource {
  &-button {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
