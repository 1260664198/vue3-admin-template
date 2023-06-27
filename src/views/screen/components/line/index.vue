<template>
  <div class="box5">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    // 标题组件
    title: {
      //   text: '访问量',
    },
    // x|y轴
    xAxis: {
      type: 'category',
      // 两侧不留白
      boundaryGap: false,
      // 去除分割线
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 轴线的设置
      axisLine: {
        show: false,
      },
      //   刻度
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      // 轴线的设置
      axisLine: {
        show: false,
      },
      //   刻度
      axisTick: {
        show: false,
      },
    },
    grid: {
      left: 40,
      top: 0,
      bottom: 20,
      right: 20,
    },
    // 系列
    series: [
      {
        type: 'line',
        data: [12, 42, 66, 62, 77, 88, 121],
        //平滑曲线的设置
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: 'skyblue',
        },
      },
    ],
  })
})
</script>

<style lang="scss" scoped>
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 1.25rem;
  .title {
    margin-left: 1.25rem;
    p {
      color: white;
      font-size: 1.25rem;
    }
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
