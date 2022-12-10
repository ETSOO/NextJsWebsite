import { GetStaticPathsResult } from 'next';
import { SiteTab } from '../dto/site/SiteTab';
import { StaticSite } from '../site/StaticSite';

type ExcludedUrls = string[] | ((tab: SiteTab) => boolean);

/**
 * Create getStaticPaths
 * @param site Static site
 * @param excludedUrls
 * @returns Result
 */
export function StaticPaths(site: StaticSite, excludedUrls?: ExcludedUrls) {
    excludedUrls ??= ['/', '/contact'];
    return async (): Promise<GetStaticPathsResult> => {
        // Pregenerate main menu items
        const siteData = await site.getSiteData();
        const paths =
            siteData?.tabs
                .filter((tab) =>
                    typeof excludedUrls === 'function'
                        ? excludedUrls(tab)
                        : tab.layout != 1 &&
                          !excludedUrls?.some(
                              (url) =>
                                  url.toLowerCase() === tab.url.toLowerCase()
                          )
                )
                .map((tab) => ({
                    params: { param: tab.url.substring(1).split('/') }
                })) ?? [];

        return {
            paths,
            fallback: 'blocking'
        };
    };
}
