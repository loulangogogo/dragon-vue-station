<template>
    <el-dropdown trigger="click" @command="selectOption" class="userDropdown"
        @visible-change="(visible: any) => dropdownStatus = visible">
        <div class="userImg">
            <el-avatar v-if="userInfo?.headerImageFileInfo?.url" class="headerAvatar" shape="circle"
                :src="userInfo?.headerImageFileInfo?.url" />
            <el-avatar v-else class="headerAvatar" shape="circle" icon="User"></el-avatar>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :command="1" icon="User">
                    <template #default>个人中心</template>
                </el-dropdown-item>
                <el-dropdown-item :command="4" icon="Remove">
                    <template #default>注销账号</template>
                </el-dropdown-item>
                <el-dropdown-item :command="3" icon="VideoPause">
                    <template #default>退出登录</template>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>

    <div>
        <unregister-user ref="unregisterUserRef" @logout="logout"></unregister-user>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { dragonConfirm } from '../../../common/domain/component';
import { removeLocalStorageToken } from "../../../common/tool/storageTool";
import { useDragonGlobalStore } from "../../../store";
import UnregisterUser from './unregister-user.vue';

const router = useRouter();
const store = useDragonGlobalStore();
const frameHeaderHeight = computed(() => store.frameHeaderHeight);

// 用户的姓名进行展示
const userInfo = computed(() => store.userInfo);

// 下拉弹框的显示状态
const dropdownStatus = ref();
const unregisterUserRef = ref();

/**
 * 点击选中某个选项
 * @param
 * @return
 * @author     :loulan
 * */
const selectOption = (value: any) => {
    if (value == 1) {
        // 个人信息
        router.push("/user-center")
    } else if (value == 3) {
        // 退出登录
        logout();
    } else if (value == 4) {
        dragonConfirm({
            title: "提示",
            content: "您确定要注销当前账号？",
        }).then(() => {
            unregisterUserRef.value.open();
        })
    }
}

/**
 * 退出登陆
 * @param
 * @return
 * @author     :loulan
 * */
const logout = () => {
    removeLocalStorageToken();
    router.push("/login");
}
</script>

<style scoped>
.userDropdown {
    height: 70%;
    width: 70%;
}

.userImg {
    height: 100%;
    width: 100%;
    cursor: pointer;
}

.headerAvatar {
    background-color: black;
    height: 100%;
    width: 100%;
}
</style>
