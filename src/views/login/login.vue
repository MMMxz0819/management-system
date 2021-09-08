<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>

      <!-- 表单区 -->
      <!-- 表单验证需要在整个头部增加:rules=数据名称 -->
      <el-form
        label-width="0px"
        :rules="loginFormRules"
        class="login_form"
        :model="form"
        ref="loginForm"
      >
        <!-- 用户名 -->
        <!-- 表单验证用prop=具体对象名称，且写在item元素中 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item class="buttons">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单绑定内容
      form: {
        username: "admin",
        passerword: "123456",
      },

      //表单输入验证对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置表单
    resetForm() {
      this.$refs.loginForm.resetFields();
    },

    //判断登陆信息
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;
        //获取axios请求
        this.$http.post("login", this.form).then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("登录失败");
          this.$message.success("登录成功");
          console.log(res);
          window.sessionStorage.setItem("token", res.data.data.token);
          this.$router.push('/home')
        });
      });
    },
  },
};
</script>

<style scoped>
.login {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;

  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px #ddd;
}
.avatar_box img {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  background-color: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  justify-content: right;
}
</style>