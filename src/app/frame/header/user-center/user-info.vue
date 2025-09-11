<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <el-button type="primary" plain @click="dealUserinfo">编辑</el-button>
      </div>
    </template>
    <div style="padding: 20px;height: 100%;overflow: auto;">
      <el-row style="width:100%;">
        <el-col :span="5">
          <el-avatar shape="circle" @click="dealHeaderImageClick" :size="120" :src="userInfo.headerImageFileInfo?.url">
          </el-avatar>
        </el-col>
        <el-col :span="19">
          <table class="tableContent">
            <tr class="tableContentTr">
              <th><span class="spanContentTitle">用户名：</span></th>
              <td><span class="spanContent">{{ coreTool.isEmpty(userInfo.username) ? "无" : userInfo.username }}</span>
              </td>
            </tr>
            <tr class="tableContentTr">
              <th><span class="spanContentTitle">姓名：</span></th>
              <td><span class="spanContent">{{ coreTool.isEmpty(userInfo.name) ? "无" : userInfo.name }}</span></td>
            </tr>
          </table>
        </el-col>
      </el-row>
    </div>
  </el-card>

  <!--绑定和解绑手机-->
  <el-dialog v-model="modalVisible" title="编辑" width="550px" :close-on-click-modal="false" @close="close">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100" label-suffix="：">
      <el-form-item prop="username" label="用户名" show-colon>
        <span class="spanContent">{{ coreTool.isEmpty(formData.username) ? "无" : formData.username }}</span>
      </el-form-item>
      <el-form-item prop="name" label="姓名" show-colon>
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </template>
  </el-dialog>

  <!-- 头像更换绑定 -->
  <el-dialog v-model="imageModalVisible" title="头像设置" :width="300" :close-on-click-modal="false"
    @close="imageModalClose">
    <div style="display: flex;justify-content: center;align-items: center;height: 270px;">
      <el-upload :show-file-list="false" :before-upload="uploadFileEvent" :file-list="file ? [file] : []"
        class="uploadHeaderImage">
        <div v-if="file && file.url" class="upload-image"
          style="display: flex;justify-content: center;align-items: center;background-size:100% 100%;position: relative;"
          :style="{ backgroundImage: 'url(' + file.url + ')' }">
          <div class="upload-list-picture-mask">
            <el-icon size="40" color="white">
              <EditPen />
            </el-icon>
          </div>
        </div>
        <div v-else class="avatar-uploader-icon">
          <el-icon size="60">
            <Plus />
          </el-icon>
        </div>
      </el-upload>
    </div>
    <template #footer>
      <el-button @click="imageModalVisible = false">取消</el-button>
      <el-button type="primary" @click="submitHearImage" :loading="submitLoading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

// 表单的ref
import { ref } from "vue";
import { useDragonGlobalStore } from "../../../../store";
import { core as coreTool, functionTool } from 'owner-tool-js';
import { currentUserInfoUpdate } from "../../../../common/api/frame";
import { type ResponseResult, ResponseStatusEnum } from "../../../../common/domain/response";
import type { FileInfo, UserInfo } from "../../../../common/domain/common";
import { DragonMessage, DragonNotice } from "../../../../common/domain/component";
import { upload } from "../../../../common/tool/fileTool";
import type { FormRules } from "element-plus";

const store = useDragonGlobalStore();

// 绑定修改数据之后需要重新获取当前用户信息，修改存在store中的当前用户信息
const emits = defineEmits(["reset-user-info"]);

// 用户信息
const { userInfo } = defineProps<{
  userInfo: UserInfo
}>();

// 编辑数据弹框显示变量
const modalVisible = ref(false);

// 图片处理弹框显示变量
const imageModalVisible = ref(false);

// 图片上传是否正常，主要用在进度条的展示上
const imageIsUploadNormal = ref(true);

// 文件数据的初始化值
const fileInitData = {
  id: undefined,
  url: "",
  path: undefined,
  name: undefined,
}
const file = ref();

// 点击确定加载状态按钮
const submitLoading = ref(false);

const formRef = ref();

// 表单要提交的数据对象初始化值
const formInitData = {
  username: undefined,
  name: undefined,
  headerImageFileId: undefined
}

