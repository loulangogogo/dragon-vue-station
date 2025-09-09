<template>
    <div style="margin: 0px 20%;">
        <div style="margin: 20px 0px;">
            <el-input v-model="searchContent" @input="search" size="large" placeholder="请输入搜索" prefix-icon="icon-search" />
        </div>
        <div>
            <template v-for="(icon) in allIcons">
                <component class="icon" :is="icon" @click="iconClick(icon)"></component>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { coreTool, windowsTool } from 'owner-tool-js';
import icons from './icons';
import { ref } from 'vue';
import { DragonMessage } from '../domain/component';

// 搜索内容
const searchContent = ref();

// 图标数组
const allIcons = ref(icons);

/**
* 搜索图标
* @param  content 图名名称
* @return  
* @author  :loulan
* */
const search = (content: string) => {
    if (coreTool.isEmpty(content)) {
        allIcons.value = icons;
    } else {
        allIcons.value = icons.filter(item => {
            return item.includes(content);
        });
    }
}

/**
* 当点击图标的时候要复制图标的代码
* @param   被打击的元素的名称
* @return  
* @author  :loulan
* */
const iconClick = (iconName: string) => {
    // 将图标元素复制到剪切板中
    windowsTool.copyText(`<${iconName} />`);
    DragonMessage.success('复制成功');
}

</script>

<style scoped lang="scss">
.icon {
    font-size: 50px;
    padding: 5px;
    color: black;
    cursor: pointer;
}

.icon:hover {
    background-color: rgb(208, 246, 242);
}
</style>