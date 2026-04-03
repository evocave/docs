import DocsFeedback from '@/components/docs/docs-feedback'
import DocsPagination from '@/components/docs/docs-pagination'
import DocsToc from '@/components/docs/docs-toc'
import DocsTocActions from '@/components/docs/docs-toc-action'
import DocViewCount from '@/components/docs/docs-view-count'
import DocsArticleTranslator from '@/components/docs/docs-article-translator'
import { addHeadingIds, sanitizeContent } from '@/lib/docs-content'
import {
    getDocNavTree,
    fetchDocByTopicAndSlug,
    fetchNavDocByTopicAndSlug
} from '@/lib/docs-api'
import { notFound } from 'next/navigation'
import DocsBreadcrumb from '@/components/docs/docs-breadcrumb'
import Link from 'next/link'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.evocave.com'
const DEFAULT_DESCRIPTION =
    'Official documentation for Evocave — explore guides, references, and more.'

type Props = {
    params: Promise<{
        topic: string
        slug: string[]
    }>
}

// ─── Generate Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { topic, slug = [] } = await params
    const navTree = await getDocNavTree()
    const activeTopic = navTree.find((t) => t.slug === topic)

    if (!activeTopic) return { title: 'Evocave Docs' }

    // Topic page
    if (slug.length === 0) {
        return {
            title: `${activeTopic.label} — Evocave Docs`,
            description: activeTopic.description || DEFAULT_DESCRIPTION,
            openGraph: {
                title: `${activeTopic.label} — Evocave Docs`,
                description: activeTopic.description || DEFAULT_DESCRIPTION,
                url: `${BASE_URL}/${topic}`,
                siteName: 'Evocave Docs',
                type: 'website'
            },
            twitter: {
                card: 'summary_large_image',
                title: `${activeTopic.label} — Evocave Docs`,
                description: activeTopic.description || DEFAULT_DESCRIPTION
            }
        }
    }

    const [sectionSlug, industrySlug, docSlug] = slug
    const activeSection = activeTopic.sections.find(
        (s) => s.slug === sectionSlug
    )
    if (!activeSection) return { title: 'Evocave Docs' }

    // Section page
    if (slug.length === 1) {
        return {
            title: `${activeSection.label} — ${activeTopic.label} — Evocave Docs`,
            description: activeSection.description || DEFAULT_DESCRIPTION,
            openGraph: {
                title: `${activeSection.label} — Evocave Docs`,
                description: activeSection.description || DEFAULT_DESCRIPTION,
                url: `${BASE_URL}/${topic}/${sectionSlug}`,
                siteName: 'Evocave Docs',
                type: 'website'
            },
            twitter: {
                card: 'summary_large_image',
                title: `${activeSection.label} — Evocave Docs`,
                description: activeSection.description || DEFAULT_DESCRIPTION
            }
        }
    }

    // Doc / industry page
    try {
        const post =
            slug.length === 2 && activeSection.type === 'flat'
                ? await fetchNavDocByTopicAndSlug(activeTopic.id, industrySlug)
                : slug.length === 3
                  ? await fetchNavDocByTopicAndSlug(activeTopic.id, docSlug)
                  : null

        if (post) {
            const title = post.title.rendered.replace(/<[^>]+>/g, '')
            const description = post.acf?.description || DEFAULT_DESCRIPTION
            return {
                title: `${title} — ${activeTopic.label} — Evocave Docs`,
                description,
                openGraph: {
                    title: `${title} — Evocave Docs`,
                    description,
                    url: `${BASE_URL}/${topic}/${slug.join('/')}`,
                    siteName: 'Evocave Docs',
                    type: 'article'
                },
                twitter: {
                    card: 'summary_large_image',
                    title: `${title} — Evocave Docs`,
                    description
                }
            }
        }
    } catch {
        // fallback
    }

    return { title: 'Evocave Docs' }
}

// ─── Reading Time Helper ──────────────────────────────────────────────────────