// 用户的信息数据
const formData = ref<any>({});
const formRules: FormRules = {
  name: [{
    required: true,
    message: "姓名不能为空"
  }]
};


/**
 * 文件头像的上传
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const uploadFileEvent = (optionFile: File): Promise<boolean | File> => {
  let tempFile: File | undefined = optionFile;

  if (!tempFile) {
    DragonMessage.warning("上传文件为空");
    return new Promise<boolean>((resolve: any) => resolve(false));
  }

  if (tempFile.size > 1000000) {
    DragonMessage.warning("上传图片不能超过1M");
    return new Promise<boolean>((resolve: any) => resolve(false));
  }

  // 后端上传数据
  upload(optionFile, false).then((resData: any) => {
    file.value.url = resData.url;
    file.value.id = resData.uuid;
  });

  return new Promise<boolean>((resolve: any) => resolve(false));
}


/**
 * 提交修改个人头像
 * @param
 * @return
 * @author     :loulan
 * */
const submitHearImage = async () => {
  if (coreTool.isNotExist(file) || coreTool.isEmpty(file.value?.id)) {
    DragonMessage.warning("头像图片未设置。");
    return;
  }
  submitLoading.value = true;
  formData.value.headerImageFileId = file.value.id;
  const res: ResponseResult = await currentUserInfoUpdate(formData.value);
  if (res.status === ResponseStatusEnum.OK) {
    imageModalVisible.value = false;
    emits("reset-user-info");
    DragonNotice.success("设置成功");
  }
  submitLoading.value = false;
}

/**
 * 提交修改的个人信息
 * @param
 * @return
 * @author     :loulan
 * */
const submit = () => {
  formRef.value.validate(async (validate: boolean) => {
    // 如果没有错误进行提交
    if (validate) {
      submitLoading.value = true;
      const res: ResponseResult = await currentUserInfoUpdate(formData.value);
      if (res.status === ResponseStatusEnum.OK) {
        modalVisible.value = false;
        emits("reset-user-info");
        DragonNotice.success("修改成功");
      }
      submitLoading.value = false;
    }
  })
}

/**
 * 点击编辑按钮触发
 * @param
 * @return
 * @author     :loulan
 * */
const dealUserinfo = () => {
  // 先复制初始化的值
  functionTool.combineObj(formData.value, formInitData);
  // 然后数据对象进行赋值
  const currentUserInfo: UserInfo = store.userInfo;
  formData.value.name = currentUserInfo.name;
  formData.value.username = currentUserInfo.username;
  formData.value.headerImageFileId = undefined;

  modalVisible.value = true;
}

/**
 * 点击头像处理触发方法
 * @param
 * @return
 * @author     :loulan
 * */
const dealHeaderImageClick = () => {
  // 先赋值初始化的值
  functionTool.combineObj(formData.value, formInitData);

  file.value = functionTool.combineObj({}, fileInitData);
  const headerImageFileInfo: FileInfo | undefined = store.userInfo.headerImageFileInfo;
  if (coreTool.isExist(headerImageFileInfo)) {
    file.value.url = headerImageFileInfo?.url;
  }

  imageIsUploadNormal.value = true;
  imageModalVisible.value = true;
}

/**
 * 头像图片弹框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const imageModalClose = () => {
  // 初始化清空
  functionTool.combineObj(formData.value, formInitData);

  //初始化清空
  file.value = functionTool.combineObj({}, fileInitData);

  imageIsUploadNormal.value = true;
}

/**
 * 弹框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  // 初始化清空
  functionTool.combineObj(formData.value, formInitData);
}
</script>

<style scoped lang="less">
.uploadHeaderImage {
  .arco-upload-picture-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 250px;
    height: 250px;
  }

  .upload-image {
    width: 250px;
    height: 250px;
  }

  .upload-list-picture-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明黑色遮罩 */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .upload-image:hover .upload-list-picture-mask {
    opacity: 1;
  }
}

.tableContent {
  margin-left: 30px;

  .tableContentTr {
    height: 50px;
  }
}

/*显示内容的标题*/
.spanContentTitle {
  font-weight: bolder;
  color: black;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/*显示内容样式*/
.spanContent {
  font-weight: bolder;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}

.card-header {
  display: grid;
  justify-content: end;
}
</style>
