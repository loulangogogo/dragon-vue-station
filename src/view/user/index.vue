<template>
  <div class="headerDiv">
    <el-input v-model="queryParam.username" style="width: 200px" placeholder="请输入用户名" clearable/>
    <el-input v-model="queryParam.userPhone" style="width: 200px;margin-left: 20px" placeholder="请输入用户手机号码" clearable/>
    <el-button type="primary" style="margin-left: 20px" @click="search">查询</el-button>
    <!-- <el-button type="primary" status="success" style="margin-left: 20px" @click="add">添加</el-button> -->
  </div>
  <div class="bodyDiv">
    <page-table :columns="columns"
             :data="tableData"
             :stripe="true"
             :pagination="{
                total: queryParam.pageTotal,
                sizeOption:[10,20,30,40,50],
                current:queryParam.pageCurrent,
                size: queryParam.pageSize,
              }"
             @page-size-change="pageSizeChange"
             @page-change="pageChange">
      <template #operate="{data}">
        <el-button type="primary" size="small" @click="edit(data)">编辑</el-button>
        <el-button type="danger" status="danger" size="small" style="margin-left: 10px" @click="del(data)">删除
        </el-button>
      </template>
    </page-table>
  </div>
  <div>
    <info ref="infoRef" :station-role-datas="currentStationRoleDatas" @query="search"></info>
  </div>
</template>

<script lang="ts" setup>

import Info from './info.vue';
import pageTable, { type TableColumnData } from "@/common/components/page-table.vue";
import {onMounted, reactive, ref} from "vue";
import {type ResponseResult, ResponseStatusEnum} from "../../common/domain/response";
import {dragonConfirm, DragonNotice} from "../../common/domain/component";
import {getRoleByCurrentStation} from "../../common/api/system/role";
import {deleteCurrentStationUser, pageCurrentStationUserList, stationUserDel} from "../../common/api/system/stationsUser";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

const infoRef = ref();

// 表格数据
const tableData = ref();
// 表格列配置
const columns: Array<TableColumnData> = [
  {
    title: "用户名",
    dataIndex: "username",
    width: 210,
    fixed: "left",
    tooltip: true
  },
  {
    title: "用户手机",
    dataIndex: "userMaskPhone",
    width: 150
  },
  {
    title: "角色名称",
    dataIndex: "stationUserRoleName",
    width: 200
  },
  {
    title: "身份类型",
    dataIndex: "typeName",
    width: 150
  },
  {
    title: "状态",
    dataIndex: "statusName",
    width: 80,
  },
  {
    title: "创建时间",
    dataIndex: "crtTime",
    minWidth: 200
  },
  {
    title: "操作",
    width: 150,
    fixed: "right",
    slotName: "operate"
  },
];

// 查询参数
const initQueryParam = {
  username: undefined,
  userPhone: undefined,
  status: undefined,
  pageCurrent: 1,
  pageSize: 10,
  pageTotal: 0
};
const queryParam = reactive({...initQueryParam})

const loading = ref(true);

// 当前站点的角色数据
const currentStationRoleDatas = ref();

/**
 * 分页查询数据
 * @param
 * @return
 * @author     :loulan
 * */
const pageList = async () => {
  // 查询之前进入加载状态
  loading.value = true;
  const res: ResponseResult = await pageCurrentStationUserList(queryParam);
  if (res.status === ResponseStatusEnum.OK) {
    const data = res.data;
    tableData.value = data.records;
    queryParam.pageTotal = data.total;
  }
  // 查询无论成功与否退出加载状态
  loading.value = false;
}

/**
 * 点击查询按钮的时候
 * @param
 * @return
 * @author     :loulan
 * */
const search = () => {
  queryParam.pageCurrent = 1;
  pageList();
}

/**
 * 当页码发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageChange = (pageCurrent: number) => {
  queryParam.pageCurrent = pageCurrent;
  pageList();
}

/**
 * 当每页的数目发生变化的时候
 * @param
 * @return
 * @author     :loulan
 * */
const pageSizeChange = (pageSize: number) => {
  queryParam.pageSize = pageSize;
  pageList();
}

/**
 * 添加操作
 * @param
 * @return
 * @author     :loulan
 * */
const add = () => {
  infoRef.value.init();
}

/**
 * 编辑操作
 * @param
 * @return
 * @author     :loulan
 * */
const edit = (data: any) => {
  infoRef.value.init(data);
}

/**
 * 执行删除操作
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const del = (data: any) => {
  dragonConfirm({
    title: '确认提示',
    content: '您确认删除这条数据吗？'
  }).then(async () => {
    const res: ResponseResult = await deleteCurrentStationUser(data.userId);
    if (res.status === ResponseStatusEnum.OK) {
      search();
      DragonNotice.success("删除成功");
    }
  })
}

/**
 * 获取站点的橘色数据
 * @param
 * @return
 * @exception
 * @author     :loulan
 * */
const getStationRoles = async () => {
  const res: ResponseResult = await getRoleByCurrentStation();
  if (ResponseStatusEnum.OK == res.status) {
    currentStationRoleDatas.value = res.data;
  }
}

onMounted(() => {
  // 获取站点的角色数据
  getStationRoles();
  // 进行分页查询
    pageList();
});
</script>

<style scoped>
.headerDiv {
  height: v-bind(70 + 'px');
  line-height: 70px;
  padding: 0 5px;
}

.bodyDiv {
  /*70头部div的高度，5是多一个安全距离*/
  height: v-bind(contentHeight-75+ 'px');
}
</style>
