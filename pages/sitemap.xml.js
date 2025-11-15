// pages/sitemap.xml.js

import { API_ENDPOINT } from '@/utils/URL';
import Axios from 'axios';

const PUBLIC_ROUTES = [
  '/',
  '/about-us',
  '/contact-us',
  '/a-z-of-ball',
  '/faqs',
  '/privacy-policy',
  '/terms-of-use',
  '/refer-a-baller',
  '/sell-your-property',
  '/confirm-eligibility',
  '/ball-vips',
  '/docs',
  '/docs/getting-started',
  '/services',
  '/properties',
  '/properties/search',
  '/game',
  '/game/are-you-a-baller',
];

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;

  // ❌ Return empty sitemap for preview site
  if (host.includes('preview.ballers.ng')) {
    res.setHeader('Content-Type', 'text/xml');
    res.write(
      `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
    );
    res.end();
    return { props: {} };
  }

  // Production sitemap starts here
  const baseUrl = 'https://www.ballers.ng';

  let dynamicProperties = [];

  try {
    const propertiesRes = await Axios.get(API_ENDPOINT.getAllProperties());
    const propertyLists = propertiesRes?.data?.result || [];

    dynamicProperties = propertyLists.map(({ slug }) => `/properties/${slug}`);
  } catch (error) {
    console.error('Sitemap: Error fetching properties', error);
  }

  const urls = [...PUBLIC_ROUTES, ...dynamicProperties];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => {
        return `
          <url>
            <loc>${baseUrl}${url}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
      })
      .join('')}
  </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
