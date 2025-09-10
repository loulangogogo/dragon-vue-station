<template>
  <el-menu ref="menuRef"
    class="menuClass" 
    mode="vertical" 
    :default-active="activeIndex"
    router
    :unique-opened="true" 
    :collapse="collapsed"
    menu-trigger="click" 
    background-color="#232324"
    text-color="#fff"
    active-text-color="#ffd04b">
    <menu-visible :menus="menus"></menu-visible>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { useDragonGlobalStore } from "../../../store";
import { arrayTool } from 'owner-tool-js';
import type { Menu } from "../../../common/domain/common";
import MenuVisible from "./menu-visible.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const menuRef = ref();

const store = useDragonGlobalStore();
const frameSiderHeight = computed(() => store.frameSiderHeight);
const menus = computed((): Array<Menu> => {
  return arrayTool.arrayToTree(store.menus, "id", "pid", -1)!;
});

// 菜单选中
const activeIndex = ref(route.path);

/**
 * 监听路由的变化然后改变选中菜单
 * @param
 * @return
 * @author     :loulan
 * */
watch(() => route.path,
  (val: any) => {
      nextTick(() => {
        activeIndex.value = val;
      });
  },
  {
    deep: true,
    immediate: true
  }
)

defineProps({
  collapsed: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<style scoped>
.menuClass {
  height: v-bind(frameSiderHeight+ 'px');
  user-select: none;
}
</style>
