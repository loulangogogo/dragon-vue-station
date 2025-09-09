<template>
  <template v-if="!loadingStatus">
    <div class="loaderPosition">
      <div class="loader"></div>
    </div>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script setup lang="ts">

import { computed, ref } from "vue";
import { useDragonGlobalStore } from "../store";
/***************************************************************************************************************/

const store = useDragonGlobalStore();

// 监听浏览器高度和宽度
store.watchScreenWH();

// 项目是否加载成功的状态。（没有加载成功要显示加载图标）
const loadingStatus = computed<boolean>((): boolean => {
  return store.loadingStatus;
})

</script>

<style lang="scss">
/*滚动条的样式设置*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #99a9bf;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 7px;
  background-color: #d3dce6;
}
</style>

<style lang="scss" scoped>
/* 加载的时候显示的样式 */
@use './style.scss';
</style>
