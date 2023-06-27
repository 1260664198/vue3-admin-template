<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">毛遂酒业后台管理</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 获取路由器对象
import { useRouter } from 'vue-router'
let $router = useRouter()

// 存储当前时间
import moment from 'moment'
let time = ref(moment().format('YYYY年MM月DD日:hh:mm:ss'))
let timer = ref(0)
onMounted(() => {
  setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日:hh:mm:ss')
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
// 点击首页按钮回到首页
const goHome = () => {
  $router.push('/home')
}
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 2.5rem;
  display: flex;
  .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    .lbtn {
      width: 9.375rem;
      height: 2.5rem;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: cover;
      text-align: center;
      line-height: 2.5rem;
      color: #29fcff;
      font-size: 1.25rem;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 4.625rem;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: cover;
      text-align: center;
      line-height: 4.625rem;
      color: #29fcff;
      font-size: 1.875rem;
    }
  }
  .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 9.375rem;
      height: 2.5rem;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: cover;
      float: left;
      text-align: center;
      line-height: 2.5rem;
      color: #29fcff;
    }
    .time {
      color: #29fcff;
      margin-right: 1.25rem;
      font-size: 1.25rem;
    }
  }
}
</style>
