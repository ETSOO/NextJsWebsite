import { TabLayout } from './TabLayout';

/**
 * Site tab
 * 网站栏目
 */
export type SiteTab = {
    /**
     * Tab id
     * 栏目编号
     */
    id: number;

    /**
     * Parent tab id
     * 父栏目编号
     */
    parent?: number;

    /**
     * Tab name
     * 栏目名称
     */
    name: string;

    /**
     * Description
     * 描述
     */
    description?: string;

    /**
     * Tab logo
     * 栏目照片
     */
    logo?: string;

    /**
     * Icon
     * 图标
     */
    icon?: string;

    /**
     * Layout
     * 布局
     */
    layout: TabLayout;

    /**
     * Tab URL
     * 栏目地址
     */
    url: string;
};
