<template>
    <div class="login-wrap">
        <div class="ms-title">记录美好生活</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">注册账号发送邮件到990974807@qq.com</p>
            </el-form>
        </div>
    </div>
</template>



<script>
import { postHttp, httpHost } from "@/http";
export default {
  data: function() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      ms_username: "",
      dataList: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginReq();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async loginReq() {
      const params = {
        username: this.ruleForm.username,
        password: this.ruleForm.password
      };
      const result = await postHttp({ url: "/login", params });
      if (!result) {
        return;
      }
      this.$message({
        message: "登录成功",
        type: "success"
      });
      localStorage.setItem("username",result.inner.name);
      localStorage.setItem("userid",result.inner.pkey);
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}
.ms-title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 160px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>