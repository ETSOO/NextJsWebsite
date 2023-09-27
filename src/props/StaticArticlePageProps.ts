import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteTab } from '../dto/site/SiteTab';
import { SitePageProps } from './SitePageProps';

/**
 * Static article view page props
 * 静态文章浏览页面参数
 */
export type StaticArticlePageProps = SitePageProps & {
    article: ArticleEx;
    tab: SiteTab;
};
