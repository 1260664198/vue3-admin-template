<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" />
      </div>
      <div class="woman">
        <img src="../../images/woman.png" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div class="echarts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 获取图型图表的DOM节点
let charts = ref()

onMounted(() => {
  // 初始化echarts实例
  let mycharts = echarts.init(charts.value)
  console.log(mycharts)
  // 设置配置项
  mycharts.setOption({
    // 标题属性
    title: {
      text: '男女比例', // 主标题
      textStyle: {
        // 主标题颜色
        color: 'skyblue',
      },
      left: '40%',
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      show: false,
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'blue',
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        // 调整女士柱条位置
        barGap: '-100%',
        itemStyle: {
          color: 'pink',
          borderRadius: 20,
        },
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>
<style lang="scss" scoped>
.box1 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 1.25rem 0;
  .title {
    margin-left: 1.25rem;
    p {
      color: white;
      font-size: 1.25rem;
    }
  }
  .sex {
    display: flex;
    justify-content: center;
    .man {
      margin: 1.25rem;
      width: 6.9375rem;
      height: 7.1875rem;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .woman {
      margin: 1.25rem;
      width: 6.9375rem;
      height: 7.1875rem;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
  }
  .echarts {
    // width: 100%;
    height: 6.25rem;
  }
}
</style>
