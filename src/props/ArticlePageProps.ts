import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteTab } from '../dto/site/SiteTab';
import { SitePageProps } from './SitePageProps';

/**
 * Article view page props
 * 文章浏览页面参数
 */
export type ArticlePageProps = SitePageProps & {
    article: ArticleEx;
    tab: SiteTab;
};
