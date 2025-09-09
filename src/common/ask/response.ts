import { type AxiosResponse } from "axios";
import { type ResponseResult, ResponseStatusEnum } from "../domain/response";
import router from "../../router";
import { DragonMessage } from "../domain/component";
import { ElMessageBox } from "element-plus";

export default (response: AxiosResponse) => {
    if (response.status === 200) {
        const res: ResponseResult = response.data;
        const isNoResponseErrorMsg: boolean = response.config?.headers?.isNoResponseErrorMsg;

        if (res.status === ResponseStatusEnum.TOKEN_CHECK_ERROR) {
            //如果是token错误,如果可以的话最好记录错误信息
            ElMessageBox.confirm(
                '您当前登录已经失效，请确认重新登录！',
                '错误提示',
                {
                    confirmButtonText: '确认',
                    type: 'error',
                }).then(() => {
                    router.push("/login")
                })
            return Promise.reject(response);
        } else if (res.status === ResponseStatusEnum.FAIT && !isNoResponseErrorMsg) {
            ElMessageBox.confirm(
                "" + res.msg,
                '提示信息',
                {
                    confirmButtonText: '确认',
                    type: 'info',
                });
        }
        return response.data;
    } else {
        // fixme 2022/9/21(待修改) 可以将错误信息保存到localStorage进行错误数据存储等等、
        DragonMessage.error("请求失败");
        return Promise.reject(response);
    }
}
