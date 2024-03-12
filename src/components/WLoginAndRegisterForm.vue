<script setup lang="ts">
// import { userLogin } from "@/types/userInfo.ts";
import {
  userLoginCodeAPI,
  userEmailAPI,
  userRegisterAPI,
  userLoginAPI,
} from "api/user.ts";
import { ref, onMounted } from "vue";
import { WNotification } from "@/utils/toast";
import { useUserStore } from "../store/user.ts";
import { useRouter } from "vue-router";
import { visitorRecord } from "@/api/common.ts";
import storage from "@/utils/storage";
const router = useRouter();
// import storage from "@/utils/storage";
const userStore = useUserStore();
const svgState = ref({
  svgNum: "",
  captachSvg: "",
});

const loginForm = ref({
  email: "",
  password: "",
  code: null,
});

const registerForm = ref({
  email: "",
  password: "",
  nickname: "",
  website: "",
  emailCode: null,
});

// 展示登录或者注册
const isLogin = ref(true);

const loginRules = ref({
  email: [
    {
      required: true,
      message: "邮箱不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "验证码不能为空",
      trigger: "blur",
    },
  ],
});

const registerRules = ref({
  email: [
    {
      required: true,
      message: "邮箱不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      message: "邮箱格式错误",
      trigger: "blur",
      min: 10,
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      message: "密码长度为6-16位",
      trigger: "blur",
      max: 16,
      min: 6,
    },
  ],
  nickname: [
    {
      required: true,
      message: "昵称不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      message: "昵称长度为2-12位",
      trigger: "blur",
      max: 12,
      min: 2,
    },
  ],
  emailCode: [
    {
      required: true,
      message: "验证码不能为空",
      trigger: "blur",
    },
  ],
});
// 获取svg图片
const userLoginCodeFC = async () => {
  svgState.value.captachSvg = (await userLoginCodeAPI()).data.data;
};

// 能否发送邮件
let canSendEmail = ref(true);
// 再次发送邮件需等待
let againSendEmailSecond = ref(10);

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (canSendEmail.value) {
    canSendEmail.value = false;
    let time = setInterval(() => {
      againSendEmailSecond.value--;
      if (againSendEmailSecond.value === 0) {
        canSendEmail.value = true;
        againSendEmailSecond.value = 10;
        clearInterval(time);
      }
    }, 1000);
    try {
      await userEmailAPI({ email: registerForm.value.email });
      WNotification.success(
        `邮件已发送往${registerForm.value.email}请注意查收`
      );
    } catch (err) {}
  }
};

// 用户注册表单获取
const registerDOM = ref();

// 用户注册
const registerUser = async () => {
  if (!registerDOM.value) return;
  await registerDOM.value.validate(async (valid: any) => {
    if (valid) {
      const { data } = await userRegisterAPI(registerForm.value);
      console.log(data.message);
      if (data.status === 1) {
        WNotification.success(data.message);
        isLogin.value = true;
        registerDOM.value.resetFields();
      }
    } else {
      console.log("提交失败");
      return false;
    }
  });
};

// 用户登录表单DOM
const userLoginDOM = ref();
// 用户登录
const userLogin = async () => {
  if (!userLoginDOM.value) return;
  await userLoginDOM.value.validate(async (valid: any) => {
    if (valid) {
      try {
        const { data } = await userLoginAPI(loginForm.value);
        // 权限存储
        storage.set("perms", data.data.roleInfo.perms);
        userStore.LoginInfo = data.data;
        WNotification.success(data.message);
        visitorRecord({ type: 1, nickname: userStore.LoginInfo.nickname });
        router.push("/home");
      } catch (err) {
        console.error(err);
      }
    }
  });
};

const visitorLogin = async () => {
  const { data } = await userLoginAPI({
    email: "manage.visitor",
    password: "admin",
    code: 222,
    visitor: "visitor",
  });
  // 权限存储
  storage.set("perms", data.data.roleInfo.perms);
  userStore.LoginInfo = data.data;
  WNotification.success("欢迎访客访问");
  visitorRecord({ type: 1, nickname: userStore.LoginInfo.nickname });
  router.push("/home");
};

const tryDemo = async () => {};

onMounted(() => {
  userLoginCodeFC();
});
</script>

