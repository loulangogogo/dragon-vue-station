<template>
  <div class="header">
    <div class="otherHeader"></div>
    <div class="userAccountHeader" :style="{width: frameHeaderHeight+'px'}">
      <account></account>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDragonGlobalStore } from '@/store';
import Account from './header/index.vue';
import { computed } from 'vue';


const store = useDragonGlobalStore();


// 顶部高度
const frameHeaderHeight = computed(() => {
  return store.frameHeaderHeight;
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, #07f807, blue);
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .otherHeader {
    flex-grow: 1;
  }

  .userAccountHeader {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
