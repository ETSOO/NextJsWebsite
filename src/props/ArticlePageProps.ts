import { ArticleEx } from '../dto/site/ArticleEx';
import { SitePageProps } from './SitePageProps';

/**
 * Article view page props
 * 文章浏览页面参数
 */
export type ArticlePageProps = SitePageProps & {
    article: ArticleEx;
};
