<template>
  <div class="wechatQrcodeDiv">
    <div style="width: 80%;">
      <span v-if="currentEnvVal() == EnvEnum.DEV" style="color: red;">当前为开发环境，扫码无法登录</span>
      <qrcode-vue :loading="loading" :value="qrcode.url" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import QrcodeVue from "../../common/components/qrcode-vue.vue";
import { getWechatQrcode } from "../../common/api/login";
import { type ResponseResult, ResponseStatusEnum } from "../../common/domain/response";
import { functionTool, core as coreTool } from "owner-tool-js";
import { GrantTypeEnum, WechatQrcodeTypeEnum, EnvEnum } from "../../common/domain/enums";
import { type Qrcode } from "../../common/domain/interfaces";
import { currentEnvVal } from '../../common/tool/tool';

// 事件对象
const emit = defineEmits(['loginSubmit']);

// 登录需要的信息
const loginData = reactive({
  code: "",
  grant_type: GrantTypeEnum.WECHAT_SCAN
});

// 微信二维码对象数据
let qrcode = reactive<Qrcode>({
  url: "二维码正在生成……"
});

// 二维码的加载状态
const loading = ref(false);

// 定时请求token的对象
let setIntervalObj: number;

/**
 * 获取微信登陆二维码
 * @param
 * @return
 * @author     :loulan
 * */
const getQrcode = async () => {
  loading.value = true;
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
  // 请求微信二维码
  const res: ResponseResult = await getWechatQrcode(WechatQrcodeTypeEnum.LOGIN);
  if (res.status === ResponseStatusEnum.OK) {
    functionTool.combineObj(qrcode, res.data)

    loginData.code = <string>qrcode.ticket;
    loading.value = false;
    // 成功请求到数据之后，进入定时器进行定时token的请求
    setIntervalObj = setInterval(() => {
      // 如果对象对象请求成功就会跳转无须专门关闭定时器
      emit("loginSubmit", loginData);
    }, 2000);
  }
}

onMounted(() => {
  getQrcode();
})

onUnmounted(() => {
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
})
</script>

<style scoped lang="scss">
.wechatQrcodeDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
