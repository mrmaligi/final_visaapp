import { Metadata } from 'next';

interface GenerateSEOMetadataProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  path,
  image = '/og-image.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
}: GenerateSEOMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://visahelper.com';
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    keywords: [
      'Australian visa',
      'immigration',
      'migration',
      'Australia',
      ...keywords,
    ],
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VisaHelper',
    url: 'https://visahelper.com',
    logo: 'https://visahelper.com/logo.png',
    description: 'Simplify your Australian visa journey with expert guidance and community support.',
    sameAs: [
      'https://twitter.com/visahelper',
      'https://facebook.com/visahelper',
      'https://linkedin.com/company/visahelper',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+61-2-9000-0000',
      contactType: 'customer service',
      email: 'support@visahelper.com',
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: { name: string; url?: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    ...(modifiedTime && { dateModified: modifiedTime }),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'VisaHelper',
      logo: {
        '@type': 'ImageObject',
        url: 'https://visahelper.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateLawyerSchema({
  name,
  firm,
  description,
  url,
  image,
  rating,
  reviewCount,
  registrationNumber,
  address,
}: {
  name: string;
  firm: string;
  description: string;
  url: string;
  image: string;
  rating: number;
  reviewCount: number;
  registrationNumber: string;
  address: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: firm,
    description,
    url,
    image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address,
      addressCountry: 'AU',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    },
    employee: {
      '@type': 'Person',
      name,
      jobTitle: 'Immigration Lawyer',
      identifier: registrationNumber,
    },
    serviceType: 'Immigration Law',
    areaServed: 'Australia',
  };
}

export function generateVisaSchema({
  name,
  subclass,
  description,
  url,
  category,
  fee,
}: {
  name: string;
  subclass: string;
  description: string;
  url: string;
  category: string;
  fee?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: `${name} (Subclass ${subclass})`,
    description,
    url,
    category,
    serviceType: 'Visa',
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    ...(fee && {
      offers: {
        '@type': 'Offer',
        price: fee,
        priceCurrency: 'AUD',
      },
    }),
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Department of Home Affairs',
      url: 'https://immi.homeaffairs.gov.au',
    },
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
