import { ElNotification, ElMessage, ElMessageBox } from 'element-plus';
import { h } from "vue";
import type { dragonConfirmConfig } from './interfaces';

/**
 * 确认框
 * @param
 * @return
 * @author     :loulan
 * */
export const dragonConfirm = (config: dragonConfirmConfig) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            config.content,
            config.title,
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject(false);
            })
    })
}

/*********************************************************
 ** 通知类型
 ** <br><br>
 ** Date: Created in 2022/9/30 16:46
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export namespace DragonNotice {
    export const success = (msg: string) => {
        ElNotification({
            title: '成功',
            message: msg,
            type: 'success',
        })
    }
    export const error = (msg: string) => {
        ElNotification({
            title: '错误',
            message: msg,
            type: 'error',
        })
    }
    export const warning = (msg: string) => {
        ElNotification({
            title: '警告',
            message: msg,
            type: 'warning',
        })
    }
    export const info = (msg: string) => {
        ElNotification({
            title: '信息',
            message: msg,
            type: 'info',
        })
    }
}

/*********************************************************
 ** 信息提示
 ** <br><br>
 ** Date: Created in 2022/10/2 17:20
 ** @author loulan
 ** @version 0.0.0
 *********************************************************/
export namespace DragonMessage {
    export const success = (msg: string) => {
        ElMessage({
            message: msg,
            type: 'success',
            plain: true,
        })
    }
    export const error = (msg: string) => {
        ElMessage({
            message: msg,
            type: 'error',
            plain: true,
        })
    }
    export const warning = (msg: string) => {
        ElMessage({
            message: msg,
            type: 'warning',
            plain: true,
        })
    }
    export const info = (msg: string) => {
        ElMessage({
            message: msg,
            type: 'info',
            plain: true,
        })
    }
}
