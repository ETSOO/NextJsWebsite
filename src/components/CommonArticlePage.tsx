import Head from 'next/head';
import React from 'react';
import {
    CommonPhotosRenderer,
    CommonPhotosRendererProps
} from './CommonPhotosRenderer';
import {
    CommonPageClassNames,
    CommonPageTitleRenderer,
    CommonPageTitleRendererProps,
    CommonPageTitleRightRendererProps
} from './CommonTabPage';
import { StaticArticlePageProps } from '../props/StaticArticlePageProps';
import { SiteUtils } from '../site/SiteUtils';
import { HtmlContent } from './HtmlContent';

/**
 * Common article page content renderer props
 */
export type CommonArticlePageContentRendererProps = StaticArticlePageProps & {
    articleContentClassName: string;
};

/**
 * Common article page props
 */
export type CommonArticlePageProps = StaticArticlePageProps & {
    /**
     * Artical class name
     */
    articleClassName?: string;

    /**
     * Artical content class name
     */
    articleContentClassName?: string;

    /**
     * Artical title class name
     */
    articleTitleClassName?: string;

    /**
     * Content renderer
     */
    contentRenderer?: (
        props: CommonArticlePageContentRendererProps
    ) => React.ReactNode;

    /**
     * Is tab article?
     */
    isTab?: boolean;

    /**
     * Photos renderer
     */
    photosRenderer?: (props: CommonPhotosRendererProps) => React.ReactNode;

    /**
     * Title renderer
     */
    titleRenderer?: (props: CommonPageTitleRendererProps) => React.ReactNode;

    /**
     * Title right part renderer
     */
    titleRightRenderer?: (
        props: CommonPageTitleRightRendererProps
    ) => React.ReactNode;
};

/**
 * Common article page
 * @param props Props
 * @returns Component
 */
export function CommonArticlePage(props: CommonArticlePageProps) {
    // Destruct
    const {
        siteData,
        tab,
        article,
        articleClassName = CommonPageClassNames.articleClassName,
        articleTitleClassName = CommonPageClassNames.articleTitleClassName,
        articleContentClassName = CommonPageClassNames.articleContentClassName,
        photosRenderer = CommonPhotosRenderer,
        titleRightRenderer,
        titleRenderer = CommonPageTitleRenderer,
        contentRenderer = ({ article, articleContentClassName }) => {
            const content = article.content;
            return (
                !SiteUtils.checkNoContent(content) && (
                    <React.Fragment>
                        {article.logo && (
                            <img
                                src={article.logo}
                                className="article-logo float-sm-start img-fluid"
                            />
                        )}
                        <HtmlContent
                            className={articleContentClassName}
                            innerHTML={content}
                        />
                    </React.Fragment>
                )
            );
        },
        isTab
    } = props;

    const description = article.description;
    const keywords = article.keywords;

    return (
        <React.Fragment>
            <Head key={`article-${article.id}`}>
                <title>{`${siteData.site.title} - ${article.title}`}</title>
                {description && (
                    <meta
                        name="description"
                        content={`${siteData.site.description} - ${description}`}
                    />
                )}
                {keywords && (
                    <meta
                        name="keywords"
                        content={`${siteData.site.keywords}, ${keywords}`}
                    />
                )}
                {article.logo && (
                    <meta property="og:image" content={article.logo} />
                )}
            </Head>
            <article className={articleClassName}>
                {titleRenderer({
                    siteData,
                    tab,
                    article,
                    articleTitleClassName,
                    titleRightRenderer,
                    isTab
                })}
                {contentRenderer({
                    siteData,
                    tab,
                    article,
                    articleContentClassName
                })}
                {photosRenderer({
                    photos: article.photos,
                    noContent: SiteUtils.checkNoContent(article.content)
                })}
            </article>
        </React.Fragment>
    );
}
