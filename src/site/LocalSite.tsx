import Script from 'next/script';
import React from 'react';
import { ArticleLink } from '../dto/site/ArticleLink';
import { SiteData } from '../dto/site/SiteData';
import { SiteTab } from '../dto/site/SiteTab';

/**
 * Local site class
 * 本地站点类
 */
export class LocalSite {
    /**
     * Constructor
     * 构造函数
     * @param data Site data
     */
    constructor(public readonly data: SiteData) {}

    /**
     * Clear title format
     * 清除标题格式
     * @param title Title
     */
    clearTitle(title: string | undefined) {
        if (title == null) return undefined;

        const reg = /\[\[[^\[\]]+\]\]/g;
        const parts = title.split(reg);
        let match: RegExpMatchArray | null;
        let index = 0;
        while ((match = reg.exec(title)) !== null) {
            const part = match[0].slice(2, -2);
            parts.splice(index * 2 + 1, 0, part);
            index++;
        }

        return parts.join('');
    }

    /**
     * Create Bootstrap menu
     * 创建 Bootstrap 菜单
     * @param url Current URL
     * @returns Component
     */
    createBootstrapMenu(url: string) {
        // Top menu items
        const tabs = this.data.tabs;
        const tops = tabs.filter((tab) => tab.parent == null);

        return (
            <React.Fragment>
                {tops.map((t) => {
                    const children = tabs.filter((tab) => tab.parent === t.id);
                    if (children.length === 0) {
                        return (
                            <a
                                href={this.formatUrl(t)}
                                key={t.id}
                                className={
                                    'nav-item nav-link' + this.matchUrl(t, url)
                                }
                            >
                                {t.name}
                            </a>
                        );
                    } else {
                        return (
                            <div className="nav-item dropdown" key={t.id}>
                                <a
                                    href={this.formatUrl(t)}
                                    className={
                                        'nav-link dropdown-toggle' +
                                        this.matchUrl(t, url)
                                    }
                                    data-bs-toggle="dropdown"
                                >
                                    {t.name}
                                </a>
                                <div className="dropdown-menu fade-up m-0">
                                    {children.map((c) => (
                                        <a
                                            href={this.formatUrl(c)}
                                            className={
                                                'dropdown-item' +
                                                this.matchUrl(c, url)
                                            }
                                            key={c.id}
                                        >
                                            {c.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                })}
            </React.Fragment>
        );
    }

    /**
     * Create Google Analytics service
     * @returns Component
     */
    createGAService(): React.ReactNode {
        const ga = this.getService('GA');
        if (ga == null) return;

        return (
            <React.Fragment>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${ga.app}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag() { dataLayer.push(arguments); }
                        gtag('js', new Date());

                        gtag('config', '${ga.app}');
                    `}
                </Script>
            </React.Fragment>
        );
    }

    /**
     * Create Google reCAPTCHA service
     * @returns Component
     */
    createRECAPService(domain: 'G' | 'R' = 'G'): React.ReactNode {
        const api = domain === 'G' ? 'google.com' : 'recaptcha.net';
        const re = this.getService('RECAP');
        const script = re ? (
            <Script
                src={`https://www.${api}/recaptcha/api.js?render=${re.app}`}
                strategy="afterInteractive"
            />
        ) : undefined;

        return (
            <React.Fragment>
                {script}
                <Script id="google-recaptcha" strategy="afterInteractive">
                    {`
                        function googleRecaptcha(action, callback) {
                            if(typeof grecaptcha == undefined) {
                                callback('');
                                return;
                            }

                            grecaptcha.ready(function() {
                                grecaptcha.execute('${re?.app}', {action: action}).then(function(token) {
                                    callback(token);
                                });
                            });
                        }
                    `}
                </Script>
            </React.Fragment>
        );
    }

    /**
     * Create Wechat service
     * @returns Component
     */
    createWXService(): React.ReactNode {
        const ga = this.getService('WX');
        if (ga == null) return;

        return (
            <Script src="/js/jweixin-1.6.0.js" strategy="afterInteractive" />
        );
    }

    /**
     * Format article URL
     * 格式化文章链接
     * @param item Article link item
     * @returns Result
     */
    formatLink(item: ArticleLink) {
        const { url, year, tabLayout, tabUrl } = item;
        if (tabLayout === 0) return tabUrl;
        if (tabLayout === 1) return '#';
        return `${tabUrl}/${year}/${url}`;
    }

    /**
     * Format title
     * 格式化标题
     * @param title Title
     */
    formatTitle(
        title: string | undefined,
        format: (part: string, partIndex: number) => React.ReactNode
    ) {
        if (title == null) return undefined;

        const reg = /\[\[[^\[\]]+\]\]/g;
        const parts: React.ReactNode[] = title.split(reg);
        let match: RegExpMatchArray | null;
        let index = 0;
        while ((match = reg.exec(title)) !== null) {
            const part = format(match[0].slice(2, -2), index);
            parts.splice(index * 2 + 1, 0, part);
            index++;
        }

        return parts;
    }

    /**
     * Format tab URL
     * 格式化栏目地址
     * @param tab Tab
     * @returns Result
     */
    formatUrl(tab: SiteTab) {
        return tab.layout === 1 ? '#' : tab.url;
    }

    /**
     * Get resource
     * 获取资源
     * @param id Resource id
     * @returns Result
     */
    getResource(id: string) {
        return this.data.resources.find((r) => r.id === id)?.value ?? id;
    }

    /**
     * Get service
     * 获取服务
     * @param id Service id
     * @returns Result
     */
    getService(id: 'GA' | 'WX' | 'RECAP') {
        return this.data.services.find((s) => s.id === id);
    }

    /**
     * Get list tab
     * 获取列表栏目
     * @param filter Filter
     * @returns Result
     */
    getListTab(
        filter?: (tab: SiteTab) => boolean
    ): [SiteTab | undefined, SiteTab[]] {
        filter ??= (t) => t.layout === 1;
        const tab = this.data.tabs.find(filter);
        if (tab == null) return [undefined, []];
        const children = this.data.tabs.filter((c) => c.parent === tab.id);
        return [tab, children];
    }

    /**
     * Match tab
     * 匹配栏目
     * @param tab Tab
     * @param url URL
     * @param matchClass Match style clsss name
     * @returns Result
     */
    matchUrl(tab: SiteTab, url: string, matchClass: string = 'active') {
        let matched = false;
        if (tab.parent == null) {
            matched =
                tab.url === url || (tab.url != '/' && url.startsWith(tab.url));
        } else {
            matched = tab.url === url;
        }

        return matched ? ` ${matchClass}` : '';
    }
}
