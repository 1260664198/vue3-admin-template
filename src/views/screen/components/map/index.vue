<template>
  <div class="box4" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 引入中国地图的json数据
import china from './china.json'
let map = ref()

// 注册中国地图
echarts.registerMap('china', china as any)
onMounted(() => {
  let mycharts = echarts.init(map.value)
  // 设置配置项
  mycharts.setOption({
    // 地图组件
    geo: {
      map: 'china', // 中国地图
      roam: true, // 鼠标缩放的效果
      // 地图文字设置
      label: {
        show: true, // 显示文字
      },
      // itemStyle: {
      //   // 每一个多边形的样式
      //   color: {},
      // },
      // opacity: 0.8,
    },
    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点,
              [113.665412, 34.757975], // 终点
            ],
            // 统一样式的设置
            itemStyle: {
              color: 'pink',
            },
          },
        ],
        // 开启动画特效
        effect: {
          show: true,
          symbol: 'circle',
          color: 'red',
          symbolSize: 40,
        },
      },
    ],
  })
})
</script>

<style lang="scss" scoped></style>
