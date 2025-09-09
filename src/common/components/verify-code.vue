<template>
    <el-form ref="formRef" :model="formData" :rules="formRules" size="large">
        <el-form-item v-if="visibleAccount" ref="formAccountRef" :label="labelWidth > 0 ? accountLabel : ''" prop="account"
            :hide-label="labelWidth > 0 ? false : true">
            <el-input v-model="accountModel" :placeholder="'请输入' + (accountLabel ? accountLabel : '……')"
                clearable />
        </el-form-item>
        <el-form-item :label="labelWidth > 0 ? codeLabel : ''" :hide-label="labelWidth > 0 ? false : true" prop="verifyCode">
            <el-input v-model="codeModel"  :placeholder="'请输入' + (codeLabel ? codeLabel : '……')"
               clearable>
                <template #suffix>
                    <span v-if="!isStartCountdown"
                        style="color: blue;cursor: pointer;user-select: none;font-size: 14px;"
                        @click="sendCode">发送验证码</span>
                    <el-countdown v-else :value-style="{ fontSize: '16px', cursor: 'pointer', userSelect: 'none' }"
                        format="ss" :value="countdownValue" @finish="isStartCountdown = false" />
                </template>
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, } from 'vue';

const emit = defineEmits(['sendCode'])

// 定义model，可以参考vue3文档，在3.4.x之后的用法
const accountModel = defineModel<string | undefined>('account', { required: false });
const codeModel = defineModel<string | undefined>('code', { required: true });

// 定义属性
const props = defineProps({
    // 是否显示账号输入框，默认是显示
    visibleAccount: {
        type: Boolean,
        required: false,
        default: true
    },
    // 账号label
    accountLabel: {
        type: String,
        required: false,
        default: ''
    },
    // 验证码label
    codeLabel: {
        type: String,
        required: false,
        default: ''
    },
    // label宽度
    labelWidth: {
        type: Number,
        required: false,
        default: 0
    },
    // 账号正则校验
    accountValidateRegex: {
        type: RegExp,
        required: false,
        default: undefined
    }
})

// 表单ref
const formRef = ref();

// 倒计时数据
const countdownValue = ref(0);
// 是否开始倒计时
const isStartCountdown = ref(countdownValue.value > Date.now());

// 表单数据
const formData = reactive({
    account: accountModel,
    verifyCode: codeModel
})

// 表单校验规则
const formRules = {
    account: [{
        type: "string",
        required: true,
        pattern: props.accountValidateRegex ? props.accountValidateRegex : /.*/,
        trigger: ['submit','change'],
        message: props.accountLabel + "不正确"
    }],
    verifyCode: [{
        type: "string",
        required: true,
        trigger: ['submit','change'],
        message: props.codeLabel + '不能为空',
    }]
}

/**
* 发送验证码
* @param   
* @return  
* @author  :loulan
* */
const sendCode = () => {
    formRef.value.validateField("account", (validate:boolean) => {

        if (validate) {
            // 倒计时100秒，当前时间毫秒值+100秒的毫秒值
            countdownValue.value = Date.now() + 1000 * 100;
            // 开始倒计时
            isStartCountdown.value = true;

            // 触发事件调用发送验证码
            emit('sendCode', accountModel.value);
        }
    });
}

onMounted(() => {

});


defineExpose({
    /**
    * 进行数据校验
    * @param   callback 回调函数
    * @return  
    * @author  :loulan
    * */
    validate: (callback: Function) => {
        formRef.value.validate((validate:boolean) => {
            callback(validate);    
        });
    },

    /**
    * 清除校验
    * @param   
    * @return  
    * @author  :loulan
    * */
    clearValidate: () => {
        formRef.value.clearValidate();
    },

    /**
    * 重置倒计时
    * @param   
    * @return  
    * @author  :loulan
    * */
    resetCountdownValue: () => {
        countdownValue.value = 0;
        isStartCountdown.value = false;
    },
});
</script>

<style scoped lang="scss"></style>