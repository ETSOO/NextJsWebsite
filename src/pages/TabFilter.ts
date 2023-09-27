import { GetStaticPropsContext } from 'next';
import { SiteTab } from '../dto/site/SiteTab';

/**
 * Tab filter
 */
export type TabFilter =
    | ((tab: SiteTab, context: GetStaticPropsContext) => boolean)
    | string
    | true;
