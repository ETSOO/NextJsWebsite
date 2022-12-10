import { DataTypes } from '@etsoo/shared';

/**
 * Get article request data
 * 获取文章的请求数据
 */
export type ArticleRQ = DataTypes.RequireAtLeastOne<
    {
        /**
         * Article id
         * 文章编号
         */
        id?: number;

        /**
         * Tab id
         * 栏目编号
         */
        tab?: number;

        /**
         * Article URL
         * 文章链接
         */
        url?: string;

        /**
         * With content
         * 是否返回内容
         */
        withContent?: boolean;
    },
    'id' | 'tab' | 'url'
>;
