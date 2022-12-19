import { createClient, IApi } from '@etsoo/restclient';
import { IActionResult } from '@etsoo/shared';
import { wxe } from '@etsoo/weixin';
import { SendEmailRQ } from '../rq/site/SendEmailRQ';

/**
 * Client site
 */
export class ClientSite {
    /**
     * API
     * 接口调用对象
     */
    readonly api: IApi;

    /**
     * Constructor
     * 构造函数
     * @param apiUrl Headless CMS API Url
     */
    constructor(apiUrl: string) {
        const api = createClient();
        api.baseUrl = apiUrl;
        api.onError = (e) => {
            console.log('API', e);
        };
        this.api = api;
    }

    /**
     * Get document meta content
     * 获取文档 Meta 内容
     * @param name Name
     * @returns content
     */
    getMeta(name: string) {
        return document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
            ?.content;
    }

    /**
     * Get document Open Graph
     * https://ogp.me/
     * 获取文档 Open Graph 内容
     * @param name Name
     * @returns content
     */
    getOG(name: string) {
        return document.querySelector<HTMLMetaElement>(
            `meta[property="og:${name}"]`
        )?.content;
    }

    /**
     * Get Google reCaptcha token
     * @param action Action
     * @param callback Callback
     */
    grecaptcha(action: string, callback: (token: string) => void) {
        if (
            typeof grecaptcha == undefined ||
            typeof globalThis.googleGecaptchaSiteKey == undefined
        ) {
            callback('');
            return;
        }
        grecaptcha.ready(function () {
            grecaptcha
                .execute(globalThis.googleGecaptchaSiteKey, { action: action })
                .then(function (token) {
                    callback(token);
                });
        });
    }

    /**
     * Send email
     * 发送邮件
     * @param rq Request data
     * @param api Function API
     * @returns Result
     */
    async sendEmail(rq: SendEmailRQ, api = 'Public/SendEmail') {
        // Pass the JSON data
        if (typeof rq.data === 'object') rq.data = JSON.stringify(rq.data);

        // API call
        return await this.api.post<IActionResult>(api, rq);
    }

    /**
     * Setup wechat share
     * 设置微信分享
     * @param share Shared data
     * @param api Wechat configuration API
     * @returns Result
     */
    async setupWechat(
        share?: wx.UpdateAppMessageShareDataParams,
        api = 'Public/CreateJsApiSignature'
    ) {
        // Check exists
        if (typeof wx === undefined) return;

        // Load config
        const data = await this.api.put<wx.ConfigBase>(
            api,
            {
                url: location.href
            },
            { showLoading: false }
        );

        if (data == null) return;

        // Apis
        const apis: wx.ApiName[] = [
            'updateAppMessageShareData',
            'onMenuShareAppMessage',
            'updateTimelineShareData',
            'onMenuShareTimeline'
        ];

        // Config
        const result = await wxe.configAsync({
            ...data,
            jsApiList: apis
        });

        if (result != null) {
            console.log('wxe.configAsync', result);
            return;
        }

        // Check
        const ckResult = await wxe.checkJsApiAsync({ jsApiList: apis });

        if (!ckResult.errMsg.endsWith('ok')) {
            console.log('checkJsApiAsync', ckResult.errMsg);
        }

        // Share data
        if (share == null) {
            const title = this.getOG('title') ?? document.title;
            const link = this.getOG('url') ?? location.href;
            const desc =
                this.getOG('description') ?? this.getMeta('description') ?? '';

            const imgUrl =
                this.getOG('image') ?? this.getMeta('image_src') ?? '/og.jpg';

            share = {
                title,
                link,
                imgUrl,
                desc
            };
        }

        // Setup share
        wxe.setupShare(share, ckResult.checkResult);
    }
}
