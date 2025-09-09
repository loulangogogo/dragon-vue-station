<template>
  <verify-code ref="emailVerifyRef" v-model:account="loginData.username" v-model:code="loginData.password"
    account-label="邮箱号码" code-label="验证码" :label-width="0"
    :account-validate-regex="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/" @send-code="sendCode" />
  <div style="margin-top: 35px">
    <el-button type="primary" @click="submit" size="large" style="width: 100%"
      :loading="loginButtonLoading">登录</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { sendEmailLoginVerifyCode } from "../../common/api/email";
import verifyCode from "../../common/components/verify-code.vue";
import { DragonMessage } from "../../common/domain/component";
import { GrantTypeEnum } from "../../common/domain/enums";

defineProps({
  // 登录按钮的加载状态
  loginButtonLoading: {
    type: Boolean,
    required: false,
    default: false
  }
})

// 邮件验证的ref
const emailVerifyRef = ref();

// 事件对象
const emits = defineEmits(['loginSubmit']);


// 登录需要的信息
const loginData = reactive({
  username: "",
  password: "",
  grant_type: GrantTypeEnum.EMAIL,
});

/**
* 点击发送验证码
* @author  :loulan
* */
const sendCode = async () => {
  await sendEmailLoginVerifyCode(loginData.username);
  DragonMessage.success("验证码已发送，请注意查收。");
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  emailVerifyRef.value.validate((verify: boolean) => {
    if (verify) {
      emits('loginSubmit', loginData);
    }
  });
}
</script>

<style scoped></style>
