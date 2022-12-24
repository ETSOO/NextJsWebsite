import { NotificationMessageType } from '@etsoo/notificationbase';
import { ApiDataError, createClient, IApi } from '@etsoo/restclient';
import { DataTypes, IActionResult } from '@etsoo/shared';
import { wxe } from '@etsoo/weixin';
import {
    INotifierContainer,
    NotifierContainer
} from '../notifier/NotifierContainer';
import { SendEmailRQ } from '../rq/site/SendEmailRQ';
import { SiteUtils } from './SiteUtils';

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
     * Notifier
     */
    readonly notifier: INotifierContainer;

    /**
     * Constructor
     * 构造函数
     * @param culture Culture, like en, zh-Hans
     * @param apiUrl Headless CMS API Url
     * @param errorHandler Custom error handler
     */
    constructor(
        public readonly culture: 'en' | 'zh-Hans' | 'zh-Hant' | string,
        apiUrl: string,
        errorHandler?: (e: ApiDataError) => void
    ) {
        // Notifier
        this.notifier = new NotifierContainer();

        // Default error hanlder
        errorHandler ??= (e) =>
            this.notifier.message(
                NotificationMessageType.Danger,
                e.message,
                'API error'
            );

        const api = createClient();
        api.baseUrl = apiUrl;
        api.onError = errorHandler;

        // Add content-language header
        api.setContentLanguage(culture);

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
     * Setup
     * @param resources Custom resources
     */
    setup(resources: DataTypes.StringRecord = {}) {
        // Setup utils
        SiteUtils.setup(this.culture, resources);
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
        try {
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
                    this.getOG('description') ??
                    this.getMeta('description') ??
                    '';

                const imgUrl =
                    this.getOG('image') ??
                    this.getMeta('image_src') ??
                    '/og.jpg';

                share = {
                    title,
                    link,
                    imgUrl,
                    desc
                };
            }

            // Setup share
            wxe.setupShare(share, ckResult.checkResult);
        } catch (e) {
            console.log('WX setup failed with an error', e);
        }
    }
}
