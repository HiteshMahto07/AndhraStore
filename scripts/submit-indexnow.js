/**
 * scripts/submit-indexnow.js — Andhra Store
 *
 * Submits every URL in public/sitemap-0.xml to IndexNow so Bing (and any other
 * participating engine — Yandex, Seznam, Naver, Yep) picks up new/changed pages
 * within minutes instead of waiting for the next crawl.
 *
 * Requires the key file to already be LIVE at https://andhrastore.com/<key>.txt
 * (i.e. run this only after deploying, not against localhost), since IndexNow
 * verifies ownership by fetching that file over HTTPS.
 *
 * Usage: node scripts/submit-indexnow.js
 *        npm run indexnow
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'andhrastore.com';
const KEY = 'd0c6c4b7444df650e4f25ce9cb142ecf';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap-0.xml');

function getUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

function submit(urlList) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const req = https.request(
    {
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    (res) => {
      console.log(`IndexNow responded: ${res.statusCode} ${res.statusMessage}`);
      res.on('data', () => {});
    }
  );

  req.on('error', (err) => console.error('IndexNow submission failed:', err.message));
  req.write(body);
  req.end();
}

const urls = getUrlsFromSitemap();
console.log(`Submitting ${urls.length} URLs to IndexNow...`);
submit(urls);
