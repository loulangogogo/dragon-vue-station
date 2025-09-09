<template>
  <verify-code ref="phoneVerifyRef" v-model:account="loginData.username" v-model:code="loginData.password"
    account-label="手机号码" code-label="验证码" :label-width="0"
    :account-validate-regex="/^1(3[0-9]|4[5-9]|5[0-35-9]|6[5-7]|7[0-35-8]|8[0-9]|9[1-9])\d{8}$/"
    @send-code="sendCode" />
  <div style="margin-top: 35px">
    <el-button type="primary" @click="submit" size="large" style="width: 100%"
      :loading="loginButtonLoading">登录</el-button>
  </div>
</template>

<script lang="ts" setup>

import { reactive, ref } from "vue";
import verifyCode from "../../common/components/verify-code.vue";
import { GrantTypeEnum } from "../../common/domain/enums";
import { sendPhoneLoginVerifyCode } from "../../common/api/phone";
import { DragonMessage } from "../../common/domain/component";

defineProps({
  // 登录按钮的加载状态
  loginButtonLoading: {
    type: Boolean,
    required: false,
    default: false
  }
})

// 事件对象
const emits = defineEmits(['loginSubmit']);

const phoneVerifyRef = ref();

// 登录需要的信息
const loginData = reactive({
  username: undefined,
  password: "",
  grant_type: GrantTypeEnum.PHONE,
});

/**
* 点击发送验证码
* @author  :loulan
* */
const sendCode = async () => {
  await sendPhoneLoginVerifyCode(loginData.username);
  DragonMessage.success("验证码已发送，请注意查收。");
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  phoneVerifyRef.value.validate((verify: boolean) => {
    if (verify) {
      emits('loginSubmit', loginData);
    }
  });
}
</script>

<style scoped lang="less">
//手机号输入框使用的是数字框，所以要去掉后面的上下按钮
.phoneInputNumber {
  :deep .arco-input-suffix {
    display: none;
  }
}

// 获取验证码按钮的样式
.verifyCodeStyle {
  cursor: pointer;
}

.verifyCodeStyle:hover {
  color: blue;
}
</style>
