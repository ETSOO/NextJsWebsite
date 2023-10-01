import { SiteTab } from '../dto/site/SiteTab';
import { TabLayout } from '../dto/site/TabLayout';
import { StaticTabPageProps } from '../props/StaticTabPageProps';
import { StaticSite } from '../site/StaticSite';
import { StaticPage } from './StaticPage';
import { TabFilter } from './TabFilter';

/**
 * Create tab page getStaticProps
 * 创建栏目的 getStaticProps
 * @param site Static site
 * @param tabFilter Tab filter
 * @param maxArticles Max artciles to read
 * @returns Result
 */
export function StaticTabPage(
    site: StaticSite,
    tabFilter: TabFilter,
    maxArticles?: number | ((tab: SiteTab) => number)
) {
    return StaticPage<StaticTabPageProps>(site, async (siteData, context) => {
        // Current tab
        let tab: SiteTab | undefined;
        let articleUrl: string | undefined;
        if (tabFilter === true) {
            const { params = {} } = context;

            // Named as the file name [...param]
            const { param } = params;
            if (Array.isArray(param)) {
                const targetUrl = '/' + param.join('/').toLowerCase();
                tab = siteData.tabs.find(
                    (tab) => tab.url.toLowerCase() === targetUrl
                );

                if (tab == null) {
                    // Local copy
                    const locals = [...param];

                    // Is article?
                    articleUrl = locals.pop();
                    const tabUrl = '/' + locals.join('/').toLowerCase();

                    tab = siteData.tabs.find(
                        (tab) => tab.url.toLowerCase() === tabUrl
                    );
                }
            }

            if (tab == null) {
                // Not found
                console.log(`No Tab Matched with ISR ${param}`);
                return {
                    notFound: true
                };
            }
        } else if (typeof tabFilter === 'string') {
            tabFilter = tabFilter.toLowerCase();
            tab = siteData.tabs.find(
                (tab) =>
                    tab.name.toLowerCase() === tabFilter ||
                    tab.url.toLowerCase() === `/${tabFilter}`
            );

            if (tab == null) {
                // Not found
                console.log(`No Tab Matched with ${tabFilter}`);
                return {
                    notFound: true
                };
            }
        } else {
            const callback = tabFilter;
            tab = siteData.tabs.find((tab) => callback(tab, context));

            // Not found
            console.log(`No Tab Matched with Filter`);
            return {
                notFound: true
            };
        }

        let parent = tab.parent;
        if (parent && tab.ancestorTabs == null) {
            // Avoid duplicate calculation
            tab.ancestorTabs = [];

            do {
                const ancestor = siteData.tabs.find((tab) => tab.id === parent);
                if (ancestor) {
                    tab.ancestorTabs.push(ancestor);
                    parent = ancestor.parent;
                } else {
                    break;
                }
            } while (parent);
        }

        const article =
            tab.layout === TabLayout.Article
                ? (await site.getArticle({
                      tab: tab.id,
                      withContent: true
                  })) ?? null
                : articleUrl
                ? (await site.getArticle({
                      tab: tab.id,
                      url: articleUrl,
                      withContent: true
                  })) ?? null
                : null;

        const articles =
            tab.layout === TabLayout.Article || tab.layout === TabLayout.None
                ? []
                : (await site.getArticles({
                      tab: tab.id,
                      withContent: tab.layout === TabLayout.ContentList,
                      batchSize:
                          typeof maxArticles === 'function'
                              ? maxArticles(tab)
                              : maxArticles
                  })) ?? [];

        return {
            props: { siteData, article, articles, tab }
        };
    });
}
