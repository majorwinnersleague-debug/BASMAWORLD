import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.basmaworld.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/hopes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mwl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/mwl/basmateachme`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/mwl/podcast`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/mwl/i-am-positive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/mwl/gaming`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/mwl/vegan-survivors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/gateway`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/basma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/basma/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/basma/lessons`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/basma/artist`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
