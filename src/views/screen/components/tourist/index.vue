<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>123456</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in poople" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
let poople = ref('215908人')

// 引入echarts
import * as echarts from 'echarts'
// 水球图 拓展插件
import 'echarts-liquidfill'
let charts = ref() // 获取节点
onMounted(() => {
  // 获取echarts实例
  let mycharts = echarts.init(charts.value)
  // 设置实例的配置项
  mycharts.setOption({
    // 标题组件
    title: {
      // text: 'shuasd',
    },
    // x轴组件
    xAxis: {},
    yAxis: {},
    // 系列:决定你展示什么样的图形图标
    series: {
      type: 'liquidFill', // 系列
      data: [0.6, 0.5, 0.4, 0.3], // 展示的数据
      animationDuration: 0,
      animationDurationUpdate: 2000,
      animationEasingUpdate: 'cubicOut',
      radius: '90%', // 半径(大小)
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>
<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 0.625rem;
  .top {
    margin-left: 1.25rem;

    .title {
      color: white;
      font-size: 1.25rem;
    }
    .bg {
      width: 4.25rem;
      height: 0.4375rem;
      background: url(../../images/dataScreen-title.png);
      background-size: 100% 100%;
      margin-top: 0.625rem;
    }
    .right {
      float: right;
      color: white;
      font-size: 1.25rem;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 1.875rem;
    display: flex;
    padding: 0.625rem;
    span {
      flex: 1;
      height: 2.5rem;
      text-align: center;
      line-height: 2.5rem;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }
  .charts {
    width: 100%;
    height: 17.5rem;
  }
}
</style>
