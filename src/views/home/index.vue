<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好!&nbsp;{{ userStore.username }}</h3>
        <p class="sbutitle">后台管理系统</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="450px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关的仓库,获取当前用户的头像,昵称
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()

// 引入封装的时间
import { getTime } from '@/utils/time'
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
  }
  .title {
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 30px;
  }
  .sbutitle {
    font-style: italic;
    color: silver;
  }
}
.bottoms {
  display: flex;
  justify-content: center;
}
</style>
