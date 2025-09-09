<template>
  <el-card hoverable class="card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" plain @click="dealEmail">{{ isBinding ? '解绑' : '绑定' }}邮箱</el-button>
      </div>
    </template>
    <el-icon :color="isBinding ? 'blue' : ''" style="font-size: 10vw;position: relative;top: 30px">
      <d-icon-email />
    </el-icon>
  </el-card>

  <!--绑定和解绑手机-->
  <el-dialog v-model="modalVisible" :title="(isBinding ? '解绑' : '绑定') + '邮箱'" width="450px"
    :close-on-click-modal="false" @close="close">
    <verify-code ref="emailVerifyRef" :visible-account="!isBinding" v-model:account="formData.email"
      v-model:code="formData.verifyCode" account-label="邮箱" code-label="邮箱验证码" :label-width="0"
      :account-validate-regex="/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/" @send-code="sendCode" />
    <template #footer>
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { core as coreTool } from "owner-tool-js";
import { computed, reactive, ref } from "vue";
import { sendEmailCurrentUserVerifyCode, sendEmailVerifyCode } from "../../../../common/api/email";
import { currentUserBindingEmail, currentUserUnbindingEmail } from "../../../../common/api/system/user";
import verifyCode from "../../../../common/components/verify-code.vue";
import type { UserInfo } from "../../../../common/domain/common";
import { DragonMessage, DragonNotice } from "../../../../common/domain/component";
import { EmailMessageTypeEnum } from "../../../../common/domain/enums";
import { type ResponseResult, ResponseStatusEnum } from "../../../../common/domain/response";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 是否已经绑定
const isBinding = computed(() => coreTool.isNotEmpty(userInfo.email));

// 提交绑定和解绑时候的确定按钮是否处于加载状态
const submitLoading = ref(false);

// 弹框显示
const modalVisible = ref(false);

const emailVerifyRef: any = ref(null);

// 绑定需要的数据
const formData = reactive({
  email: undefined,
  verifyCode: undefined,
});

/**
 * 点击绑定和解绑邮箱的按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealEmail = () => {
  modalVisible.value = true;
}

/**
* 发送邮箱绑定和解除绑定的验证码
* @param   
* @return  
* @author  :loulan
* */
const sendCode = () => {
  if (isBinding.value) {
    sendEmailCurrentUserVerifyCode(EmailMessageTypeEnum.BINGDING_USER).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  } else {
    sendEmailVerifyCode(formData.email, EmailMessageTypeEnum.BINGDING_USER).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  }
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  emailVerifyRef.value.validate((verify: boolean) => {
    if (verify) {
      submitLoading.value = true;
      if (isBinding.value) {
        currentUserUnbindingEmail(formData).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            emailVerifyRef.value.resetCountdownValue();
            emits("reset-user-info");
            DragonNotice.success("邮箱解绑成功");
          }
          submitLoading.value = false;
        })
      } else {
        currentUserBindingEmail(formData).then((res: ResponseResult) => {
          if (res.status === ResponseStatusEnum.OK) {
            modalVisible.value = false;
            emailVerifyRef.value.resetCountdownValue();
            emits("reset-user-info");
            DragonNotice.success("邮箱绑定成功");
          }
          submitLoading.value = false;
        })
      }
    }
  });
}

/**
 * 关闭模态框事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  formData.email = undefined;
  formData.verifyCode = undefined;
}
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

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
