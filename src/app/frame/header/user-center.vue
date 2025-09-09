<template>
  <el-row style="height: 50%">
    <el-col :span="12" class="card_col">
      <user-data :user-info="userInfo" @reset-user-info="resetUserInfo"></user-data>
    </el-col>
    <el-col :span="12" class="card_col">
      <Password :user-info="userInfo" @reset-user-info="resetUserInfo"></Password>
    </el-col>
  </el-row>
  <el-row style="height: 50%">
    <el-col :span="8" class="card_col">
      <phone :user-info="userInfo" @reset-user-info="resetUserInfo"></phone>
    </el-col>
    <el-col :span="8" class="card_col">
      <email :user-info="userInfo" @reset-user-info="resetUserInfo"></email>
    </el-col>
    <el-col :span="8" class="card_col">
      <wechat :user-info="userInfo" @reset-user-info="resetUserInfo"></wechat>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { functionTool } from "owner-tool-js";
import { ref, watch } from "vue";
import { dragonConfirm } from "../../../common/domain/component";
import { currentUserInfoConfig } from '../../../router/routerMenu';
import { useDragonGlobalStore } from "../../../store";
import Email from './user-center/email.vue';
import Password from "./user-center/password.vue";
import Phone from './user-center/phone.vue';
import UserData from './user-center/user-info.vue';
import Wechat from './user-center/wechat.vue';

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const store = useDragonGlobalStore();
// 同步获取用户信息
const userInfo = ref<any>({});
watch(() => store.userInfo,
  (val) => {
    functionTool.combineObj(userInfo.value, val);
  }, {
  deep: true,
  immediate: true
})

/**
 * 重新设置获取用户信息
 * @param
 * @return
 * @author     :loulan
 * */
const resetUserInfo = async () => {
  try {
    await currentUserInfoConfig();
  } catch (e) {
    dragonConfirm({
      content: "更新用户信息失败，请刷新当前页面。"
    });
  }
}

</script>

<style scoped>
/*包含卡片的col的样式*/
.card_col {
  padding: 10px;
  height: 100%;
}
</style>
