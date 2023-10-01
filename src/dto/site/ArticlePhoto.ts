/**
 * Article photo
 * 文章照片
 */
export type ArticlePhoto = {
    /**
     * URL
     * 路径
     */
    url: string;

    /**
     * Width
     * 宽度
     */
    width: number;

    /**
     * Height
     * 高度
     */
    height: number;

    /**
     * Title
     * 标题
     */
    title?: string;

    /**
     * Description
     * 描述
     */
    description?: string;

    /**
     * Link
     * 链接
     */
    link?: string;
};
