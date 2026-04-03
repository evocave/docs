'use client'

import { cn } from '@/lib/utils'
import type { DocNavTopic } from '@/types/docs'
import { MoveLeft, MoveRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type DocLink = {
    label: string
    href: string
}

function getAllPages(navTree: DocNavTopic[], topicSlug: string): DocLink[] {
    const topic = navTree.find((t) => t.slug === topicSlug)
    if (!topic) return []

    const pages: DocLink[] = []

    pages.push({ label: topic.label, href: `/${topic.slug}` })

    for (const section of topic.sections) {
        pages.push({
            label: section.label,
            href: `/${topic.slug}/${section.slug}`
        })

        if (section.type === 'flat') {
            for (const doc of section.docs) {
                if (doc.href !== `/${topic.slug}/${section.slug}`) {
                    pages.push({ label: doc.label, href: doc.href })
                }
            }
        }

        if (section.type === 'industry') {
            for (const industry of section.industries) {
                pages.push({
                    label: industry.label,
                    href: `/${topic.slug}/${section.slug}/${industry.slug}`
                })
                for (const doc of industry.docs) {
                    pages.push({ label: doc.label, href: doc.href })
                }
            }
        }
    }

    return pages
}

type Props = {
    navTree: DocNavTopic[]
}

export default function DocsPagination({ navTree }: Props) {
    const pathname = usePathname()
    const topicSlug = pathname.split('/')[1]
    const pages = getAllPages(navTree, topicSlug)

    const currentIndex = pages.findIndex((d) => d.href === pathname)
    const prev = currentIndex > 0 ? pages[currentIndex - 1] : null
    const next =
        currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

    if (!prev && !next) return null

    return (
        <div className="docs-pagination flex lg:flex-row flex-col items-center gap-4 mt-12 border-t border-border pt-8">
            {prev ? (
                <Link
                    href={prev.href}
                    className={cn(
                        'w-full lg:flex-1 flex items-center gap-4 px-5 py-4 rounded-lg border border-border',
                        'hover:bg-secondary/30 transition-colors group justify-between'
                    )}
                >
                    <MoveLeft className="size-4 text-muted-foreground shrink-0 transition-transform group-hover:-translate-x-0.5" />
                    <div className="min-w-0">
                        <p className="text-sm text-muted-foreground mb-0.5 text-right">
                            Previous
                        </p>
                        <p className="text-md font-medium text-foreground truncate text-right">
                            {prev.label}
                        </p>
                    </div>
                </Link>
            ) : (
                <div className="hidden lg:flex lg:flex-1" />
            )}

            {next ? (
                <Link
                    href={next.href}
                    className={cn(
                        'w-full lg:flex-1 flex items-center gap-4 px-5 py-4 rounded-lg border border-border justify-between',
                        'hover:bg-secondary/30 transition-colors group'
                    )}
                >
                    <div className="min-w-0">
                        <p className="text-sm text-muted-foreground mb-0.5">
                            Next
                        </p>
                        <p className="text-md font-medium text-foreground truncate">
                            {next.label}
                        </p>
                    </div>
                    <MoveRight className="size-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
            ) : (
                <div className="hidden lg:flex lg:flex-1" />
            )}
        </div>
    )
}
