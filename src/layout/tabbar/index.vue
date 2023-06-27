<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <!-- 顶部左侧静态 -->
      <tabbarLeft />
    </div>
    <div class="tabbar_right">
      <tabbarRight />
    </div>
  </div>
</template>

<script setup lang="ts">
import tabbarLeft from './tabbar_left/index.vue'
import tabbarRight from './tabbar_right/index.vue'
</script>
<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar_left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
