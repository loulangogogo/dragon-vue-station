<template>
  <!--展示的卡片-->
  <el-card hoverable class="card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" plain @click="dealWechat">{{ isBinding ? '解绑' : '绑定' }}微信</el-button>
      </div>
    </template>
    <el-icon :color="isBinding ? 'blue' : ''" style="font-size: 10vw;position: relative;top: 30px">
      <d-icon-wechat />
    </el-icon>
  </el-card>

  <!--绑定和解绑微信-->
  <el-dialog v-model="modalVisible" :title="'扫码' + (isBinding ? '解绑' : '绑定') + '微信'" width="350px"
    :close-on-click-modal="false" @close="close">
    <div style="position: static">
      <qrcode-vue :loading="loading" :value="qrcode.url" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">

import { ref, reactive, computed, onMounted } from "vue";
import qrcodeVue from "../../../../common/components/qrcode-vue.vue";
import { getWechatQrcode } from "../../../../common/api/login";
import type { Qrcode } from "../../../../common/domain/interfaces";
import { core as coreTool, functionTool } from "owner-tool-js";
import { type ResponseResult, ResponseStatusEnum } from "../../../../common/domain/response";
import { WechatQrcodeTypeEnum } from "../../../../common/domain/enums";
import type { UserInfo } from "../../../../common/domain/common";
import {
  currentUserBindingWechat,
  currentUserUnbindingWechat
} from "../../../../common/api/system/user";
import { DragonNotice } from "../../../../common/domain/component";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定微信
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.unionid));

// 弹框显示
const modalVisible = ref(false);

// 二维码的加载状态
const loading = ref(false);

// 登录需要的信息
const bingdingWechatData = reactive({
  ticket: ""
});

// 微信二维码对象数据
let qrcode = reactive<Qrcode>({});

// 定时请求token的对象
let setIntervalObj: number;

/**
 * 点击处理微信
 * @param
 * @return
 * @author     :loulan
 * */
const dealWechat = () => {
  loading.value = true;
  getQrcode();
  modalVisible.value = true;
}

/**
 * 获取微信二维码
 * @param
 * @return
 * @author     :loulan
 * */
const getQrcode = async () => {
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
  // 请求微信二维码
  const res: ResponseResult = await getWechatQrcode(WechatQrcodeTypeEnum.BINDING_USER);
  if (res.status === ResponseStatusEnum.OK) {
    functionTool.combineObj(qrcode, res.data);
    loading.value = false;
    bingdingWechatData.ticket = <string>qrcode.ticket;
    // 成功请求到数据之后，进入定时器进行定时token的请求
    setIntervalObj = setInterval(() => {
      if (isBinding.value) {
        // 如果已经绑定微信，那么这里就是解除绑定
        currentUserUnbindingWechat(bingdingWechatData.ticket).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
            modalVisible.value = false;
            emits("reset-user-info");
            DragonNotice.success("微信解绑成功");
          }
        })
      } else {
        // 如果没有绑定卫星，那么这里就是绑定微信
        currentUserBindingWechat(bingdingWechatData.ticket).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);
            modalVisible.value = false;
            emits("reset-user-info");
            DragonNotice.success("微信绑定成功");
          }
        })
      }
    }, 2500);
  } else {
    qrcode.url = "当前二维码错误，请重新操作。";
    qrcode.ticket = undefined;
    qrcode.expire_seconds = undefined;
  }
}

/**
 * 点击关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  // 如果定时器存在就先关闭定时器
  if (coreTool.isExist(setIntervalObj)) clearInterval(setIntervalObj);

  qrcode.url = "当前二维码不存在。";
  qrcode.ticket = undefined;
  qrcode.expire_seconds = undefined;
}
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

.card-header {
  display: grid;
  justify-content: end;
}
</style>
