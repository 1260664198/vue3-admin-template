<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    // 标题组件
    title: {
      // 主标题
      text: '景区排行',
      link: 'http://www.jiuse73.com/',
      // 标题的位置
      left: '50%',
      // 主标题文字样式
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20,
      },
      // 子标题
      subtext: '各大景区排行',
      sublink: 'http://www.jiuse73.com/',
      // 子标题的样式
      subtextStyle: {
        color: 'yellowgreen',
      },
    },
    // x|y
    xAxis: {
      type: 'category', // 图形在x轴中均匀分布
    },
    yAxis: {},
    // 布局组件
    grid: {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
    // 系列:决定显示图形图表是哪一种的
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 50, 30, 20, 70],
        // 柱状图:图形上的文本标签
        label: {
          show: true,
          // 文章的位置
          position: 'insideTop',
          // 文字颜色
          color: 'yellowgreen',
        },
        // 是否显示背景颜色
        showBackground: true,
        backgroundStyle: {},
        // 柱条的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          // 柱条颜色
          color: function (data: any) {
            // 给每一个柱条分别添加背景颜色
            let arr = [
              'red',
              'pink',
              'hotpink',
              'blue',
              'yellow',
              'skublue',
              'green',
            ]
            return arr[data.dataIndex]
          },
        },
      },
      {
        type: 'line',
        data: [10, 20, 30, 50, 30, 20, 70],
        smooth: true,
      },
    ],
    tooltip: {
      backgroundColor: 'yellow',
    },
  })
})
</script>

<style lang="scss" scoped>
.box6 {
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
