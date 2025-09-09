<template>
  <div class="contentTitle">
    <div class="menuFunction">
      <span @click="changeCollapsed" class="collapsedSpanClass">
        <d-icon-menu-close v-if="!collapsed" :style="{fontSize:height * 4 / 7 +'px'}"></d-icon-menu-close>
        <d-icon-menu-open v-else  :style="{fontSize:height * 4 / 7 +'px'}"></d-icon-menu-open>
      </span>
    </div>
    <div class="routerTagFunction">
      <title-block-middle></title-block-middle>
    </div>
    <div v-if="frameHeaderHeight <= 0" :style="{width: frameContentTitleHeight+'px'}" class="headerFunction">
      <account></account>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Account from '../header/index.vue';
import { computed, ref } from "vue";
import TitleBlockMiddle from './title-block-middle.vue';
import { useDragonGlobalStore } from '../../../store';

const emit = defineEmits(['changeCollapsed']);

const store = useDragonGlobalStore();

// 是否折叠
const collapsed = ref(false);

// 顶部高度
const frameHeaderHeight = computed(() => {
  return store.frameHeaderHeight;
});

// 顶部高度
const frameContentTitleHeight = store.frameContentTitleHeight;

/**
 * 改变折叠的状态
 * @param
 * @return
 * @author     :loulan
 * */
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
  emit("changeCollapsed", collapsed.value);
}

defineProps({
  height: {
    type: Number,
    require: true,
    default: 39
  }
});
</script>

<style scoped lang="scss">
.contentTitle {
  height: 100%;
  display: flex;
  flex-direction: row;

  .menuFunction {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    .collapsedSpanClass {
      cursor: pointer;
    }

    .collapsedSpanClass:hover {
      color: blue;
    }
  }

  .routerTagFunction {
    flex-grow: 1;
    width: 1em;
    display: flex;
    align-items: center;
  }

  .headerFunction {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
</style>
