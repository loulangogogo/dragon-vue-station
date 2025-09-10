<template>
    <div class="pageTableDiv">
        <el-table :data="data" 
        :size="size" 
        :border="true"
        stripe
        header-cell-class-name="headerCellClassName"
        style="width: 100%">
            <el-table-column v-for="(item, index) in columns" :key="index" 
                :label="item.title"
                :prop="item.dataIndex" 
                :width="item.width"
                :min-width="item.minWidth"
                :fixed="item.fixed"
                :resizable="item.resizable"
                :show-overflow-tooltip="item.tooltip"
                :align="item.align"
                :header-align="item.align">
                <template v-if="item.slotName" #default="{row}">
                    <slot :name="item.slotName" :data="row"></slot>
                </template>
            </el-table-column>
        </el-table>
        <div style="height: 30px;"></div>
        <el-pagination
            :current-page="pagination.current"
            :page-size="pagination.size"
            :page-sizes="pagination.sizeOption"
            :size="size"
            layout="total, prev, pager, next,sizes"
            :total="pagination.total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script lang="ts" setup>
/**
* 表格列数据类
* @param   
* @return  
* @author  :loulan
* */
export interface TableColumnData {
    // 标题
    title?: string;
    // 数据字段
    dataIndex?: string;
    // 宽度
    width?: number;
    // 最小宽度
    minWidth?: number;
    // 是否可拖拽
    resizable?: boolean;
    // 列是否显示 tooltip
    tooltip?: boolean;
    // 列是否固定
    fixed?: "left" | "right";
    // 列对齐方式
    align?: "left" | "center" | "right";
    // 插槽
    slotName?: string;
}

/**
* 分页组件的选项
* @param   
* @return  
* @author  :loulan
* */
export interface Pagination{
    size: number;
    current: number;
    sizeOption: Array<number>;
    total: number;
}


const props = withDefaults(defineProps<{
    // 表单数据
    data?: Array<any>;
    // 表单列
    columns?: Array<TableColumnData>;
    // 大小
    size?: 'default'|'small'|'large',
    // 分页大小
    pagination?: Pagination;
}>(),{
    data: ()=>[],
    columns: ()=>[],
    size: ()=>"default",
    pagination: ()=>{
        return {
            size: 10,
            current: 1,
            sizeOption: [10, 20, 50, 100],
            total: 0,
        }
    }
});


const emits = defineEmits(["page-size-change","page-current-change"]);

/**
 * 分页大小改变
 * @param {number} val - 新的分页大小值
 * @return {void}
 * @author :loulan
 */
const handleSizeChange = (val: number) => {
    emits("page-size-change", val);
};

/**
 * 处理当前页码改变事件
 * @param val 新的页码值
 * @return void
 * @author loulan
 */
const handleCurrentChange = (val: number) => {
    emits("page-current-change", val);
};

</script>

<style lang="scss">
.headerCellClassName {
    background-color: #e1e0e0 !important; 
    color: black;
    font-weight: bolder;
}

.pageTableDiv{
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}
</style>