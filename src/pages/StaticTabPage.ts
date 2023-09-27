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
 * @returns Result
 */
export function StaticTabPage(site: StaticSite, tabFilter: TabFilter) {
    return StaticPage<StaticTabPageProps>(site, async (siteData, context) => {
        // Current tab
        let tab: SiteTab | undefined = undefined;
        if (tabFilter === true) {
            const { params = {} } = context;

            // Named as the file name [...param]
            const { param } = params;
            if (Array.isArray(param)) {
                const targetUrl = '/' + param.join('/').toLowerCase();
                tab = siteData.tabs.find(
                    (tab) => tab.url.toLowerCase() === targetUrl
                );
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

        const article =
            tab.layout === TabLayout.Article
                ? await site.getArticle({
                      tab: tab.id,
                      withContent: true
                  })
                : undefined;

        return {
            props: { siteData, article, tab }
        };
    });
}
