import { NextApiRequest, NextApiResponse } from 'next';

/**
 * On-demand revalidation handler
 * https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * @param req Request
 * @param res Response
 * @returns Result
 */
export function OnDemandHandler(token: string, scheme = 'NextJsToken') {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        // Check for secret to confirm this is a valid request
        if (req.headers['authorization'] !== `${scheme} ${token}`) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Check url
        const url = req.query.url;
        if (url == null || url === '') {
            return res.status(400).json({ message: 'Invalid URL' });
        }

        try {
            // this should be the actual path not a rewritten path
            // e.g. for "/blog/[slug]" this should be "/blog/post-1"
            if (typeof url === 'string') {
                await res.revalidate(decodeURI(url));
            } else {
                await Promise.all(
                    url.map((item) => res.revalidate(decodeURI(item)))
                );
            }

            // Always revalidate home page
            await res.revalidate('/');

            return res.json({ ok: true });
        } catch (err) {
            // If there was an error, Next.js will continue
            // to show the last successfully generated page
            console.log(err);
            return res.status(500).send('Exception when revalidating');
        }
    };
}
