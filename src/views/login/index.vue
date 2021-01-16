<template>
  <div class="login">
    <div class="login-box">
      <h1 class="login-title">Edu boss管理系统</h1>
      <el-card class="login-card">
        <h2>登录</h2>
        <el-form
          label-position="top"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              type="text"
              clearable
              maxlength="11"
              v-model="ruleForm.phone"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              clearable
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loginLoading" type="primary" @click="onLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Form } from "element-ui";
import { mapMutations } from "vuex";
import { User } from "@/types";
import { login } from "@/services/user";

export default Vue.extend({
  name: "LoginIndex",
  data() {
    const checkPhone = (rule: object, value: string, callback: Function) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      if (!value.match(/^[0-9]{11}$/)) {
        callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    };
    const validatePassword = (
      rule: object,
      value: string,
      callback: Function
    ) => {
      if (value === "" || value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginLoading: false,
      ruleForm: {
        password: "111111",
        phone: "15510792995"
      },
      rules: {
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: ["change", "blur"]
          }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: ["change", "blur"] }
        ]
      }
    };
  },
  methods: {
    ...mapMutations("user", ["setUserLoginInfo"]),
    onLogin(): void {
      (this.$refs.ruleForm as Form).validate((valid: boolean) => {
        if (valid) {
          this.loginLoading = true;
          this.login(this.ruleForm);
        }
      });
    },
    async login(params: User) {
      try {
        const data = await login(params);
        this.setUserLoginInfo(data);
        await this.$router.replace(
          (this.$route.query.redirect as string) || "/"
        );
        this.$message({
          message: "登陆成功",
          type: "success"
        });
      } catch (e) {
        this.$message({
          message: e,
          type: "error"
        });
      }
      this.loginLoading = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &-title {
    text-align: center;
  }

  &-card {
    width: 380px;
  }

  .el-button {
    width: 100%;
  }
}
</style>
