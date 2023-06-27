<template>
  <!-- 路由的出口 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()

// 控制当前组件是否销毁重建
let flag = ref(true)

// 监听仓库内部数据是否发生变化
watch(
  () => layoutSettingStore.refsh,
  () => {
    // 点击刷新按钮,路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
  transform: rotate(360deg);
  transform: scale(1);
}
</style>
