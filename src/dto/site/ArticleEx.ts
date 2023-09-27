import { Article } from './Article';
import { ArticlePhoto } from './ArticlePhoto';

/**
 * Article extended
 * 文章扩展
 */
export type ArticleEx = Article & {
    /**
     * Content
     * 内容
     */
    content: string;

    /**
     * Keywords
     * 关键词
     */
    keywords?: string;

    /**
     * Article gallery photos
     * 文章照片库
     */
    photos?: ArticlePhoto[];
};
