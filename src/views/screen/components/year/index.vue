<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
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
  let myeharts = echarts.init(charts.value)
  myeharts.setOption({
    // title: {
    //   // text: '散点图',
    //   left: '50%',
    //   textStyle: {
    //     color: 'white',
    //   },
    // },
    xAxis: {
      type: 'category',
      show: true,
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [33, 44, 22, 55, 77, 88, 35, 67, 89, 15, 67, 89, 99, 66, 77],
      // 标记图形设置
      symbol: 'diamond',
      symbolSize: 16,
      // 图文标签
      label: {
        show: true,
        position: 'top',
        color: 'yellowgreen',
      },
      // 散点图标标记的颜色
      itemStyle: {
        color: {
          type: 'linear',
        },
      },
    },
  })
})
</script>

<style lang="scss" scoped>
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 1.25rem 0;
  .title {
    margin-left: 0.3125rem;
    p {
      color: white;
      font-size: 1.25rem;
    }
  }
  .charts {
    height: calc(100% - 1.875rem);
  }
}
</style>
