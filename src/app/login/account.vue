<template>
    <el-form :model="loginData" :rules="formRules" ref="accountFormRef" size="large">
        <el-form-item prop="username">
            <el-input v-model="loginData.username" @keyup.enter="submit" placeholder="用户名/手机/邮箱" clearable />
        </el-form-item>
        <el-form-item prop="password">
            <el-input v-model="loginData.password" @keyup.enter="submit" type="password" placeholder="请输入密码……"
                clearable />
        </el-form-item>
        <el-form-item prop="captchaCode">
            <div class="loginValidateDiv">
                <el-input v-model="loginData.captchaCode" @keyup.enter="submit" placeholder="验证码……" clearable />
                <el-image :src="loginData.captchaUrl" @click="getCaptcha" style="width: 200px;" />
            </div>
        </el-form-item>
    </el-form>
    <div style="margin-top: 35px;width: auto;">
        <el-button type="primary" @click="submit" size="large" style="width: 100%"
            :loading="loginButtonLoading">登录</el-button>
    </div>
</template>

<script lang="ts" setup>

import { onMounted, reactive, ref } from "vue";
import { generatePicCaptcha } from "../../common/api/common";
import { type ResponseResult, ResponseStatusEnum } from "../../common/domain/response";
import { GrantTypeEnum } from "../../common/domain/enums";
import type { FormRules } from "element-plus";


// 事件对象
const emits = defineEmits(['loginSubmit']);

// 表单ref
const accountFormRef: any = ref(null);

// 登录需要的信息
const loginData = reactive({
    username: "",
    password: "",
    grant_type: GrantTypeEnum.PASSWORD,
    captchaUuid: "",
    captchaCode: "",
    captchaUrl: ""
});

// 表单校验规则
const formRules: FormRules = {
    username: [{
        type: "string",
        required: true,
        trigger: ['submit', 'change'],
        message: "用户名不能为空"
    }],
    password: [{
        type: "string",
        required: true,
        trigger: ['submit', 'change'],
        message: "密码不能为空"
    }],
    captchaCode: [{
        type: "string",
        required: true,
        trigger: ['submit', 'change'],
        message: "验证码不能为空"
    }]
}

/**
 * 切换获取验证码图片
 * @param
 * @return
 * @author     :loulan
 * */
const getCaptcha = () => {
    generatePicCaptcha().then((res: ResponseResult) => {
        if (res.status == ResponseStatusEnum.OK) {
            const data = res.data;
            loginData.captchaUrl = data.url;
            loginData.captchaUuid = data.captchaUuid;
        }
    })
}


/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
    accountFormRef.value.validate((validate: boolean) => {
        console.log(validate);
        if (validate) {
            emits('loginSubmit', loginData);
        }
    });
}


/**
 * 生命周期加载方法
 * @param
 * @return
 * @author     :loulan
 * */
onMounted(() => {
    getCaptcha();
})


defineProps({
    // 登录按钮的加载状态
    loginButtonLoading: {
        type: Boolean,
        required: false,
        default: false
    }
})

defineExpose({
    /**
     * 登录错误要执行的操作
     * @param
     * @return
     * @author     :loulan
     * */
    loginError: (res: ResponseResult) => {
        getCaptcha();
    }
})
</script>

<style scoped>
.loginValidateDiv {
    display: flex;
    justify-content: space-between;
}
</style>
