<template>
  <div style="width: 100%;height: 100%;">
    <div class="titleBlockDiv">
      <title-block :height="frameContentTitleHeight"
        @change-collapsed="(collapsed: boolean) => $emit('changeCollapsed', collapsed)" />
    </div>
    <div class="contentDiv">
      <router-view :content-height="frameContentHeight" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "./content/title-block.vue";
import { useDragonGlobalStore } from "../../store";
import { computed, getCurrentInstance, ref } from "vue";
defineEmits(["changeCollapsed"]);


const store = useDragonGlobalStore();
const frameContentTitleHeight = store.frameContentTitleHeight - 1; // 这里进行-1是因为边框底部设置了线宽1px
const frameContentHeight = computed(() => store.frameContentHeight);


</script>

<style scoped>
.titleBlockDiv {
  background: #f0f0f0;
  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.1),
    inset 10px 0 30px rgba(255, 0, 0, 0.1),
    inset -10px 0 30px rgba(0, 255, 0, 0.1),
    inset 0 10px 30px rgba(0, 0, 255, 0.1);
  height: v-bind(frameContentTitleHeight+'px');
  /* border-bottom: 1px solid rgba(61, 60, 60, 0.99); */
  overflow: hidden;
}

.contentDiv {
  margin: 0 5px;
  background-color: rgb(255, 255, 255);
  height: v-bind(frameContentHeight+'px');
  overflow: auto;
}
</style>
