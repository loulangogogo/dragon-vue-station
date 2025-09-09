<template>
    <div v-loading="loading">
        <el-image :src="qrcodeUrl" class="wechatQrcode" alt="微信扫码" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { generateQrcodeUrl } from '../tool/tool';

const props = defineProps({
    value: {
        type: String,
        required: true,
        default: ''
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    }
})

const qrcodeUrl = ref();


watch(() => props.value, (val: string) => {
    generateQrcodeUrl(val).then((res: string) => {
        qrcodeUrl.value = res;
    })
}, {
    deep: true,
    immediate: true
})



</script>

<style scoped lang="scss">
.wechatQrcodeDiv {
    width: 100%;
    display: flex;
    justify-content: center;
}

.wechatQrcode {
    width: 100%;
}
</style>