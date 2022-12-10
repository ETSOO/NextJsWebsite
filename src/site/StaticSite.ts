import { FetchApi } from '@etsoo/restclient';
import { Article } from '../dto/site/Article';
import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteData } from '../dto/site/SiteData';
import { Slideshow } from '../dto/site/Slideshow';
import { ArticleRQ } from '../rq/site/ArticleRQ';

/**
 * Static Site class
 * 静态网站类
 */
export class StaticSite {
    /**
     * API
     * 接口调用对象
     */
    readonly api: FetchApi;

    /**
     * Constructor
     * 构造函数
     * @param apiUrl Headless CMS API Url
     * @param token Access token
     */
    constructor(apiUrl: string, token: string) {
        const api = new FetchApi();
        api.baseUrl = apiUrl;
        api.authorize('NextStatic', token);
        this.api = api;
    }

    /**
     * Get article
     * 读取文章
     * @param rq Request data
     * @returns Result
     */
    getArticle<
        T extends ArticleRQ,
        D = T extends { withContent: true } ? ArticleEx : Article
    >(rq: T) {
        return this.api.post<D>('/api/Service/GetArticle', rq);
    }

    /**
     * Get slideshow articles
     * 获取幻灯片文章
     * @returns Result
     */
    getSlideshows() {
        return this.api.get<Slideshow[]>('/api/Service/GetSlideshows');
    }

    /**
     * Get site data
     * 获取网站信息
     * @returns Data
     */
    getSiteData() {
        return this.api.get<SiteData>('/api/Service/GetSiteData');
    }

    /**
     * Get tab article
     * 获取栏目文章
     * @param siteData Site data
     * @param tabName Tab name
     * @param tabUrl Tab URL
     * @param withContent Include article content
     * @returns Result
     */
    async getTabArticle<T extends boolean>(
        siteData: SiteData,
        tabName: string,
        tabUrl?: string,
        withContent?: T
    ): Promise<(T extends true ? ArticleEx : Article) | undefined> {
        // Default tab URL
        tabUrl ??= `/${tabName}`;

        // Tab
        const tab = siteData.tabs.find(
            (tab) => tab.name.toLowerCase() === tabName || tab.url === tabUrl
        );
        if (tab == null) return undefined;

        return await this.getArticle({ tab: tab.id, withContent });
    }
}
