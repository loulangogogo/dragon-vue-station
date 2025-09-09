<template>
    <div id="loginBackDiv">
        <div id="loginFrameDiv">
            <div class="lgoinHeaderDiv">
                <h1>登&emsp;&emsp;录</h1>
            </div>
            <div class="loginContentDiv">
                <div v-if="currentTabPane === LoginModeEnum.account" class="contentDiv">
                    <login-account ref="loginAccountRef" @loginSubmit="login"
                        :loginButtonLoading="loginButtonLoading"></login-account>
                </div>
                <div v-if="currentTabPane === LoginModeEnum.wechat" class="contentDiv">
                    <login-wechat ref="loginWechatRef" @loginSubmit="login"></login-wechat>
                </div>
                <div v-if="currentTabPane === LoginModeEnum.phone" class="contentDiv">
                    <login-phone ref="loginPhoneRef" @loginSubmit="login"
                        :loginButtonLoading="loginButtonLoading"></login-phone>
                </div>
                <div v-if="currentTabPane === LoginModeEnum.email" @loginSubmit="login" class="contentDiv">
                    <login-email ref="loginEmailRef" @loginSubmit="login"
                        :loginButtonLoading="loginButtonLoading"></login-email>
                </div>
            </div>
            <div class="loginOptionDiv">
                <div class="loginOptionSpanDiv">
                    <hr style="width: 100%;">
                    <span style="white-space:nowrap;">登录选项</span>
                    <hr style="width:100%">
                </div>
                <div class="loginOptionIconDiv">
                    <d-icon-user class="loginOptionicon"
                        :style="{ color: currentTabPane === LoginModeEnum.account ? 'green' : '' }"
                        @click="() => currentTabPane = LoginModeEnum.account" />
                    <d-icon-wechat class="loginOptionicon"
                        :style="{ color: currentTabPane === LoginModeEnum.wechat ? 'green' : '' }"
                        @click="() => currentTabPane = LoginModeEnum.wechat" />
                    <d-icon-phone class="loginOptionicon"
                        :style="{ color: currentTabPane === LoginModeEnum.phone ? 'green' : '' }"
                        @click="() => currentTabPane = LoginModeEnum.phone" />
                    <d-icon-email class="loginOptionicon"
                        :style="{ color: currentTabPane === LoginModeEnum.email ? 'green' : '' }"
                        @click="() => currentTabPane = LoginModeEnum.email" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "../../common/api/login";
import { GrantTypeEnum } from "../../common/domain/enums";
import { type LoginData, LoginModeEnum } from "../../common/domain/login";
import { type ResponseResult, ResponseStatusEnum } from "../../common/domain/response";
import { setLocalStorageToken } from '../../common/tool/storageTool';
import LoginAccount from './account.vue';
import LoginEmail from './email.vue';
import LoginPhone from './phone.vue';
import LoginWechat from './wechat.vue';

const loginAccountRef = ref();
const loginPhoneRef = ref();
const loginEmailRef = ref();

const currentTabPane = ref();
onMounted(() => {
    // 指定刚进入的pane
    currentTabPane.value = LoginModeEnum.account;
})

// 登录按钮的加载状态
const loginButtonLoading = ref(false);

let router = useRouter();

/**
 * 当登录方式发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const loginChange = (key: string | number) => {
    console.error(key);
}

/**
 * 点击登录提交数据
 * @param
 * @return
 * @author     :loulan
 * */
const login = async (loginData: LoginData) => {
    loginButtonLoading.value = true;
    const res: ResponseResult = await getToken(loginData);
    if (res.status == ResponseStatusEnum.OK) {
        setLocalStorageToken(res.data);
        // 将token保存完成之后进行跳转
        router.push({ path: "/", replace: true });
    } else {
        loginButtonLoading.value = false;
        if (GrantTypeEnum.PASSWORD === loginData.grant_type) {
            loginAccountRef.value.loginError(res);
        }
    }
}
</script>

<style scoped lang="scss">
#loginBackDiv {
    background: url('/static/img/loginBK.jpg') no-repeat;
    background-color: #5f5f60;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 100%;
}

#loginFrameDiv {
    width: 280px;
    height: 425px;
    background-color: rgba(190, 190, 190, 0.6);
    border-radius: 10px;
    padding: 30px;
    position: absolute;
    top: 100px;
    right: 200px;

    .contentDiv {
        margin-top: 30px;
    }

    :deep .arco-tabs-nav-tab-list {
        margin: auto;
    }
}

.lgoinHeaderDiv {
    width: 100%;
    display: flex;
    justify-content: center;
}

.loginContentDiv{
    height: 250px;
}

// 底部图标选项
.loginOptionDiv {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .loginOptionSpanDiv {
        padding: 10px;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5f5f60;
    }

    .loginOptionIconDiv {
        width: 100%;
        display: flex;
        justify-content: center;

        .loginOptionicon {
            font-size: 25px;
            margin: 0px 20px;
            cursor: pointer;
        }
    }
}
</style>
