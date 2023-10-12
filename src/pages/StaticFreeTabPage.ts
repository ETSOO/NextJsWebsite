import { GetStaticPropsResult } from 'next';
import { SitePageProps } from '../props/SitePageProps';
import { StaticSite } from '../site/StaticSite';
import { StaticPage } from './StaticPage';

/**
 * Create free tab page getStaticProps
 * 创建自由栏目的 getStaticProps
 * @param site Static site
 * @param revalidate Revalidate setting
 * @returns Result
 */
export function StaticFreeTabPage(
    site: StaticSite,
    revalidate?: number | boolean
) {
    return StaticPage<SitePageProps>(
        site,
        (siteData, _context) =>
            new Promise<GetStaticPropsResult<SitePageProps>>((resolve) =>
                resolve({
                    props: { siteData },
                    revalidate
                })
            )
    );
}
