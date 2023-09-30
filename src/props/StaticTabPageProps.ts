import { Article } from '../dto/site/Article';
import { ArticleEx } from '../dto/site/ArticleEx';
import { SiteTab } from '../dto/site/SiteTab';
import { SitePageProps } from './SitePageProps';

/**
 * Static tab view page props
 * 静态栏目浏览页面参数
 */
export type StaticTabPageProps = SitePageProps & {
    /**
     * Tab article
     * 栏目文章
     */
    article: ArticleEx | null;

    /**
     * Articles
     * 栏目下所有文章
     */
    articles: Article[];

    /**
     * Tab data
     * 栏目信息
     */
    tab: SiteTab;
};
