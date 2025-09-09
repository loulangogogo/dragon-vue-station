<template>
  <el-card hoverable class="card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" plain @click="dealPhone">{{ isBinding ? '解绑' : '绑定' }}手机</el-button>
      </div>
    </template>
    <el-icon :color="isBinding ? 'blue' : ''" style="font-size: 10vw;position: relative;top: 30px">
      <d-icon-phone />
    </el-icon>
  </el-card>

  <!--绑定和解绑手机-->
  <el-dialog v-model="modalVisible" :title="(isBinding ? '解绑' : '绑定') + '手机'" width="450px"
    :close-on-click-modal="false" @close="close">
    <verify-code ref="phoneVerifyRef" :visible-account="!isBinding" v-model:account="formData.phone"
      v-model:code="formData.verifyCode" account-label="手机号码" code-label="手机验证码" :label-width="0"
      :account-validate-regex="/^1(3[0-9]|4[5-9]|5[0-35-9]|6[5-7]|7[0-35-8]|8[0-9]|9[1-9])\d{8}$/"
      @send-code="sendCode" />
    <template #footer>
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import verifyCode from "../../../../common/components/verify-code.vue";
import { core as coreTool } from "owner-tool-js";
import { computed, reactive, ref } from "vue";
import { sendPhoneCurrentUserVerifyCode, sendPhoneVerifyCode } from "../../../../common/api/phone";
import { currentUserBindingPhone, currentUserUnbindingPhone } from "../../../../common/api/system/user";
import type { UserInfo } from "../../../../common/domain/common";
import { DragonMessage, DragonNotice } from "../../../../common/domain/component";
import { PhoneMessageTypeEnum } from "../../../../common/domain/enums";
import { type ResponseResult, ResponseStatusEnum } from "../../../../common/domain/response";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.phone));

// 弹框确定按钮
const submitLoading = ref(false);

// 弹框显示
const modalVisible = ref(false);
const phoneVerifyRef: any = ref(null);

// 绑定需要的数据
const formData = reactive({
  phone: undefined,
  verifyCode: undefined,
});

/**
 * 点击绑定和解绑手机按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealPhone = () => {
  modalVisible.value = true;
}

/**
* 发送绑定手机号码的短信验证码
* @param   
* @return  
* @author  :loulan
* */
const sendCode = () => {
  if (isBinding.value) {
    sendPhoneCurrentUserVerifyCode(PhoneMessageTypeEnum.BINGDING_USER).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  } else {
    sendPhoneVerifyCode(formData.phone, PhoneMessageTypeEnum.BINGDING_USER).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  }
}

/**
 * 点击提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  phoneVerifyRef.value.validate((verify: boolean) => {
    if (verify) {
      submitLoading.value = true;
      if (isBinding.value) {
        currentUserUnbindingPhone(formData).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            phoneVerifyRef.value.resetCountdownValue();
            emits("reset-user-info");
            DragonNotice.success("手机解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingPhone(formData).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            phoneVerifyRef.value.resetCountdownValue();
            emits("reset-user-info");
            DragonNotice.success("手机绑定成功");
          }
          submitLoading.value = false;
        })
      }
    }
  });
}

/**
 * 弹框关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {

}
</script>

<style scoped lang="less">
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

//手机号输入框使用的是数字框，所以要去掉后面的上下按钮
.phoneInputNumber {
  :deep(.arco-input-suffix) {
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

.card-header {
  display: grid;
  justify-content: end;
}
</style>