<template>
  <div class="login-and-register">
    <div class="flex between chooseBox">
      <div class="left-showing-box pl10">
        <span class="title">{{ isLogin ? "LOGIN" : "REGISTER" }}</span>
      </div>
      <div class="flex start btnList">
        <div class="btnSize login-btn ml10 pointer" @click="isLogin = true">
          登录
        </div>
        <div class="btnSize register-btn ml10 pointer" @click="isLogin = false">
          注册
        </div>
      </div>
    </div>
    <div class="login-box" v-if="isLogin">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="userLoginDOM"
        label-width="60px"
        label-position="right"
        hide-required-asterisk
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="loginForm.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" class="flex" prop="code">
          <div class="flex jcenter">
            <el-input v-model="loginForm.code" placeholder="验证码"></el-input>
            <div
              v-html="svgState.captachSvg"
              class="ml10 pointer"
              @click="userLoginCodeFC"
            ></div>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex jcenter">
        <div class="animationBtn pointer" @click="userLogin">登录</div>
      </div>
      <div class="login-way-box mt20 flex between">
        <div @click="visitorLogin" class="animationBtn pointer w64 mr10">
          游客浏览
        </div>
        <el-button disabled>手机登录</el-button>
        <el-button disabled>二维码登录</el-button>
      </div>
      <div class="tac mt10 mb10 text-seconed fz12">其他登录方式</div>
      <div class="login-icon-box flex between">
        <i @click="tryDemo" class="iconfont fz24 text-seconed pointer"
          >&#xe673;</i
        >
        <i class="iconfont fz24 text-seconed pointer">&#xe686;</i>
        <i class="iconfont fz24 text-seconed pointer">&#xe8bb;</i>
        <i class="iconfont fz24 text-seconed pointer">&#xe882;</i>
        <i class="iconfont fz24 text-seconed pointer">&#xe67a;</i>
      </div>
    </div>

    <div class="register-box" v-else>
      <el-form
        ref="registerDOM"
        :model="registerForm"
        :rules="registerRules"
        label-width="60px"
        label-position="right"
        hide-required-asterisk
      >
        <el-form-item label="邮箱" class="flex" prop="email">
          <div class="flex between get-email">
            <el-input
              v-model="registerForm.email"
              placeholder="绑定邮箱可通过邮箱接收信息"
            ></el-input>
            <div
              :class="['get-email-btn', 'pointer', { disabled: !canSendEmail }]"
              @click="sendEmailCode"
            >
              {{ canSendEmail ? "邮箱验证" : againSendEmailSecond + "s" }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="emailCode">
          <el-input
            v-model="registerForm.emailCode"
            placeholder="请输入邮箱验证码"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="站点" prop="website">
          <el-input
            v-model="registerForm.website"
            placeholder="绑定个人站点可创建友链"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="flex jcenter">
        <div class="animationBtn pointer" @click="registerUser">注册</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-input {
  --el-input-text-color: #ffffff;
}

.login-and-register {
  :deep(.el-form-item__label) {
    color: $seconed;
  }
  :deep(.el-input__wrapper) {
    background-color: transparent;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px $seconed;
  }
  .chooseBox {
    margin-top: 20px;
    margin-bottom: 20px;
    .left-showing-box {
      position: relative;
      line-height: 40px;
      height: 40px;
      width: 100%;
      background-color: $primary;
      color: $seconed;
      margin-right: 32px;
      &:after {
        position: absolute;
        right: -32px;
        bottom: 0;
        content: "";
        display: block;
        height: 40px;
        width: 32px;
        background-image: linear-gradient(
          116.565deg,
          $primary 50%,
          transparent 50%
        );
      }
      .title {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-family: "Poppins", sans-serif;
        font-weight: 700;
      }
    }

    .btnList {
      .btnSize {
        text-align: center;
        line-height: 40px;
        height: 40px;
        width: 40px;
      }
      .login-btn {
        background-color: $primary;
        color: $seconed;
      }
      .register-btn {
        color: $seconed;
        background-color: $primary;
      }
    }
  }
  .login-box {
    .login-code {
      width: 55px;
    }
  }
  .register-box {
    .get-email {
      width: 100%;
      .get-email-btn {
        width: 96px;
        text-align: center;
        margin-left: 10px;
        height: 32px;
        background-color: $primary;
      }
    }
  }
}
</style>
