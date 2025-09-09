## 概述
该文件夹下主要是自定义的 svg 图标的使用。svg 图标主要来自于阿里图标库，也可以自己画，然后封装到 vue 中。

## 组件说明
- d-icon.vue : 自定义图标的父组件，所有的自定义图标需要这个包裹才方便使用。
- d-icon-*.vue : 自定义图标的组件，svg 图标就是被封装在这个里面。
- icons.ts : 图标名称数组，因为所有的图标需要加载到 vue 里面，所以只要将名字写入到这个文件数组里面，就可以自动被加载进入 vue 实例使用。
- icon.vue ：这个是所有图标展示页面，可以打开连接 [/icon](/icon) 来进行访问查看。

## 自定义图标添加
1. 下载 svg 代码。（可以从阿里图标库，或者自己画图）
2. 在该文件夹下创建一个 d-icon-*.vue 的文件（*使用图标名称代替）。
3. 将 svg 代码复制到 d-icon-*.vue 文件中的 d-icon 标签下。
4. 去掉 svg 代码中关于 宽高 和 颜色 的设置。这样方面外部进行大小和颜色的调整修改。

## 使用案例
```html
<template>
    <d-icon class="icon">
        <d-icon-dragon/>
    </d-icon>
</template>

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
```