function getReadingTime(html: string): string {
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    const words = text.split(' ').filter(Boolean).length
    const minutes = Math.ceil(words / 200)
    return `${minutes} min read`
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export async function generateStaticParams() {
    const navTree = await getDocNavTree()
    const params: { topic: string; slug: string[] }[] = []

    for (const topic of navTree) {
        params.push({ topic: topic.slug, slug: [] })

        for (const section of topic.sections) {
            params.push({ topic: topic.slug, slug: [section.slug] })

            if (section.type === 'flat') {
                for (const doc of section.docs) {
                    const parts = doc.href.replace(/^\//, '').split('/')
                    if (parts.length > 2) {
                        params.push({ topic: topic.slug, slug: parts.slice(1) })
                    }
                }
            }

            if (section.type === 'industry') {
                for (const industry of section.industries) {
                    params.push({
                        topic: topic.slug,
                        slug: [section.slug, industry.slug]
                    })
                    for (const doc of industry.docs) {
                        const parts = doc.href.replace(/^\//, '').split('/')
                        params.push({ topic: topic.slug, slug: parts.slice(1) })
                    }
                }
            }
        }
    }

    return params
}

// ─── Page Meta Bar ────────────────────────────────────────────────────────────

function PageMetaBar({
    readingTime,
    modified,
    viewSlug
}: {
    readingTime: string
    modified: string
    viewSlug: string
}) {
    return (
        <p className="text-sm text-muted-foreground mb-5 flex items-center gap-1.5">
            <span>{readingTime}</span>
            <DocViewCount slug={viewSlug} />
            <span>·</span>
            <span>Updated on {formatDate(modified)}</span>
        </p>
    )
}

// ─── Shared Doc Article Layout ────────────────────────────────────────────────

async function DocArticle({
    post,
    breadcrumb,
    processedContent,
    navTree,
    description,
    viewSlug
}: {
    post: {
        title: { rendered: string }
        modified: string
        acf?: { description?: string }
    }
    breadcrumb: { label: string; href?: string }[]
    processedContent: string
    navTree: Awaited<ReturnType<typeof getDocNavTree>>
    description?: string
    viewSlug: string
}) {
    const readingTime = getReadingTime(processedContent)

    return (
        <div className="flex gap-6 lg:gap-12">
            <article className="flex-1 min-w-0 pr-0 lg:pr-16">
                <div className="gap-6 flex flex-col">
                    <DocsBreadcrumb items={breadcrumb} />
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl lg:text-5xl font-bold mt-2 mb-3">
                                {post.title.rendered}
                            </h1>
                            <PageMetaBar
                                readingTime={readingTime}
                                modified={post.modified}
                                viewSlug={viewSlug}
                            />
                        </div>
                        {description && (
                            <p className="text-base text-foreground mb-5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                <hr className="border-border mt-5 pb-5" />
                <DocsArticleTranslator
                    content={processedContent}
                    className="prose prose-neutral dark:prose-invert max-w-none"
                />
                <DocsPagination navTree={navTree} />
                <DocsFeedback />
            </article>
            <DocsToc
                content={processedContent}
                docTitle={post.title.rendered}
            />
        </div>
    )
}

// ─── Shared Overview Layout ───────────────────────────────────────────────────

function OverviewPage({
    title,
    description,
    processedContent,
    breadcrumb,
    cards,
    docTitle,
    navTree,
    showBreadcrumb = true,
    viewSlug,
    modified
}: {
    title: string
    description?: string
    processedContent?: string
    breadcrumb: { label: string; href?: string }[]
    cards: { id: number; label: string; href: string; description?: string }[]
    docTitle?: string
    navTree: Awaited<ReturnType<typeof getDocNavTree>>
    showBreadcrumb?: boolean
    viewSlug?: string
    modified?: string
}) {
    const readingTime = processedContent
        ? getReadingTime(processedContent)
        : null

    return (
        <div className="flex gap-6 lg:gap-12">
            <div className="flex-1 min-w-0 pr-0 lg:pr-16">
                <div className="gap-6 flex flex-col">
                    {showBreadcrumb && <DocsBreadcrumb items={breadcrumb} />}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl lg:text-4xl font-bold mt-2 mb-3">
                            {title}
                        </h1>
                        {viewSlug && modified && readingTime && (
                            <PageMetaBar
                                readingTime={readingTime}
                                modified={modified}
                                viewSlug={viewSlug}
                            />
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground mb-5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {processedContent && (
                    <>
                        <hr className="border-border mt-5 pb-5" />
                        <div
                            className="prose prose-neutral dark:prose-invert max-w-none mb-10"
                            dangerouslySetInnerHTML={{
                                __html: processedContent
                            }}
                        />
                    </>
                )}
                <hr className="border-border mt-5 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <Link
                            key={card.id}
                            href={card.href}
                            className="group flex flex-col gap-1.5 p-5 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                        >
                            <p className="text-md font-semibold text-foreground">
                                {card.label}
                            </p>
                            {card.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {card.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
                <DocsPagination navTree={navTree} />
                <DocsFeedback />
            </div>
            <aside className="hidden xl:block w-56 shrink-0">
                <div className="sticky top-28 flex flex-col gap-6">
                    <DocsTocActions docTitle={docTitle ?? title} />
                </div>
            </aside>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function DocsSlugPage({ params }: Props) {
    const { topic, slug = [] } = await params
    const navTree = await getDocNavTree()
    const activeTopic = navTree.find((t) => t.slug === topic)
    if (!activeTopic) notFound()

    // ── Level 0: topic page — tidak ada meta bar ──────────────────────────────
    if (slug.length === 0) {
        const post = await fetchDocByTopicAndSlug(
            activeTopic.id,
            topic,
            'topic'
        )
        const processedContent = post
            ? addHeadingIds(sanitizeContent(post.content.rendered))
            : ''

        return (
            <OverviewPage
                title={activeTopic.label}
                description={activeTopic.description}
                processedContent={processedContent}
                breadcrumb={[]}
                showBreadcrumb={false}
                docTitle={activeTopic.label}
                navTree={navTree}
                cards={activeTopic.sections.map((s) => ({
                    id: s.id,
                    label: s.label,
                    href: `/${topic}/${s.slug}`,
                    description: s.description
                }))}
            />
        )
    }

    const [sectionSlug, industrySlug, docSlug] = slug
    const activeSection = activeTopic.sections.find(
        (s) => s.slug === sectionSlug
    )
    if (!activeSection) notFound()

    if (slug.length === 1) {
        if (activeSection.type === 'flat' && activeSection.docs.length === 0) {
            const post = await fetchDocByTopicAndSlug(
                activeTopic.id,
                sectionSlug,
                'section'
            )
            const singleDoc = activeSection.docs[0]
            const fallbackPost =
                !post && singleDoc
                    ? await fetchNavDocByTopicAndSlug(
                          activeTopic.id,
                          singleDoc.slug
                      )
                    : null

            const finalPost = post ?? fallbackPost
            if (!finalPost) notFound()

            const processedContent = addHeadingIds(
                sanitizeContent(finalPost.content.rendered)
            )
            return (
                <DocArticle
                    post={finalPost}
                    breadcrumb={[
                        { label: activeTopic.label, href: `/${topic}` },
                        { label: activeSection.label }
                    ]}
                    processedContent={processedContent}
                    navTree={navTree}
                    description={finalPost.acf?.description}
                    viewSlug={`${topic}-${sectionSlug}`}
                />
            )
        }

        if (activeSection.type === 'flat' && activeSection.docs.length > 0) {
            const post = await fetchDocByTopicAndSlug(
                activeTopic.id,
                sectionSlug,
                'section'
            )
            const processedContent = post
                ? addHeadingIds(sanitizeContent(post.content.rendered))
                : ''

            return (
                <OverviewPage
                    title={activeSection.label}
                    description={activeSection.description}
                    processedContent={processedContent}
                    docTitle={activeSection.label}
                    navTree={navTree}
                    viewSlug={`${topic}-${sectionSlug}`}
                    modified={post?.modified}
                    breadcrumb={[
                        { label: activeTopic.label, href: `/${topic}` },
                        { label: activeSection.label }
                    ]}
                    cards={activeSection.docs.map((d) => ({
                        id: d.id,
                        label: d.label,
                        href: d.href,
                        description: d.description
                    }))}
                />
            )
        }

        if (activeSection.type === 'industry') {
            const post = await fetchDocByTopicAndSlug(
                activeTopic.id,
                sectionSlug,
                'section'
            )
            const processedContent = post
                ? addHeadingIds(sanitizeContent(post.content.rendered))
                : ''

            return (
                <OverviewPage
                    title={activeSection.label}
                    description={activeSection.description}
                    processedContent={processedContent}
                    docTitle={activeSection.label}
                    navTree={navTree}
                    viewSlug={`${topic}-${sectionSlug}`}
                    modified={post?.modified}
                    breadcrumb={[
                        { label: activeTopic.label, href: `/${topic}` },
                        { label: activeSection.label }
                    ]}
                    cards={activeSection.industries.map((i) => ({
                        id: i.id,
                        label: i.label,
                        href: `/${topic}/${sectionSlug}/${i.slug}`,
                        description: i.description
                    }))}
                />
            )
        }
    }

    if (slug.length === 2) {
        if (activeSection.type === 'flat') {
            const post = await fetchNavDocByTopicAndSlug(
                activeTopic.id,
                industrySlug
            )
            if (!post) notFound()

            const processedContent = addHeadingIds(
                sanitizeContent(post.content.rendered)
            )
            return (
                <DocArticle
                    post={post}
                    breadcrumb={[
                        { label: activeTopic.label, href: `/${topic}` },
                        {
                            label: activeSection.label,
                            href: `/${topic}/${sectionSlug}`
                        },
                        { label: post.title.rendered }
                    ]}
                    processedContent={processedContent}
                    navTree={navTree}
                    description={post.acf?.description}
                    viewSlug={`${topic}-${sectionSlug}-${industrySlug}`}
                />
            )
        }

        if (activeSection.type === 'industry') {
            const activeIndustry = activeSection.industries.find(
                (i) => i.slug === industrySlug
            )
            if (!activeIndustry) notFound()

            const post = await fetchDocByTopicAndSlug(
                activeTopic.id,
                industrySlug,
                'industry'
            )
            const processedContent = post
                ? addHeadingIds(sanitizeContent(post.content.rendered))
                : ''

            return (
                <OverviewPage
                    title={activeIndustry.label}
                    description={activeIndustry.description}
                    processedContent={processedContent}
                    docTitle={activeIndustry.label}
                    navTree={navTree}
                    viewSlug={`${topic}-${sectionSlug}-${industrySlug}`}
                    modified={post?.modified}
                    breadcrumb={[
                        { label: activeTopic.label, href: `/${topic}` },
                        {
                            label: activeSection.label,
                            href: `/${topic}/${sectionSlug}`
                        },
                        { label: activeIndustry.label }
                    ]}
                    cards={activeIndustry.docs.map((d) => ({
                        id: d.id,
                        label: d.label,
                        href: d.href,
                        description: d.description
                    }))}
                />
            )
        }
    }

    if (slug.length === 3 && activeSection.type === 'industry') {
        const activeIndustry = activeSection.industries.find(
            (i) => i.slug === industrySlug
        )
        if (!activeIndustry) notFound()

        const post = await fetchNavDocByTopicAndSlug(activeTopic.id, docSlug)
        if (!post) notFound()

        const processedContent = addHeadingIds(
            sanitizeContent(post.content.rendered)
        )
        return (
            <DocArticle
                post={post}
                breadcrumb={[
                    { label: activeTopic.label, href: `/${topic}` },
                    {
                        label: activeSection.label,
                        href: `/${topic}/${sectionSlug}`
                    },
                    {
                        label: activeIndustry.label,
                        href: `/${topic}/${sectionSlug}/${industrySlug}`
                    },
                    { label: post.title.rendered }
                ]}
                processedContent={processedContent}
                navTree={navTree}
                description={post.acf?.description}
                viewSlug={`${topic}-${sectionSlug}-${industrySlug}-${docSlug}`}
            />
        )
    }

    notFound()
}
