/**
 * Articles request data
 * 文章列表请求数据
 */
export type ArticlesRQ = {
    /**
     * Ids
     * 编号数组
     */
    ids?: number[];

    /**
     * Tab id
     * 栏目编号
     */
    tab?: number;

    /**
     * Batch size
     * 批量读取数据
     */
    batchSize?: number;

    /**
     * With content
     * 是否返回内容
     */
    withContent?: boolean;

    /**
     * Last release time
     * 上次发布时间
     */
    lastRelease?: Date | string;

    /**
     * Last id
     * 上次编号
     */
    lastId?: number;
};
