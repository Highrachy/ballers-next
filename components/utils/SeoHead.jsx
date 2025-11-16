import Head from 'next/head';

export default function SeoHead({
  title = 'BALL | Own Your Home in Lagos with Flexible Payment Plans',
  description = 'BALL helps Nigerians become homeowners with flexible payment plans, verified properties and expert guidance. Explore homes for sale in Lagos.',
  canonical = 'https://www.ballers.ng',
  ogImage = 'https://www.ballers.ng/img/pages/ball-refer.png',
  robots = 'index, follow',
  noIndex = false,
  keywords = [
    'buy house in lagos',
    'houses for sale in lekki lagos',
    'lekki houses for sale',
    'affordable houses in lagos',
    'property for sale in nigeria',
    '4 bedroom duplex in lekki',
    'duplex for sale in lekki',
    'property payment plan nigeria',
    'become a landlord nigeria',
    'ball nigeria',
    'cheap houses in lagos',
    'best real estate deals nigeria',
    'ajah houses for sale',
    'real estate investment nigeria',
  ],
}) {
  const keywordContent = keywords.join(', ');

  // --- Schema.org Structured Data ---
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BALL',
    url: canonical,
    logo: 'https://www.ballers.ng/logo.png',
    description,
    sameAs: [
      'https://web.facebook.com/Ballerverse',
      'https://x.com/BALLers_ng',
      'https://www.instagram.com/ballers.africa/',
      'https://www.linkedin.com/company/ballers.africa/',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+234 903 020 0031',
        contactType: 'Customer Support',
        areaServed: 'NG',
        availableLanguage: 'English',
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BALL',
    url: canonical,
    description:
      'BALL helps Nigerians own homes with flexible payment plans, verified properties and digital homeownership tools.',
    potentialAction: {
      '@type': 'SearchAction',
      target:
        'https://www.ballers.ng/properties/search?all={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const realEstateSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'BALL',
    url: canonical,
    image: ogImage,
    description:
      'Trusted homeownership platform providing flexible payment homes, verified listings, and support for becoming a landlord.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Lagos, Nigeria',
    },
  };

  return (
    <Head>
      {/* Language */}
      <meta httpEquiv="Content-Language" content="en" />

      {/* --- Primary Meta --- */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordContent} />
      <link rel="canonical" href={canonical} />

      {/* --- Open Graph --- */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_NG" />

      {/* --- Twitter Meta --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* --- Standard Meta Fixes --- */}
      <meta name="author" content="BALL" />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : robots} />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:updated_time" content={new Date().toISOString()} />

      {/* Favicon */}
      <meta name="theme-color" content="#0F172A" />

      {/* --- JSON-LD Structured Data --- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationSchema,
            websiteSchema,
            realEstateSchema,
          ]),
        }}
      />
    </Head>
  );
}
