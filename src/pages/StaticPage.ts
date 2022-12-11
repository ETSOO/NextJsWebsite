import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { SiteData } from '../dto/site/SiteData';
import { SitePageProps } from '../props/SitePageProps';
import { StaticSite } from '../site/StaticSite';

/**
 * Create page getStaticProps
 * 创建页的 getStaticProps
 * @param site Static site
 * @returns Result
 */
export function StaticPage<T extends SitePageProps>(
    site: StaticSite,
    reader: (
        siteData: SiteData,
        context: GetStaticPropsContext
    ) => Promise<GetStaticPropsResult<T>>
) {
    return async (
        context: GetStaticPropsContext
    ): Promise<GetStaticPropsResult<T>> => {
        // Site data
        const siteData = await site.getSiteData();
        if (siteData == null) {
            console.log('No Site Data');
            return {
                notFound: true
            };
        }

        // Other data
        const other = await reader(siteData, context);

        // Return
        return other;
    };
}
