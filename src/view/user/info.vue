<template>
  <el-dialog v-model="modalVisible" :title="isAddEdit === AddEditEnum.ADD ? '站点添加' : '站点编辑'" width="550px"
    :close-on-click-modal="false" @close="close">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="130">
      <el-form-item prop="type" label="用户身份">
        <el-radio-group v-model="formData.type">
          <el-radio :value="StationUserTypeEnum.ADMIN">管理员</el-radio>
          <el-radio :value="StationUserTypeEnum.NORMAL">普通员工</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="StationUserTypeEnum.NORMAL === formData.type" rpop="roleId" label="用户权限">
        <el-select v-model="formData.roleId" placeholder="请选择站点用户权限" clearable>
          <el-option v-for="(role, index) in stationRoleDatas" :key="index" :value="role.id"
            :label="role.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="是否启用">
        <el-radio-group v-model="formData.status">
          <el-radio :value="StatusEnum.ON">启用</el-radio>
          <el-radio :value="StatusEnum.OFF">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { core as coreTool, functionTool } from 'owner-tool-js';
import { ref } from "vue";
import { AddEditEnum, StationUserTypeEnum, StatusEnum } from "../../common/domain/enums";
import { type ResponseResult, ResponseStatusEnum } from "../../common/domain/response";
import { DragonMessage, DragonNotice } from "../../common/domain/component";
import { updateCurrentStationUser } from "../../common/api/system/stationsUser";
import type { FormRules } from "element-plus";

const props = defineProps({
  stationRoleDatas: {
    type: Array<any>,
    required: true,
    default: []
  }
});

const emits = defineEmits(["query"]);

// 确定提交按钮的加载状态
const submitLoading = ref(false);

// 当前是添加还是编辑，默认添加
const isAddEdit = ref(AddEditEnum.ADD);

// 表单的ref
const formRef = ref();
// 模态框的显示状态
const modalVisible = ref(false);

// 初始化的表单数据
const initFormData = <{
  userId: number | undefined,
  type: number,
  roleId: number | undefined,
  status: number
}>{
    userId: undefined,
    type: StationUserTypeEnum.NORMAL,
    roleId: undefined,
    status: StatusEnum.OFF,
  };
// 表单数据
const formData = ref({ ...initFormData })
// 表单规则
const formRules: FormRules = {
  userId: [{
    required: true,
    message: "用户不能为空"
  }],
  type: [{
    required: true,
    message: "身份类型不能为空"
  }],
  status: [{
    required: true,
    message: "站点用户状态不能为空"
  }],
};

/**
 * 点击确定按钮
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  submitLoading.value = true;

  if (isAddEdit.value == AddEditEnum.ADD) {
    DragonMessage.error("该功能暂时未开放");
    return;
  }

  formRef.value.validate(async (validate: boolean) => {
    // 如果没有错误进行提交
    if (validate) {
      const res: ResponseResult = await updateCurrentStationUser(formData.value);
      if (res.status === ResponseStatusEnum.OK) {
        DragonNotice.success("操作成功");
        emits("query");
        modalVisible.value = false;
      }
    }
    submitLoading.value = false;
  })
}


/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  // 清除表单提示数据
  formRef.value.clearValidate();
  formData.value = { ...initFormData };
  // 回复默认
  isAddEdit.value = AddEditEnum.ADD;
  // 恢复确定按钮的状态
  submitLoading.value = false;
}


defineExpose({
  init: (data: object) => {
    if (coreTool.isNotExist(data)) {
      // 数据不存在是添加
      isAddEdit.value = AddEditEnum.ADD;
      modalVisible.value = true;
    } else {
      // 数据存在是编辑
      isAddEdit.value = AddEditEnum.EDIT;
      functionTool.combineObj(formData.value, data);
      modalVisible.value = true;
    }
  }
});
</script>

<style scoped></style>
