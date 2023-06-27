<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
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

  let option = {
    title: {
      text: '数据统计',
      textStyle: {
        color: 'white',
      },
    },

    radar: {
      indicator: [
        { name: 'Sales', max: 6500 },
        { name: 'Administration', max: 16000 },
        { name: 'Information Technology', max: 30000 },
        { name: 'Customer Support', max: 38000 },
        { name: 'Development', max: 52000 },
        { name: 'Marketing', max: 25000 },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: 'Allocated Budget',
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending',
          },
        ],
      },
    ],
  }

  // 设置配置项
  myeharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.box8 {
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
