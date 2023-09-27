import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteTab } from '../dto/site/SiteTab';
import { SitePageProps } from './SitePageProps';

/**
 * Tab view page props
 * 栏目浏览页面参数
 */
export type TabPageProps = SitePageProps & {
    article?: ArticleEx;
    tab: SiteTab;
};
