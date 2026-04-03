import { ImageResponse } from 'next/og'
import { getDocNavTree, fetchNavDocByTopicAndSlug } from '@/lib/docs-api'

export const runtime = 'edge'
export const alt = 'Evocave Docs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = {
    params: Promise<{ topic: string; slug: string[] }>
}

export default async function Image({ params }: Props) {
    const { topic, slug = [] } = await params
    const navTree = await getDocNavTree()
    const activeTopic = navTree.find((t) => t.slug === topic)

    let title = 'Evocave Docs'
    let description = 'Official documentation for Evocave'
    let breadcrumb = ''

    if (activeTopic) {
        title = activeTopic.label
        breadcrumb = activeTopic.label

        if (slug.length > 0) {
            const [sectionSlug, industrySlug, docSlug] = slug
            const activeSection = activeTopic.sections.find(
                (s) => s.slug === sectionSlug
            )

            if (activeSection) {
                breadcrumb = `${activeTopic.label} / ${activeSection.label}`

                if (slug.length === 1) {
                    title = activeSection.label
                } else if (slug.length >= 2) {
                    try {
                        const post = await fetchNavDocByTopicAndSlug(
                            activeTopic.id,
                            docSlug ?? industrySlug
                        )
                        if (post) {
                            title = post.title.rendered.replace(/<[^>]+>/g, '')
                            description = post.acf?.description ?? description
                        }
                    } catch {
                        // fallback
                    }
                }
            }
        }
    }

    return new ImageResponse(
        <div
            style={{
                background: '#0f1415',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: '80px',
                fontFamily: 'sans-serif'
            }}
        >
            {/* Grid pattern */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Breadcrumb */}
            {breadcrumb && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '100px',
                        padding: '6px 16px',
                        marginBottom: '24px'
                    }}
                >
                    <span
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '14px'
                        }}
                    >
                        {breadcrumb}
                    </span>
                </div>
            )}

            {/* Title */}
            <div
                style={{
                    fontSize: title.length > 40 ? '48px' : '64px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.1,
                    marginBottom: '24px',
                    maxWidth: '1000px'
                }}
            >
                {title}
            </div>

            {/* Description */}
            <div
                style={{
                    fontSize: '22px',
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: '800px',
                    lineHeight: 1.5
                }}
            >
                {description}
            </div>

            {/* Footer */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '48px',
                    right: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <span
                    style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}
                >
                    docs.evocave.com
                </span>
            </div>
        </div>,
        { ...size }
    )
}
