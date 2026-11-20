/**
 * GET /meta-catalog.xml  (rewritten here by next.config.mjs)
 *
 * Product feed for Meta Commerce Manager (Facebook + Instagram catalog).
 * Add this URL in Commerce Manager → Catalog → Data sources → Data feed →
 * "Use a URL" with a daily schedule. Built from data/*.json on each request
 * and CDN-cached for an hour, so price/product edits reach Meta on the next
 * scheduled fetch after a deploy.
 */

import { buildMetaCatalogXml } from '@/lib/metaCatalog';

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'noindex');
  return res.status(200).send(buildMetaCatalogXml());
}
