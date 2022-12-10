import { Article } from './Article';

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
};
