// 根组件
import app from './app';
// 状态管理器 pinia。状态管理器放在这个地方是因为很多地方直接使用，必须提前引入并使用，否则会报错
import { createPinia } from 'pinia'
// 路由
import router from '../router/index';
// ui组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(createPinia())
    .use(router)
    .use(ElementPlus)
    .mount('#app');

