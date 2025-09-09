import { coreTool } from "owner-tool-js";
import {EnvEnum} from "../domain/enums";
import QRCode from 'qrcode';


/**
* 生成二维码
* @param   text  二维码内容
* @return  图片的base64编码地址
* @author  :loulan
* */
export const generateQrcodeUrl = (text: string, size: number = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        QRCode.toDataURL(text, {
            // 错误登记
            errorCorrectionLevel: 'H',
            // 外部边框静态区域
            margin: 2,
            // 二维码尺寸
            width: size,
            // 二维码颜色
            color: {
                dark: "#000000FF",
                light: '#ffffff'
            }
        }, (err: Error | null | undefined, url: string) => {
            if (coreTool.isNotEmpty(url)) {
                resolve(url);
            } else {
                // 如果有错误就将错误打印出来
                console.error(err);
                reject(err);
            }
        })
    });
}

/**
 * 获取当前环境的变量值
 * @returns {EnvEnum} 返回当前环境的枚举值，可能是开发环境(DEV)，生产环境(PROD)，或是错误环境(ERROR)
 * @author loulan
 */
export const currentEnvVal = (): EnvEnum => {
    // 根据当前环境模式判断返回对应的枚举值
    if (import.meta.env.MODE == EnvEnum.DEV) {
        return EnvEnum.DEV;
    } else if (import.meta.env.MODE == EnvEnum.PROD) {
        return EnvEnum.PROD;
    } else {
        return EnvEnum.ERROR;
    }
};
