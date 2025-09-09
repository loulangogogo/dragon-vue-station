<template>
    <el-dialog v-model="modalVisible" title="账户注销" width="450px" :close-on-click-modal="false" :show-close="false"
        @close="close">
        <div>
            <verify-code v-if="UnregisterTypeEnum.PHONE === formData.type" ref="phoneVerifyRef" :visible-account="false"
                v-model:code="formData.verifyCode" code-label="手机验证码" :label-width="0" @send-code="sendCode" />
            <verify-code v-if="UnregisterTypeEnum.EMAIL === formData.type" ref="emailVerifyRef" :visible-account="false"
                v-model:code="formData.verifyCode" code-label="邮箱验证码" :label-width="0" @send-code="sendCode" />
        </div>

        <template #header>
            <div style="width: 100%;display: flex;justify-content: space-between;">
                <div>
                    <span>注销账号</span>
                </div>
                <div>
                    <el-space class="passwordTypeSpace">

                        <el-icon :style="{ color: UnregisterTypeEnum.PHONE === formData.type ? 'green' : '' }"
                            class="passwordTypeIcon" @click="formData.type = UnregisterTypeEnum.PHONE">
                            <Iphone />
                        </el-icon>
                    </el-space>
                    <el-space class="passwordTypeSpace">
                        <el-icon :style="{ color: UnregisterTypeEnum.EMAIL === formData.type ? 'green ' : '' }"
                            class="passwordTypeIcon" @click="formData.type = UnregisterTypeEnum.EMAIL">
                            <Message />
                        </el-icon>
                    </el-space>
                </div>
            </div>
        </template>
        <template #footer>
            <el-button  @click="modalVisible = false">取消</el-button>
            <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import verifyCode from "../../../common/components/verify-code.vue";
import { reactive, ref } from 'vue';
import { unregisterCurrentUser } from "../../../common/api/frame";
import { DragonMessage, DragonNotice } from '../../../common/domain/component';
import { type ResponseResult, ResponseStatusEnum } from '../../../common/domain/response';
import { sendPhoneCurrentUserVerifyCode } from "../../../common/api/phone";
import { sendEmailCurrentUserVerifyCode } from "../../../common/api/email";

// 修改密码成功要退出登陆
const emits = defineEmits(["logout"]);

const modalVisible = ref(false);
const submitLoading = ref(false);
const phoneVerifyRef = ref();
const emailVerifyRef = ref();

// 注销账号类型的枚举值
enum UnregisterTypeEnum {
    PHONE = 20,
    EMAIL = 30,
}

const formData = reactive<{
    type: number
    verifyCode: string
}>({
    // 注销账号的类型，是通过手机还是邮件
    type: UnregisterTypeEnum.PHONE,
    // 验证码
    verifyCode: ''
})


/**
* 发送验证码
* @param   
* @return  
* @author  :loulan
* */
const sendCode = () => {
    if (UnregisterTypeEnum.EMAIL === formData.type) {
        sendEmailCurrentUserVerifyCode(UnregisterTypeEnum.EMAIL).then((res: ResponseResult) => {
            DragonMessage.success("验证码已发送，请注意查收。");
        })
    } else if (UnregisterTypeEnum.PHONE === formData.type) {
        sendPhoneCurrentUserVerifyCode(UnregisterTypeEnum.PHONE).then((res: ResponseResult) => {
            DragonMessage.success("验证码已发送，请注意查收。");
        })
    } else {
        DragonNotice.error("注销账号发生错误。");
    }
}

/**
 * 点击确定提交按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
    if (UnregisterTypeEnum.EMAIL === formData.type) {
        emailVerifyRef.value.validate(async (verify: boolean) => {
            if (verify) {
                const res: ResponseResult = await unregisterCurrentUser(formData);
                if (res.status === ResponseStatusEnum.OK) {
                    emailVerifyRef.value.clearCountDown();
                    DragonNotice.success("注销成功。");
                    modalVisible.value = false;
                    emits("logout");
                }
            }
        })
    } else if (UnregisterTypeEnum.PHONE === formData.type) {
        phoneVerifyRef.value.validate(async (verify: boolean) => {
            if (verify) {
                const res: ResponseResult = await unregisterCurrentUser(formData);
                if (res.status === ResponseStatusEnum.OK) {
                    phoneVerifyRef.value.clearCountDown();
                    DragonNotice.success("注销成功。");
                    modalVisible.value = false;
                    emits("logout");
                }
            }
        });
    } else {
        DragonNotice.error("注销账号发生错误。");
    }
}


/**
 * 关闭弹框触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
    formData.type = UnregisterTypeEnum.PHONE;
    formData.verifyCode = "";
    submitLoading.value = false;
}

defineExpose({
    /**
     * 打开弹框
     * @param
     * @return
     * @author     :loulan
     * */
    open: () => {
        formData.type = UnregisterTypeEnum.PHONE;
        formData.verifyCode = "";
        submitLoading.value = false;
        modalVisible.value = true;
    }
});

</script>

<style lang="scss" scoped>
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
</style>