import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://visahelper.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/news',
    '/tracker',
    '/lawyers',
    '/visas',
    '/auth/signin',
    '/auth/signup',
    '/lawyers/signup',
  ];

  // In production, these would be fetched from Supabase
  // For now, we'll use mock data that would be replaced with real data

  // Visa pages - would come from visas table
  const visaRoutes = [
    '/visas/189',
    '/visas/190',
    '/visas/491',
    '/visas/482',
    '/visas/186',
    '/visas/494',
    '/visas/500',
    '/visas/485',
    '/visas/820-801',
    '/visas/309-100',
    '/visas/300',
    '/visas/600',
    '/visas/188',
    '/visas/888',
  ];

  // News articles - would come from news_articles table
  const newsRoutes = [
    '/news/major-changes-skilled-migration',
    '/news/healthcare-priority-processing',
    '/news/student-visa-work-hours',
    '/news/regional-visa-incentives',
    '/news/partner-visa-processing-times',
    '/news/digital-passenger-declaration',
    '/news/occupation-list-updates',
  ];

  // Lawyer profiles - would come from lawyers table
  const lawyerRoutes = [
    '/lawyers/1',
    '/lawyers/2',
    '/lawyers/3',
    '/lawyers/4',
    '/lawyers/5',
    '/lawyers/6',
  ];

  const allRoutes: MetadataRoute.Sitemap = [
    ...staticRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: route === '' ? 1 : 0.8,
    })),
    ...visaRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...newsRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
    ...lawyerRoutes.map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return allRoutes;
}
