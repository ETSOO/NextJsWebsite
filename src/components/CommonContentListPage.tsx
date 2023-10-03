import React from 'react';
import { CommonPhotosRenderer } from './CommonPhotosRenderer';
import { CommonTabPageRendererProps } from './CommonTabPage';
import { ArticlePhoto } from '../dto/site/ArticlePhoto';
import { ArticleEx } from '../dto/site/ArticleEx';
import { HtmlContent } from './HtmlContent';

/**
 * Common content list tab page
 * @param props Props
 * @returns Component
 */
export function CommonContentListPage(props: CommonTabPageRendererProps) {
    // Destruct
    const {
        tab,
        articles,
        noDescription,
        photosRenderer = CommonPhotosRenderer
    } = props;

    const photos: ArticlePhoto[] = [];

    // Layout
    return (
        <React.Fragment>
            {!noDescription && (
                <div className="tab-description-box text-justify">
                    {tab.description}
                </div>
            )}
            <div className="container tab-list">
                {articles.map((raw) => {
                    // Type assertion
                    // Data loaded with StaticTabPage
                    // withContent: tab.layout === TabLayout.ContentList
                    const article = raw as ArticleEx;

                    if (article.photos) photos.push(...article.photos);

                    return (
                        <div className="row" key={article.id}>
                            <div className="col-md-4 tab-list-image">
                                <img src={article.logo} className="img-fluid" />
                            </div>
                            <div className="col-md-8 tab-list-container">
                                <div className="tab-list-title-nolink">
                                    {article.title}
                                </div>
                                <div className="text-justify tab-list-description">
                                    <HtmlContent innerHTML={article.content} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {photosRenderer({ photos, noContent: false })}
        </React.Fragment>
    );
}
