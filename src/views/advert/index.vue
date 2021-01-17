<template>
  <div class="advert">
    <el-button
      style="margin-bottom: 20px"
      type="primary"
      icon="el-icon-plus"
      @click="$router.push('advert/add')"
    >
      添加广告
    </el-button>
    <el-table :data="adList" style="width: 100%">
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column
        align="center"
        label="广告名称"
        prop="name"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="广告位置"
        prop="spaceId"
        min-width="180"
      >
        <template slot-scope="scope">
          <span>{{ spaces[scope.row.spaceId] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" prop="img">
        <template slot-scope="scope">
          <img
            v-if="scope.row.img"
            style="width: 30px;height: 30px"
            :src="scope.row.img"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="上线/下线" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="时间"
        prop="createdTime"
        min-width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.createdTime | date }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="
              $router.push({
                name: 'advertEdit',
                params: {
                  id: scope.row.id
                }
              })
            "
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAdList, getAllSpaces, updateStatus } from "@/services/space";

export default Vue.extend({
  name: "AdvertIndex",
  data() {
    return {
      adList: [],
      spaces: {} as any
    };
  },
  methods: {
    async loadAdList() {
      try {
        this.adList = await getAdList();
        console.log(this.adList);
      } catch (e) {
        this.$message.error(e);
      }
    },
    async loadAllSpaces() {
      try {
        const data = await getAllSpaces();
        (data as object[]).forEach(
          (value: any) => (this.spaces[value.id] = value.name)
        );
        console.log(this.spaces);
      } catch (e) {
        this.$message.error(e);
      }
    },
    async onChange(ad: any) {
      const { id, status } = ad;
      try {
        await updateStatus({ id, status });
        this.$message.success(status === 0 ? "下线成功" : "上线成功");
      } catch (e) {
        ad.status = status === 0 ? 1 : 0;
        this.$message.error(e);
      }
    }
  },
  created() {
    this.loadAllSpaces();
    this.loadAdList();
  }
});
</script>
