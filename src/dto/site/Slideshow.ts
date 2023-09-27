import { ArticleLink } from './ArticleLink';
import { ArticlePhoto } from './ArticlePhoto';

/**
 * Slideshow article
 * 幻灯片文章
 */
export type Slideshow = ArticleLink & {
    /**
     * Content id
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
     * Slideshow photo
     * 幻灯片照片
     */
    photos: ArticlePhoto[];

    /**
     * Tab name
     * 栏目名称
     */
    tabName: string;
};
