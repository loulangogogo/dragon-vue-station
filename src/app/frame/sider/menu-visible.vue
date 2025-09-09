<template>
  <template v-for="(menu, index) in menus" :key="menu.id">
    <router-link v-if="menu.type === MenuTypeEnum.MENU" :to="'/' + menu.code + '-' + menu.id">
      <!-- 这个地方的 key 要和 router 的 path 保持一致，便于默认选中菜单 -->
      <el-menu-item :index="'/' + menu.code + '-' + menu.id">
        <template v-if="menu.iconType === MenuIconTypeEnum.ALI">
          <component :is="menu.icon" style="font-size: 22px;margin: 0px;" class="arco-icon" />
        </template>
        <template v-else>
          <component is="d-icon-dragon" style="font-size: 22px;margin: 0px;" class="arco-icon" />
        </template>
        <span style="margin-left: 7px;user-select: none">{{ menu.name }}</span>
      </el-menu-item>
    </router-link>
    <el-sub-menu v-else-if="menu.type === MenuTypeEnum.DIR" :index="menu.id + ''">
      <template #title>
        <template v-if="menu.iconType === MenuIconTypeEnum.ALI">
          <component :is="menu.icon" style="font-size: 22px;margin: 0px;" class="arco-icon" />
        </template>
        <template v-else>
          <component is="d-icon-dragon" style="font-size: 22px;margin: 0px;" class="arco-icon" />
        </template>
        <span style="margin-left: 7px;user-select: none">{{ menu.name }}</span>
      </template>
      <menu-visible v-if="!isEmpty(menu.children)" :menus="menu.children"></menu-visible>
    </el-sub-menu>
  </template>
</template>

<script lang="ts" setup>
import { core as coreTool } from 'owner-tool-js';
import type { Menu } from "../../../common/domain/common";
import { MenuIconTypeEnum, MenuTypeEnum } from "../../../common/domain/enums";

/**
 * 判断数据或者字符串是否为空
 * @param
 * @return
 * @author     :loulan
 * */
const isEmpty = (data: any): boolean => coreTool.isEmpty(data);

const { menus } = defineProps<{
  menus: Array<Menu> | undefined
}>();
</script>

<style scoped></style>
