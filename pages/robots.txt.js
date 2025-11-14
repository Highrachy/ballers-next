// pages/robots.txt.js

export async function getServerSideProps({ req, res }) {
  const host = req.headers.host;

  let content;

  if (host.includes('preview.ballers.ng')) {
    // Block EVERYTHING on preview domain
    content = `User-agent: *
Disallow: /`;
  } else {
    // Production robots.txt
    content = `User-agent: *
Allow: /

Sitemap: https://ballers.ng/sitemap.xml`;
  }

  res.setHeader('Content-Type', 'text/plain');
  res.write(content);
  res.end();

  return { props: {} };
}

export default function RobotsTxt() {
  return null;
}
