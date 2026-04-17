import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://basmaworld.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/basma/academy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mwl`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hopes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/mwl/i-am-positive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/mwl/basmateachme`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/mwl/podcast`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/mwl/gaming`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/mwl/vegan-survivors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/mwl/hopes-chance`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/vegan-survivors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/basma`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
