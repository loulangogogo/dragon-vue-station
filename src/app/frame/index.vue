<template>
    <el-container style="width: 100%;height: 100%">
        <el-header v-if="frameHeaderHeight > 0" :style="{ height: frameHeaderHeight + 'px' }">
            <frame-header></frame-header>
        </el-header>
        <el-container>
            <el-aside style="width: auto;overflow: hidden;">
                <frame-sider class="aside-menu-class" :collapsed="collapsed"></frame-sider>
            </el-aside>
            <el-main>
                <frame-content @change-collapsed="changeCollapsed"></frame-content>
            </el-main>
        </el-container>
        <el-footer v-if="frameFooterHeight > 0" :style="{ height: frameFooterHeight + 'px' }">
            <frame-footer></frame-footer>
        </el-footer>
    </el-container>
</template>

<script lang="ts" setup>
import FrameHeader from './header.vue';
import FrameSider from './sider.vue';
import FrameContent from './content.vue';
import FrameFooter from './footer.vue';
import { useDragonGlobalStore } from "../../store";
import { ref } from "vue";

// 是否折叠
const collapsed = ref(false);

const store = useDragonGlobalStore();
const frameHeaderHeight = store.frameHeaderHeight;
const frameFooterHeight = store.frameFooterHeight;
const frameSiderMaxWidth = store.frameSiderMaxWidth;


/**
 * 改变菜单状态的收缩按钮点击事件
 * @param
 * @return
 * @author     :loulan
 * */
const changeCollapsed = (value: boolean): void => {
    collapsed.value = value;
}
</script>

<style scoped>
:deep(.el-main) {
    padding: 0px;
}

:deep(.el-header) {
    padding: 0px;
}

.aside-menu-class:not(.el-menu--collapse) {
    width: v-bind(frameSiderMaxWidth+'px');
}
</style>
