import { getDocNavTree } from '@/lib/docs-api'
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.evocave.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const navTree = await getDocNavTree()
    const urls: MetadataRoute.Sitemap = []

    for (const topic of navTree) {
        // Topic page
        urls.push({
            url: `${BASE_URL}/${topic.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9
        })

        for (const section of topic.sections) {
            // Section page
            urls.push({
                url: `${BASE_URL}/${topic.slug}/${section.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8
            })

            if (section.type === 'flat') {
                for (const doc of section.docs) {
                    if (doc.href !== `/${topic.slug}/${section.slug}`) {
                        urls.push({
                            url: `${BASE_URL}${doc.href}`,
                            lastModified: new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.7
                        })
                    }
                }
            }

            if (section.type === 'industry') {
                for (const industry of section.industries) {
                    urls.push({
                        url: `${BASE_URL}/${topic.slug}/${section.slug}/${industry.slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.8
                    })
                    for (const doc of industry.docs) {
                        urls.push({
                            url: `${BASE_URL}${doc.href}`,
                            lastModified: new Date(),
                            changeFrequency: 'weekly',
                            priority: 0.7
                        })
                    }
                }
            }
        }
    }

    return urls
}
