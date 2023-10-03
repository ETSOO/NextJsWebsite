import React from 'react';
import { ArticlePhoto } from '../dto/site/ArticlePhoto';

/**
 * Common photos renderer props
 */
export type CommonPhotosRendererProps = {
    /**
     * Photos
     */
    photos?: ArticlePhoto[];

    /**
     * No content
     */
    noContent?: boolean;
};

/**
 * Common photos renderer
 * @param props Props
 */
export function CommonPhotosRenderer(props: CommonPhotosRendererProps) {
    // Destruct
    const { photos, noContent } = props;

    if (photos == null || photos.length < 1) return;

    return (
        <div className={`container et-gallery${noContent ? '' : ' mt-4'}`}>
            <div className="row" data-masonry='{"percentPosition": true }'>
                {photos.map((photo, index) => (
                    <div
                        className="col-sm-12 col-md-4 col-xxl-3 mb-3"
                        key={photo.url}
                    >
                        <a
                            className="lightbox"
                            href={photo.url}
                            key={photo.url}
                            title={photo.title}
                            data-caption={photo.description}
                            data-bs-toggle="tooltip"
                        >
                            <img
                                alt={photo.title || `Photo ${index}`}
                                src={photo.url}
                                width={photo.width}
                                height={photo.height}
                                className="img-fluid"
                            />
                        </a>
                        {photo.title && (
                            <div className="et-gallery-link">
                                <a
                                    href={photo.link ?? '#'}
                                    referrerPolicy="no-referrer"
                                    target="_blank"
                                >
                                    {photo.title}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
