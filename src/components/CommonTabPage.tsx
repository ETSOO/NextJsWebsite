import Head from 'next/head';
import React from 'react';
import { CommonArticlePage, CommonArticlePageProps } from './CommonArticlePage';
import { CommonContentListPage } from './CommonContentListPage';
import { CommonFullListPage } from './CommonFullListPage';
import { CommonLogoListPage } from './CommonLogoListPage';
import { CommonPhotosRendererProps } from './CommonPhotosRenderer';
import { CommonTitleDescriptionListPage } from './CommonTitleDescriptionListPage';
import { CommonTitleListPage } from './CommonTitleListPage';
import { StaticTabPageProps } from '../props/StaticTabPageProps';
import { SiteUtils } from '../site/SiteUtils';
import { TabLayout } from '../dto/site/TabLayout';

/**
 * Common tab page renderer props
 */
export type CommonTabPageRendererProps = Omit<StaticTabPageProps, 'article'> & {
    /**
     * No description
     */
    noDescription?: boolean;

    /**
     * Photos renderer
     */
    photosRenderer?: (props: CommonPhotosRendererProps) => React.ReactNode;
};

/**
 * Common page class names
 */
export const CommonPageClassNames = {
    articleClassName: 'container py-3 py-lg-5',
    articleTitleClassName: 'article-title',
    articleContentClassName: 'text-break text-justify article-content'
};

/**
 * Common page title renderer props
 */
export type CommonPageTitleRendererProps = Omit<
    StaticTabPageProps,
    'articles'
> & {
    /**
     * Article title class name
     */
    articleTitleClassName: string;

    /**
     * Is tab article?
     */
    isTab?: boolean;

    /**
     * Title right part renderer
     */
    titleRightRenderer?: (
        props: CommonPageTitleRightRendererProps
    ) => React.ReactNode;
};

/**
 * Common page title renderer
 * @param Props
 * @returns
 */
export function CommonPageTitleRenderer({
    siteData,
    tab,
    article,
    articleTitleClassName,
    isTab,
    titleRightRenderer
}: CommonPageTitleRendererProps) {
    // Ancestors
    const ancestors = tab.ancestorTabs?.reverse() ?? [];
    if (!isTab) ancestors.push(tab);

    return (
        <div className="d-flex justify-content-between align-items-end title-container text-uppercase mb-3">
            <div className={articleTitleClassName}>
                <nav>
                    <ol className="breadcrumb">
                        {ancestors.map((a) => (
                            <li className="breadcrumb-item" key={a.id}>
                                <a href={SiteUtils.formatUrl(a)}>{a.name}</a>
                            </li>
                        ))}
                        <li className="breadcrumb-item active">
                            {article ? article.title : tab.name}
                        </li>
                    </ol>
                </nav>
            </div>
            {titleRightRenderer == null
                ? undefined
                : titleRightRenderer({ siteData, tab, article, isTab })}
        </div>
    );
}

/**
 * Common page title right part renderer props
 */
export type CommonPageTitleRightRendererProps = Omit<
    StaticTabPageProps,
    'articles'
> & {
    /**
     * Is tab article?
     */
    isTab?: boolean;
};

/**
 * Common tab page props
 */
export type CommonTabPageProps = StaticTabPageProps & {
    /**
     * Artical class name
     */
    articleClassName?: string;

    /**
     * Artical title class name
     */
    articleTitleClassName?: string;

    /**
     * Article renderer
     */
    articleRenderer?: (props: CommonArticlePageProps) => JSX.Element;

    /**
     * Conent list renderer
     */
    contentListRenderer?: (props: CommonTabPageRendererProps) => JSX.Element;

    /**
     * Full list renderer
     */
    fullListRenderer?: (props: CommonTabPageRendererProps) => JSX.Element;

    /**
     * Logo list renderer
     */
    logoListRenderer?: (props: CommonTabPageRendererProps) => JSX.Element;

    /**
     * Photos renderer
     */
    photosRenderer?: (props: CommonPhotosRendererProps) => React.ReactNode;

    /**
     * Title list renderer
     */
    titleListRenderer?: (props: CommonTabPageRendererProps) => JSX.Element;

    /**
     * Title renderer
     */
    titleRenderer?: (props: CommonPageTitleRendererProps) => JSX.Element;

    /**
     * Title description list renderer
     */
    titleDescriptionListRenderer?: (
        props: CommonTabPageRendererProps
    ) => JSX.Element;

    /**
     * Title right part renderer
     */
    titleRightRenderer?: (
        props: CommonPageTitleRightRendererProps
    ) => JSX.Element;
};

