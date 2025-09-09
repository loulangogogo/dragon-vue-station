import {createApp, defineAsyncComponent} from 'vue';
import App from '../app/App.vue';

// 图标数组
import icons from "../common/icon/icons";


// 创建vue实例
const dragonApp = createApp(App);

// 立即执行函数，添加自定义图标组件
(()=>{
    for (const icon of icons) {
        dragonApp.component(icon, defineAsyncComponent(()=>import(`../common/icon/${icon}.vue`)));
    }
})();


export default dragonApp;