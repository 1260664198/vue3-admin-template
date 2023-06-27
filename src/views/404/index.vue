<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" />
    <el-button type="danger" size="default" class="btn" @click="goHome">
      回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
  img {
    display: inline-block;
  }
}
</style>
