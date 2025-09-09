<template>
  <el-card hoverable class="card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" plain @click="dealPassword">修改密码</el-button>
      </div>
    </template>
    <el-icon color="blue" style="font-size: 10vw;position: relative;top: 30px">
      <d-icon-eye-off />
    </el-icon>
  </el-card>

  <!--绑定和解绑手机-->
  <el-dialog v-model="modalVisible" title="修改密码" width="450px" :close-on-click-modal="false" :show-close="false"
    @close="close">
    <div>
      <verify-code v-if="FixPasswordType.PHONE === formData.type" ref="phoneVerifyRef" :visible-account="false"
        v-model:code="formData.verifyCode" code-label="手机验证码" :label-width="0" @send-code="sendCode" />
      <verify-code v-if="FixPasswordType.EMAIL === formData.type" ref="emailVerifyRef" :visible-account="false"
        v-model:code="formData.verifyCode" code-label="邮箱验证码" :label-width="0" @send-code="sendCode" />

      <el-form :model="formData" :rules="formRules" ref="passwordFormRef" size="large">
        <el-form-item v-if="FixPasswordType.PASSWORD === formData.type" prop="oldPassword">
          <el-input v-model="formData.oldPassword" placeholder="请输入旧密码……" clearable />
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input v-model="formData.newPassword" type="password" placeholder="请输入新密码……" clearable />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </template>
    <template #title>
      <el-row style="width: 100%">
        <el-col :span="12">
          <span>修改密码</span>
        </el-col>
        <el-col :span="12" style="text-align: right;">
          <el-space class="passwordTypeSpace">
            <el-icon class="passwordTypeIcon" :color="FixPasswordType.PASSWORD === formData.type ? 'green' : ''"
              @click="formData.type = FixPasswordType.PASSWORD">
              <Hide />
            </el-icon>
          </el-space>
          <el-space class="passwordTypeSpace">
            <el-icon class="passwordTypeIcon" :color="FixPasswordType.PHONE === formData.type ? 'green' : ''"
              @click="formData.type = FixPasswordType.PHONE">
              <Iphone />
            </el-icon>
          </el-space>
          <el-space class="passwordTypeSpace">
            <el-icon class="passwordTypeIcon" :color="FixPasswordType.EMAIL === formData.type ? 'green' : ''"
              @click="formData.type = FixPasswordType.EMAIL">
              <Message />
            </el-icon>
          </el-space>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import verifyCode from "../../../../common/components/verify-code.vue";
import { reactive, ref } from "vue";
import { sendEmailCurrentUserVerifyCode } from "../../../../common/api/email";
import { sendPhoneCurrentUserVerifyCode } from "../../../../common/api/phone";
import { fixCurrentuserPassword } from "../../../../common/api/system/user";
import type { UserInfo } from "../../../../common/domain/common";
import { DragonMessage, DragonNotice } from "../../../../common/domain/component";
import { EmailMessageTypeEnum, PhoneMessageTypeEnum } from "../../../../common/domain/enums";
import { type ResponseResult, ResponseStatusEnum } from "../../../../common/domain/response";
import type { FormRules } from "element-plus";

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);
// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 弹框显示变量
const modalVisible = ref(false);

const phoneVerifyRef = ref();
const emailVerifyRef = ref();
const passwordFormRef = ref();

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 修改密码类型的美居之
enum FixPasswordType {
  PASSWORD = 10,
  PHONE = 20,
  EMAIL = 30,
}

// 修改数据
const formData = reactive<{
  oldPassword: string
  newPassword: string
  type: number
  verifyCode: string
}>({
  // 旧密码
  oldPassword: '',
  // 新密码
  newPassword: '',
  // 修改密码的类型
  type: FixPasswordType.PASSWORD,
  // 验证码
  verifyCode: ''
})

// 表单校验规则
const formRules: FormRules = {
  oldPassword: [{
    type: "string",
    required: true,
    message: "旧密码不能为空"
  }],
  newPassword: [{
    type: "string",
    required: true,
    message: "新密码不能为空"
  }]
}

/**
 * 点击修改密码的按钮
 * @param
 * @return
 * @author     :loulan
 * */
const dealPassword = () => {
  modalVisible.value = true;
}

/**
 * 修改密码
 * @param
 * @return
 * @author     :loulan
 * */
const submitFixPassword = async () => {
  submitLoading.value = true;
  const res: ResponseResult = await fixCurrentuserPassword(formData);
  if (res.status === ResponseStatusEnum.OK) {
    modalVisible.value = false;
    submitLoading.value = false;
    DragonNotice.success("密码修改成功");
  } else {
    submitLoading.value = false;
  }
}

/**
* 修改密码的时候发送验证码
* @param   
* @return  
* @author  :loulan
* */
const sendCode = () => {
  if (FixPasswordType.PHONE === formData.type) {
    sendPhoneCurrentUserVerifyCode(PhoneMessageTypeEnum.FIX_PASSWORD).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  } else if (FixPasswordType.EMAIL === formData.type) {
    sendEmailCurrentUserVerifyCode(EmailMessageTypeEnum.FIX_PASSWORD).then((res: ResponseResult) => {
      DragonMessage.success("验证码已发送，请注意查收。");
    })
  } else {
    DragonNotice.error("修改密码类型错误。");
  }
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  if (FixPasswordType.PASSWORD === formData.type) {
    passwordFormRef.value.validate((validate: boolean) => {
      // 当errors为undefined的时候表示校验成功没有错误
      if (validate) {
        submitFixPassword();
      }
    });
  } else if (FixPasswordType.EMAIL === formData.type) {
    emailVerifyRef.value.validate((verify: boolean) => {
      if (verify) {
        passwordFormRef.value.validate((validate: boolean) => {
          // 当errors为undefined的时候表示校验成功没有错误
          if (validate) {
            submitFixPassword();
            emailVerifyRef.value.clearCountDown();
          }
        });
      }
    })
  } else if (FixPasswordType.PHONE === formData.type) {
    phoneVerifyRef.value.validate((verify: boolean) => {
      if (verify) {
        passwordFormRef.value.validate((validate: boolean) => {
          // 当errors为undefined的时候表示校验成功没有错误
          if (validate) {
            submitFixPassword();
            phoneVerifyRef.value.clearCountDown();
          }
        });
      }
    });
  } else {
    DragonNotice.error("修改密码类型错误。");
  }
}

/**
 * 模态框关闭的时候触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  formData.type = FixPasswordType.PASSWORD;
  formData.verifyCode = '';
  formData.newPassword = '';
  formData.oldPassword = '';
  submitLoading.value = false;
}

</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

/*修改密码的空间样式*/
.passwordTypeSpace {
  margin-right: 10px;
}

/*修改密码图标样式*/
.passwordTypeIcon {
  font-weight: bolder;
  cursor: pointer;
  font-size: 20px;
}

.card-header {
  display: grid;
  justify-content: end;
}
</style>
