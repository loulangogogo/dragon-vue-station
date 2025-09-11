<template>
    <download-file></download-file>
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import DownloadFile from './downloadFileComponent.vue';
import { generateFilePageCurrentStationList } from '@/common/api/system/generateFile';
import type { ResponseResult } from '@/common/domain/response';

/**
* 注入生成文件分页查询方法
* @param   
* @return  
* @author  :loulan
* */
provide("pageDownloadFileList", async (param: any): Promise<ResponseResult> => {
  return await generateFilePageCurrentStationList(param);
});
</script>

<style scoped lang="scss">
</style>