/**
 * Common tab page
 * @param props Props
 * @returns Component
 */
export function CommonTabPage(props: CommonTabPageProps) {
    // Destruct
    const {
        article,
        articles,
        articleClassName = CommonPageClassNames.articleClassName,
        articleTitleClassName = CommonPageClassNames.articleTitleClassName,
        logoListRenderer,
        photosRenderer,
        titleRenderer,
        titleRightRenderer,
        titleDescriptionListRenderer,
        titleListRenderer,
        siteData,
        tab,
        articleRenderer,
        contentListRenderer,
        fullListRenderer
    } = props;

    if (article) {
        const ArticleLayout = articleRenderer ?? CommonArticlePage;
        return (
            <ArticleLayout
                siteData={siteData}
                tab={tab}
                article={article}
                articleClassName={articleClassName}
                articleTitleClassName={articleTitleClassName}
                photosRenderer={photosRenderer}
                titleRenderer={titleRenderer}
                titleRightRenderer={titleRightRenderer}
                isTab={tab.layout === TabLayout.Article}
            />
        );
    }

    const getLayout = () => {
        const layout = tab.layout;

        if (layout === TabLayout.None) {
            return <React.Fragment />;
        }

        if (layout === TabLayout.ContentList) {
            const ConentListLayout =
                contentListRenderer ?? CommonContentListPage;
            return (
                <ConentListLayout
                    siteData={siteData}
                    tab={tab}
                    articles={articles}
                    photosRenderer={photosRenderer}
                />
            );
        }

        if (layout === TabLayout.FullList) {
            const FullListLayout = fullListRenderer ?? CommonFullListPage;
            return (
                <FullListLayout
                    siteData={siteData}
                    tab={tab}
                    articles={articles}
                />
            );
        }

        if (layout === TabLayout.LogoList) {
            const LogoListLayout = logoListRenderer ?? CommonLogoListPage;
            return (
                <LogoListLayout
                    siteData={siteData}
                    tab={tab}
                    articles={articles}
                />
            );
        }

        if (layout === TabLayout.TitleDescriptionList) {
            const TitleDescriptionLayout =
                titleDescriptionListRenderer ?? CommonTitleDescriptionListPage;
            return (
                <TitleDescriptionLayout
                    siteData={siteData}
                    tab={tab}
                    articles={articles}
                />
            );
        }

        if (layout === TabLayout.TitleList) {
            const TitleLayout = titleListRenderer ?? CommonTitleListPage;
            return (
                <TitleLayout
                    siteData={siteData}
                    tab={tab}
                    articles={articles}
                />
            );
        }

        return <h6>Please add one article at least for the tab.</h6>;
    };

    const description = tab.description;

    const TitleLayout = titleRenderer ?? CommonPageTitleRenderer;

    // Layout
    return (
        <React.Fragment>
            <Head key={`tab-${tab.id}`}>
                <title>{`${siteData.site.title} - ${tab.name}`}</title>
                {description && (
                    <meta
                        name="description"
                        content={`${siteData.site.description} - ${description}`}
                    />
                )}
            </Head>
            <article
                className={
                    `tab-${TabLayout[tab.layout].toLowerCase()} ` +
                    articleClassName
                }
            >
                <TitleLayout
                    siteData={siteData}
                    tab={tab}
                    article={null}
                    articleTitleClassName={articleTitleClassName}
                    titleRightRenderer={titleRightRenderer}
                    isTab
                />
                {getLayout()}
            </article>
        </React.Fragment>
    );
}
