import { LocalSite, SiteData } from '../src';

const siteData: SiteData = {
    site: {
        title: 'Test site'
    },
    tabs: [],
    resources: [],
    services: []
};
const site = new LocalSite(siteData);

test('Tests for clearTitle', () => {
    const title = site.clearTitle('We [[care]] about you');
    expect(title).toBe('We care about you');
});
