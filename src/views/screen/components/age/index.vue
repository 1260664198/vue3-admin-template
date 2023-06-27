<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      right: 10,
      top: 40,
      orient: 'vertical', // 图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
      },
    ],
  }
  mycharts.setOption(option)
})
</script>
<style lang="scss" scoped>
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 1.25rem;
    p {
      color: white;
      font-size: 1.25rem;
    }
  }
  .charts {
    height: 16.25rem;
  }
}
</style>
