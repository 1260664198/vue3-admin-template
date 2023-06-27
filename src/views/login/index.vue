<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_from"
          :model="loginFrom"
          :rules="rules"
          ref="loginFroms"
        >
          <h1>Hello,Apple!</h1>
          <h2>欢迎来到立友果业</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginFrom.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginFrom.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()

// 获取路由对象
let $route = useRoute()

// 获取el-from组件
let loginFroms = ref()

// 获取路由器
let $router = useRouter()

// 定义变量控制按钮加载效果
let loading = ref(false)

// 收集账号与密码的数据
let loginFrom = reactive({
  username: 'admin',
  password: '111111',
})
// 登录按钮回调
const login = async () => {
  // 保证全部表单项校验通过再发请求
  await loginFroms.value.validate()

  loading.value = true
  // 用户登录的方法
  try {
    await userStore.userLogin(loginFrom)
    // 编程式导航跳转到展示数据首页
    // 判断登陆的时候,路由路劲当中是否有query参数,如果有就用query,没有跳转到首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好!`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    // 登陆失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义表单校验规则
const validatorUserName = (rele: any, value: any, callback: any) => {
  // rele:即为校验规则对象 value:即为表单元素文本内容 函数:如果符合条件callback放行通过 不符合条件callback方法,注入错误提示信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}

const validatorPassword = (rele: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}
// 定义表单校验需要的配置对象
const rules = {
  username: [
    // { require: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change',},
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // {require: true,min: 6,max: 15,message: '账号长度至少六位',trigger: 'change',},
    { trigger: 'change', validator: validatorPassword },
  ],
}
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_from {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
