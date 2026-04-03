import type {
    DocNavTopic,
    WpDoc,
    WpDocIndustry,
    WpDocSection,
    WpDocTopic
} from '@/types/docs'
import { Redis } from '@upstash/redis'

const BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

const NAV_CACHE_KEY = 'docs:nav-tree'
const NAV_CACHE_TTL = 60 * 60 // 1 jam

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchTopics(): Promise<WpDocTopic[]> {
    const res = await fetch(`${BASE_URL}/doc_topic`, {
        next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error('Failed to fetch topics')
    return res.json()
}

async function fetchSections(): Promise<WpDocSection[]> {
    const res = await fetch(`${BASE_URL}/doc_section`, {
        next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error('Failed to fetch sections')
    return res.json()
}

async function fetchIndustries(): Promise<WpDocIndustry[]> {
    const res = await fetch(`${BASE_URL}/doc_industry`, {
        next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error('Failed to fetch industries')
    return res.json()
}

async function fetchDocs(topicId: number): Promise<WpDoc[]> {
    const res = await fetch(
        `${BASE_URL}/docs?doc_topic=${topicId}&per_page=100&orderby=date&order=asc&_fields=id,slug,title,content,modified,excerpt,doc_topic,doc_section,doc_industry,acf`,
        { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Failed to fetch docs')
    return res.json()
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDocSlug(doc: WpDoc): string {
    return doc.acf?.doc_slug || doc.slug
}

// ─── Fetch doc by topic + slug + type ─────────────────────────────────────────

export async function fetchDocByTopicAndSlug(
    topicId: number,
    docSlug: string,
    docType: 'doc' | 'topic' | 'section' | 'industry'
): Promise<WpDoc | null> {
    const res = await fetch(
        `${BASE_URL}/docs?doc_topic=${topicId}&per_page=100&orderby=date&order=asc&_fields=id,slug,title,content,modified,excerpt,doc_topic,doc_section,doc_industry,acf`,
        { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const docs: WpDoc[] = await res.json()
    return (
        docs.find(
            (d) =>
                (d.acf?.doc_slug === docSlug || d.slug === docSlug) &&
                d.acf?.doc_type === docType
        ) ?? null
    )
}

// ─── Fetch any doc by topic + slug ────────────────────────────────────────────

export async function fetchNavDocByTopicAndSlug(
    topicId: number,
    docSlug: string
): Promise<WpDoc | null> {
    const res = await fetch(
        `${BASE_URL}/docs?doc_topic=${topicId}&per_page=100&orderby=date&order=asc&_fields=id,slug,title,content,modified,excerpt,doc_topic,doc_section,doc_industry,acf`,
        { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const docs: WpDoc[] = await res.json()
    return (
        docs.find((d) => d.acf?.doc_slug === docSlug || d.slug === docSlug) ??
        null
    )
}

// ─── Build nav tree ───────────────────────────────────────────────────────────

async function buildNavTree(): Promise<DocNavTopic[]> {
    const [topics, sections, industries] = await Promise.all([
        fetchTopics(),
        fetchSections(),
        fetchIndustries()
    ])

    const navTree: DocNavTopic[] = await Promise.all(
        topics.map(async (topic) => {
            const docs = await fetchDocs(topic.id)
            const topicIdStr = String(topic.id)

            const navDocs = docs.filter((d) => d.acf?.doc_type === 'doc')
            const sectionPosts = docs.filter(
                (d) => d.acf?.doc_type === 'section'
            )

            const topicSections = sections.filter((s) =>
                s.acf?.related_topics?.includes(topicIdStr)
            )

            const builtSections = topicSections.map((section) => {
                const sectionDocs = navDocs.filter((d) =>
                    d.doc_section.includes(section.id)
                )

                const sectionPost = sectionPosts.find((d) =>
                    d.doc_section.includes(section.id)
                )

                const topicIndustries = industries.filter((ind) =>
                    ind.acf?.related_topics?.includes(topicIdStr)
                )

                const isIndustrySection = [
                    'installation',
                    'changelog',
                    'licenses'
                ].includes(section.slug)

                if (isIndustrySection && topicIndustries.length > 0) {
                    return {
                        type: 'industry' as const,
                        id: section.id,
                        label: section.name,
                        slug: section.slug,
                        description: section.description ?? '',
                        industries: topicIndustries.map((industry) => ({
                            id: industry.id,
                            label: industry.name,
                            slug: industry.slug,
                            description: industry.description ?? '',
                            docs: sectionDocs
                                .filter((d) =>
                                    d.doc_industry.includes(industry.id)
                                )
                                .map((d) => ({
                                    id: d.id,
                                    label: d.title.rendered,
                                    slug: getDocSlug(d),
                                    description: d.acf?.description ?? '',
                                    href: `/${topic.slug}/${section.slug}/${industry.slug}/${getDocSlug(d)}`
                                }))
                        }))
                    }
                }

                if (sectionDocs.length === 0 && sectionPost) {
                    return {
                        type: 'flat' as const,
                        id: section.id,
                        label: section.name,
                        slug: section.slug,
                        description: section.description ?? '',
                        docs: [
                            {
                                id: sectionPost.id,
                                label: sectionPost.title.rendered,
                                slug: getDocSlug(sectionPost),
                                description: sectionPost.acf?.description ?? '',
                                href: `/${topic.slug}/${section.slug}`
                            }
                        ]
                    }
                }

                return {
                    type: 'flat' as const,
                    id: section.id,
                    label: section.name,
                    slug: section.slug,
                    description: section.description ?? '',
                    docs: sectionDocs.map((d) => ({
                        id: d.id,
                        label: d.title.rendered,
                        slug: getDocSlug(d),
                        description: d.acf?.description ?? '',
                        href: `/${topic.slug}/${section.slug}/${getDocSlug(d)}`
                    }))
                }
            })

            return {
                id: topic.id,
                label: topic.name,
                slug: topic.slug,
                count: topic.count,
                description: topic.description ?? '',
                sections: builtSections
            }
        })
    )

    return navTree
}

// ─── Get nav tree with Redis cache ────────────────────────────────────────────

export async function getDocNavTree(): Promise<DocNavTopic[]> {
    try {
        const cached = await redis.get<DocNavTopic[]>(NAV_CACHE_KEY)
        if (cached) return cached
    } catch {
        // Redis error → fallback ke WordPress langsung
    }

    const navTree = await buildNavTree()

    try {
        await redis.set(NAV_CACHE_KEY, navTree, { ex: NAV_CACHE_TTL })
    } catch {
        // Silent fail
    }

    return navTree
}

// ─── Invalidate cache (dipanggil dari /api/revalidate) ────────────────────────

export async function invalidateNavTreeCache(): Promise<void> {
    try {
        await redis.del(NAV_CACHE_KEY)
    } catch {
        // Silent fail
    }
}
