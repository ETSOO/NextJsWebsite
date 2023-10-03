import React from 'react';
import { CommonTabPageRendererProps } from './CommonTabPage';
import { SiteUtils } from '../site/SiteUtils';

/**
 * Common full list tab page
 * @param props Props
 * @returns Component
 */
export function CommonFullListPage(props: CommonTabPageRendererProps) {
    // Destruct
    const { siteData, tab, articles, noDescription } = props;

    // Layout
    return (
        <React.Fragment>
            {!noDescription && (
                <div className="tab-description-box text-justify">
                    {tab.description}
                </div>
            )}
            <div className="container tab-list">
                {articles.map((article) => (
                    <div className="row" key={article.id}>
                        <div className="col-md-4 tab-list-image">
                            <a
                                href={SiteUtils.formatLink(article)}
                                title={article.title}
                            >
                                <img src={article.logo} className="img-fluid" />
                            </a>
                        </div>
                        <div className="col-md-8 tab-list-container">
                            <div className="tab-list-title">
                                <a href={SiteUtils.formatLink(article)}>
                                    {article.title}
                                </a>
                            </div>
                            <div className="text-justify tab-list-description">
                                {article.description}
                                <a
                                    className="tab-list-more"
                                    href={SiteUtils.formatLink(article)}
                                >
                                    {siteData.resources.find(
                                        (r) => r.id === 'readMoreLabel'
                                    )?.value ?? 'Read More'}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}
