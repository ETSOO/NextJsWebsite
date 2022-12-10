import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { SiteTab } from '../dto/site/SiteTab';
import { ArticlePageProps } from '../props/ArticlePageProps';
import { StaticSite } from '../site/StaticSite';

type TabFilter =
    | ((tab: SiteTab, context: GetStaticPropsContext) => boolean)
    | string
    | true;

/**
 * Create article page getStaticProps
 * 创建文章页的 getStaticProps
 * @param site Static site
 * @param tabFilter Tab filter
 * @returns Result
 */
export function StaticArticlePage(site: StaticSite, tabFilter: TabFilter) {
    return async (
        context: GetStaticPropsContext
    ): Promise<GetStaticPropsResult<ArticlePageProps>> => {
        const siteData = await site.getSiteData();
        if (siteData == null) {
            console.log('No Site Data');
            return {
                notFound: true
            };
        }

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

        const article = await site.getArticle({
            tab: tab.id,
            withContent: true
        });

        if (article == null) {
            console.log(`No Article for Tab ${tab.name} / ${tab.id}`);
            return {
                notFound: true
            };
        }

        // Update keywords and description
        if (article.keywords) siteData.site.keywords = article.keywords;
        if (article.description)
            siteData.site.description = article.description;

        // Default cache one day
        return {
            props: { siteData, article }
        };
    };
}
