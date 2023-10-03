import { SiteResource } from './SiteResource';
import { SiteService } from './SiteService';
import { SiteTab } from './SiteTab';

/**
 * Site data
 * 网站数据
 */
export type SiteData = {
    /**
     * Site data
     */
    site: {
        title: string;
        keywords?: string;
        description?: string;
        apiBaseUrl?: string;
    };

    /**
     * Tab data
     */
    tabs: SiteTab[];

    /**
     * Resource data
     */
    resources: SiteResource[];

    /**
     * Service data
     */
    services: SiteService[];
};
