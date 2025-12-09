// pages/sitemap.xml.js

import { API_ENDPOINT } from '@/utils/URL';
import Axios from 'axios';

const PUBLIC_ROUTES = [
  '/',
  '/a-z-of-ball',
  '/about-us',
  '/ball-vips',
  '/blog',
  '/community',
  '/contact-us',
  '/documentation',
  '/documentation/getting-started',
  '/faqs',
  '/game',
  '/game/are-you-a-baller',
  '/privacy-policy',
  '/properties',
  '/properties/search',
  '/refer-a-baller',
  '/sell-your-property',
  '/services',
  '/terms-of-use',
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

  let dynamicURLs = [];

  try {
    // Fetch properties
    const propertiesRes = await Axios.get(API_ENDPOINT.getAllProperties());
    const propertyLists = propertiesRes?.data?.result || [];
    const propertyUrls = propertyLists.map(({ slug }) => `/properties/${slug}`);

    // Fetch blogs
    const blogsRes = await Axios.get(API_ENDPOINT.getAllBlogs());
    const blogLists = blogsRes?.data?.result || [];
    const blogUrls = blogLists.map(({ slug }) => `/posts/${slug}`);

    dynamicURLs = [...propertyUrls, ...blogUrls];
  } catch (error) {
    console.error('Sitemap: Error fetching properties or blogs', error);
  }

  const urls = [...PUBLIC_ROUTES, ...dynamicURLs];

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
