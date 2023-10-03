import React from 'react';
import { CommonTabPageRendererProps } from './CommonTabPage';
import { SiteUtils } from '../site/SiteUtils';

/**
 * Common logo list tab page
 * @param props Props
 * @returns Component
 */
export function CommonLogoListPage(props: CommonTabPageRendererProps) {
    // Destruct
    const { tab, articles, noDescription } = props;

    // Layout
    return (
        <React.Fragment>
            {!noDescription && (
                <div className="tab-description-box text-justify">
                    {tab.description}
                </div>
            )}
            <div className="container tab-list">
                <div className="row">
                    {articles.map((article) => (
                        <div
                            className="col-md-4 col-xxl-3 tab-list-image"
                            key={article.id}
                        >
                            <a
                                href={SiteUtils.formatLink(article)}
                                title={article.title}
                            >
                                <img src={article.logo} className="img-fluid" />
                                <div className="tab-list-title">
                                    {article.title}
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}
