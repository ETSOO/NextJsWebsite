import { ArticleLink } from './ArticleLink';

/**
 * Article
 * 文章
 */
export type Article = ArticleLink & {
    /**
     * Article id
     * 文章编号
     */
    id: number;

    /**
     * Title
     * 标题
     */
    title: string;

    /**
     * Subtitle
     * 副标题
     */
    subtitle?: string;

    /**
     * Description
     * 描述
     */
    description?: string;

    /**
     * Logo
     * 图标
     */
    logo?: string;

    /**
     * Release date
     * 发布时间
     */
    release: Date | string;

    /**
     * Tab name
     * 栏目名称
     */
    tabName: string;

    /**
     * JSON data
     * JSON 数据
     */
    jsonData?: string;
};
