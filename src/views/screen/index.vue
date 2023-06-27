<template>
  <div class="container">
    <!-- 数据大屏展示内容 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Couter class="couter"></Couter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 顶部子组件
import Top from './components/top/index.vue'
// 左侧三个子组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'

// 中间两个子组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

// 右侧三个子组件
import Rank from './components/rank/index.vue'
import Couter from './components/couter/index.vue'
import Year from './components/year/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
let screen = ref()

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})
// 定义大屏缩放比例
function getScale(width = 1920, height = 1080) {
  const window_width = window.innerWidth / width
  const window_height = window.innerHeight / height
  return window_width < window_height ? window_width : window_height
}

// 监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 120rem;
    height: 67.5rem;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 2.5rem;
        .rank {
          flex: 1.5;
        }
        .couter {
          flex: 1;
        }
        .year {
          flex: 1;
        }
      }
      .left {
        flex: 1;
        height: 65rem;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1.5;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
