<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/course' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="$route.meta.parent"
        :to="{ path: $route.meta.parent.path }"
      >
        {{ $route.meta.parent.title }}
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="$route.meta.childrenParent"
        :to="{
          name: 'courseSection',
          params: {
            courseId: $route.params.courseId + ''
          }
        }"
      >
        {{ $route.meta.childrenParent.title }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.meta.title">
        {{ $route.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="
            (userInfo && userInfo.portrait) ||
              'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
          "
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-if="userInfo">
          {{ userInfo.userName }}
        </el-dropdown-item>
        <el-dropdown-item @click.native="onExit" divided>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default Vue.extend({
  name: "AppHeader",
  computed: {
    ...mapGetters("user", ["userInfo"])
  },
  created() {
    this.getInfo();
    this.getInfo();
  },
  methods: {
    ...mapMutations("user", ["setUserLoginInfo"]),
    ...mapActions("user", ["getInfo"]),
    onExit() {
      this.setUserLoginInfo(null);
      this.$router.push("/login");
    }
  }
});
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
<style>
.el-avatar > img {
  width: 100%;
}
</style>
