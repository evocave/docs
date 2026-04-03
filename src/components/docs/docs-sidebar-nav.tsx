'use client'

import { cn } from '@/lib/utils'
import type { DocNavTopic } from '@/types/docs'
import {
    ChevronRight,
    ChevronsUpDown,
    FolderClosed,
    FolderOpen
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type Props = {
    navTree: DocNavTopic[]
}

// ─── Helper: get active path parts ───────────────────────────────────────────

function useActiveParts() {
    const pathname = usePathname()
    const parts = pathname.split('/').filter(Boolean)
    return {
        topicSlug: parts[0] ?? null,
        sectionSlug: parts[1] ?? null,
        industrySlug: parts[2] ?? null,
        docSlug: parts[3] ?? null,
        pathname
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DocsSidebarNav({ navTree }: Props) {
    const { topicSlug, sectionSlug, industrySlug, pathname } = useActiveParts()
    const activeTopic = navTree.find((t) => t.slug === topicSlug) ?? navTree[0]

    // Accordion: hanya 1 section terbuka
    const [openSection, setOpenSection] = useState<string | null>(
        sectionSlug ?? null
    )
    // Accordion: hanya 1 industry terbuka per section
    const [openIndustry, setOpenIndustry] = useState<string | null>(
        industrySlug ?? null
    )

    // Reset state ketika topic berubah
    useEffect(() => {
        setOpenSection(sectionSlug ?? null)
        setOpenIndustry(industrySlug ?? null)
    }, [topicSlug, sectionSlug, industrySlug])

    const handleSectionClick = (slug: string) => {
        setOpenSection(slug)
        // Reset industry kalau buka section baru
        if (slug !== openSection) setOpenIndustry(null)
    }

    const handleSectionToggle = (slug: string) => {
        setOpenSection((prev) => (prev === slug ? null : slug))
        setOpenIndustry(null)
    }

    const handleIndustryClick = (slug: string) => {
        setOpenIndustry(slug)
    }

    const handleIndustryToggle = (slug: string) => {
        setOpenIndustry((prev) => (prev === slug ? null : slug))
    }

    const indicatorRef = useRef<HTMLDivElement>(null)
    const prevTopRef = useRef<number | null>(null)

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
    }, [pathname])

    if (!activeTopic) return null

    return (
        <nav className="relative flex-1 overflow-y-auto hide-scrollbar">
            <ul className="space-y-1 pb-6">
                {activeTopic.sections.map((section) => {
                    const sectionHref = `/${activeTopic.slug}/${section.slug}`
                    const isSectionOpen = openSection === section.slug
                    const isSectionActive = pathname.startsWith(sectionHref)

                    // ── Flat section ──────────────────────────────────────────
                    if (section.type === 'flat') {
                        const hasDocs = section.docs.length > 0

                        if (!hasDocs) {
                            return (
                                <li key={section.id}>
                                    <span className="flex w-full items-center px-4 lg:px-2 py-1 text-sm font-medium text-muted-foreground/50 cursor-default">
                                        {section.label}
                                    </span>
                                </li>
                            )
                        }

                        // Single doc → langsung link ke section page
                        if (section.docs.length === 1) {
                            return (
                                <li key={section.id}>
                                    <Link
                                        href={sectionHref}
                                        className={cn(
                                            'flex w-full items-center px-4 lg:px-2 py-1 text-sm font-medium transition-colors',
                                            isSectionActive
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {section.label}
                                    </Link>
                                </li>
                            )
                        }

                        // Multi doc → section label + chevron toggle
                        return (
                            <li key={section.id}>
                                <div className="flex w-full items-center justify-between">
                                    <Link
                                        href={sectionHref}
                                        onClick={() =>
                                            handleSectionClick(section.slug)
                                        }
                                        className={cn(
                                            'flex-1 px-4 lg:px-2 py-1 text-sm font-medium transition-colors',
                                            isSectionActive
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {section.label}
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleSectionToggle(section.slug)
                                        }
                                        className="px-2 py-1"
                                    >
                                        <ChevronRight
                                            className={cn(
                                                'size-4 transition-transform duration-200 text-muted-foreground',
                                                isSectionOpen
                                                    ? 'rotate-90'
                                                    : 'rotate-0'
                                            )}
                                        />
                                    </button>
                                </div>

                                {isSectionOpen && (
                                    <ul className="mt-1 space-y-0.5">
                                        {section.docs.map((doc) => {
                                            const isDocActive =
                                                pathname === doc.href
                                            return (
                                                <li key={doc.id}>
                                                    <Link
                                                        href={doc.href}
                                                        className={cn(
                                                            'block pl-4 py-1.5 text-sm transition-colors',
                                                            isDocActive
                                                                ? 'text-foreground font-semibold'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        )}
                                                    >
                                                        {doc.label}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </li>
                        )
                    }

                    // ── Industry section ──────────────────────────────────────
                    if (section.type === 'industry') {
                        const hasIndustries = section.industries.length > 0

                        if (!hasIndustries) {
                            return (
                                <li key={section.id}>
                                    <span className="flex w-full items-center px-4 lg:px-2 py-1 text-sm font-medium text-muted-foreground/50 cursor-default">
                                        {section.label}
                                    </span>
                                </li>
                            )
                        }

                        return (
                            <li key={section.id}>
                                <div className="flex w-full items-center justify-between">
                                    <Link
                                        href={sectionHref}
                                        onClick={() =>
                                            handleSectionClick(section.slug)
                                        }
                                        className={cn(
                                            'flex-1 px-4 lg:px-2 py-1 text-sm font-medium transition-colors',
                                            isSectionActive
                                                ? 'text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {section.label}
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleSectionToggle(section.slug)
                                        }
                                        className="px-2 py-1"
                                    >
                                        <ChevronsUpDown
                                            className={cn(
                                                'size-4 transition-transform duration-200 text-muted-foreground',
                                                isSectionActive
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            )}
                                        />
                                    </button>
                                </div>

                                {isSectionOpen && (
                                    <ul className="mt-1 space-y-0.5 px-4 lg:px-2">
                                        {section.industries.map((industry) => {
                                            const industryHref = `/${activeTopic.slug}/${section.slug}/${industry.slug}`
                                            const isIndustryOpen =
                                                openIndustry === industry.slug
                                            const isIndustryActive =
                                                pathname.startsWith(
                                                    industryHref
                                                )
                                            const isDocActive =
                                                industry.docs.some(
                                                    (d) => pathname === d.href
                                                )

                                            return (
                                                <li key={industry.id}>
                                                    <div className="flex w-full items-center gap-2">
                                                        <Link
                                                            href={industryHref}
                                                            onClick={() =>
                                                                handleIndustryClick(
                                                                    industry.slug
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex flex-1 items-center gap-2 py-1.5 text-sm transition-colors rounded-sm',
                                                                isDocActive ||
                                                                    isIndustryActive
                                                                    ? 'text-foreground font-semibold'
                                                                    : 'text-muted-foreground hover:text-foreground font-medium'
                                                            )}
                                                        >
                                                            {isIndustryOpen ? (
                                                                <FolderOpen
                                                                    className={cn(
                                                                        'size-4 shrink-0',
                                                                        isDocActive ||
                                                                            isIndustryActive
                                                                            ? 'text-foreground'
                                                                            : 'text-muted-foreground'
                                                                    )}
                                                                />
                                                            ) : (
                                                                <FolderClosed
                                                                    className={cn(
                                                                        'size-4 shrink-0',
                                                                        isDocActive ||
                                                                            isIndustryActive
                                                                            ? 'text-foreground'
                                                                            : 'text-muted-foreground'
                                                                    )}
                                                                />
                                                            )}
                                                            <span className="truncate">
                                                                {industry.label}
                                                            </span>
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleIndustryToggle(
                                                                    industry.slug
                                                                )
                                                            }
                                                            className="shrink-0"
                                                        >
                                                            <ChevronRight
                                                                className={cn(
                                                                    'size-4 transition-transform duration-200',
                                                                    isIndustryOpen
                                                                        ? 'rotate-90'
                                                                        : 'rotate-0',
                                                                    isDocActive ||
                                                                        isIndustryActive
                                                                        ? 'text-foreground'
                                                                        : 'text-muted-foreground'
                                                                )}
                                                            />
                                                        </button>
                                                    </div>

                                                    {isIndustryOpen &&
                                                        industry.docs.length >
                                                            0 && (
                                                            <ul className="ml-4 space-y-0.5 mt-0.5 relative">
                                                                <div className="absolute left-px top-1.5 bottom-1.5 w-px bg-border" />
                                                                {industry.docs.map(
                                                                    (doc) => {
                                                                        const isActive =
                                                                            pathname ===
                                                                            doc.href
                                                                        return (
                                                                            <li
                                                                                key={
                                                                                    doc.id
                                                                                }
                                                                                className="relative"
                                                                            >
                                                                                {isActive && (
                                                                                    <div
                                                                                        ref={
                                                                                            indicatorRef
                                                                                        }
                                                                                        className="absolute left-px inset-y-1.5 w-0.5 bg-foreground -ml-px rounded-full"
                                                                                    />
                                                                                )}
                                                                                <Link
                                                                                    href={
                                                                                        doc.href
                                                                                    }
                                                                                    className={cn(
                                                                                        'block pl-3 py-1.5 text-sm transition-colors',
                                                                                        isActive
                                                                                            ? 'text-foreground font-semibold'
                                                                                            : 'text-muted-foreground hover:text-foreground'
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        doc.label
                                                                                    }
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    }
                                                                )}
                                                            </ul>
                                                        )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </li>
                        )
                    }

                    return null
                })}
            </ul>
        </nav>
    )
}
