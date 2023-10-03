import React from 'react';
import { CommonTabPageRendererProps } from './CommonTabPage';
import { SiteUtils } from '../site/SiteUtils';

/**
 * Common title list tab page
 * @param props Props
 * @returns Component
 */
export function CommonTitleListPage(props: CommonTabPageRendererProps) {
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
                            className="col-md-6 col-xxl-4 tab-list-container"
                            key={article.id}
                        >
                            <div className="tab-list-title">
                                <a href={SiteUtils.formatLink(article)}>
                                    {article.title}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}
