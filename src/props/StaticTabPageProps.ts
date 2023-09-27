import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteTab } from '../dto/site/SiteTab';
import { SitePageProps } from './SitePageProps';

/**
 * Static tab view page props
 * 静态栏目浏览页面参数
 */
export type StaticTabPageProps = SitePageProps & {
    article?: ArticleEx;
    tab: SiteTab;
};
