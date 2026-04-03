'use client'

import DocsTocActions from '@/components/docs/docs-toc-action'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Heading = {
    id: string
    label: string
    level: number
}

type Props = {
    content: string
    docTitle?: string
}

function parseHeadings(html: string): Heading[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const headings = doc.querySelectorAll('h2, h3')

    return Array.from(headings).map((el) => ({
        id: el.id || '',
        label: el.textContent || '',
        level: parseInt(el.tagName[1])
    }))
}

export default function DocsToc({ content, docTitle }: Props) {
    const [headings, setHeadings] = useState<Heading[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const isClickingRef = useRef(false)
    const indicatorRef = useRef<HTMLDivElement>(null)
    const prevTopRef = useRef<number | null>(null)

    useEffect(() => {
        setHeadings(parseHeadings(content))
    }, [content])

    useEffect(() => {
        if (headings.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (isClickingRef.current) return
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -20% 0px' }
        )

        headings.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [headings])

    useEffect(() => {
        const el = indicatorRef.current
        if (!el) return

        const currentTop = el.getBoundingClientRect().top

        if (prevTopRef.current !== null) {
            const delta = prevTopRef.current - currentTop
            if (delta !== 0) {
                el.style.transform = `translateY(${delta}px)`
                el.style.transition = 'none'
                requestAnimationFrame(() => {
                    el.style.transform = 'translateY(0)'
                    el.style.transition =
                        'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
                })
            }
        }

        prevTopRef.current = currentTop
    }, [activeId])

    const handleClick = (id: string) => {
        setActiveId(id)
        isClickingRef.current = true
        setTimeout(() => {
            isClickingRef.current = false
        }, 1000)
    }

    return (
        <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-28 flex flex-col gap-6">
                <DocsTocActions docTitle={docTitle} />
                {headings.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            On This Page
                        </p>
                        <ul className="space-y-2 border-l border-border">
                            {headings.map((heading) => (
                                <li key={heading.id} className="relative">
                                    {activeId === heading.id && (
                                        <div
                                            ref={indicatorRef}
                                            className="absolute left-0 inset-y-0.5 w-0.5 bg-foreground -ml-px rounded-full"
                                        />
                                    )}
                                    <Link
                                        href={`#${heading.id}`}
                                        title={heading.label}
                                        onClick={() => handleClick(heading.id)}
                                        className={cn(
                                            'block py-1 text-sm transition-colors truncate -ml-px',
                                            heading.level === 3
                                                ? 'pl-4'
                                                : 'pl-3',
                                            activeId === heading.id
                                                ? 'text-foreground font-medium'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {heading.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    )
}
