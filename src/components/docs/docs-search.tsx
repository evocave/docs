'use client'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DocNavTopic } from '@/types/docs'

type Props = {
    navTree: DocNavTopic[]
}

export default function DocsSearch({ navTree }: Props) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState<number | 'all'>('all')
    const router = useRouter()
    const tabsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOpen = () => setOpen(true)
        document.addEventListener('open-docs-search', handleOpen)
        return () =>
            document.removeEventListener('open-docs-search', handleOpen)
    }, [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen((o) => !o)
            }
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
            setSearch('')
            setActiveTab('all')
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    const allDocs = navTree.flatMap((topic) =>
        topic.sections.flatMap((section) => {
            if (section.type === 'flat') {
                return section.docs.map((doc) => ({
                    id: doc.id,
                    label: doc.label,
                    href: doc.href,
                    topic: topic.label,
                    topicId: topic.id,
                    section: section.label
                }))
            }
            return section.industries.flatMap((industry) =>
                industry.docs.map((doc) => ({
                    id: doc.id,
                    label: doc.label,
                    href: doc.href,
                    topic: topic.label,
                    topicId: topic.id,
                    section: `${section.label} / ${industry.label}`
                }))
            )
        })
    )

    const topics = navTree.map((t) => ({
        id: t.id,
        label: t.label
    }))

    const filteredDocs =
        activeTab === 'all'
            ? allDocs
            : allDocs.filter((doc) => doc.topicId === activeTab)

    const handleSelect = (href: string) => {
        router.push(href)
        setOpen(false)
    }

    // Scroll active tab into view when switching
    const handleTabClick = (tabId: number | 'all') => {
        setActiveTab(tabId)
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50"
            onClick={() => setOpen(false)}
        >
            <div
                className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <Command shouldFilter={true}>
                    {/* Search Input */}
                    <div className="flex items-center gap-2 px-4 border-b border-border">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground shrink-0"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Search documentation..."
                            className="flex-1 py-4 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                            autoFocus
                        />
                        <kbd
                            className="text-xs border border-border rounded px-1.5 py-0.5 text-muted-foreground cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            ESC
                        </kbd>
                    </div>

                    {/* Topic Tabs — horizontal scroll when many tabs */}
                    <div
                        ref={tabsRef}
                        className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border overflow-x-auto scrollbar-none"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {/* "All" tab */}
                        <button
                            onClick={() => handleTabClick('all')}
                            className={`shrink-0 text-sm font-medium px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                                activeTab === 'all'
                                    ? 'text-foreground bg-secondary/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30 '
                            }`}
                        >
                            All
                        </button>

                        {/* Topic tabs */}
                        {topics.map((topic) => (
                            <button
                                key={topic.id}
                                onClick={() => handleTabClick(topic.id)}
                                className={`shrink-0 text-sm font-medium px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                                    activeTab === topic.id
                                        ? 'text-foreground bg-secondary/50'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30 '
                                }`}
                            >
                                {topic.label}
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <CommandList className="max-h-80 overflow-y-auto p-2">
                        <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                            No results found.
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredDocs.map((doc) => (
                                <CommandItem
                                    key={doc.id}
                                    value={`${doc.label} ${doc.topic} ${doc.section}`}
                                    onSelect={() => handleSelect(doc.href)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm aria-selected:bg-secondary/50 text-muted-foreground aria-selected:text-foreground"
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="shrink-0"
                                    >
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate font-medium text-foreground">
                                            {doc.label}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {/* Kalau tab All, tampilkan topic · section. Kalau tab spesifik, cukup section saja */}
                                            {activeTab === 'all'
                                                ? `${doc.topic} · ${doc.section}`
                                                : doc.section}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </div>
    )
}
