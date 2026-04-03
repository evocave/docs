'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DocItem } from '@/lib/docs'
import { DocItemType } from '@/lib/docs-type'
import { DocItemSection } from '@/lib/docs-section'

interface SearchCommandProps {
    docs: DocItem[]
    docs_type: DocItemType[]
    docs_section: DocItemSection[]
}

export default function SearchCommand({
    docs,
    docs_type,
    docs_section
}: SearchCommandProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Filter docs berdasarkan query
    const results = query.trim()
        ? docs.filter((doc) =>
              doc.title.rendered.toLowerCase().includes(query.toLowerCase())
          )
        : docs.slice(0, 6) // Tampilkan 6 docs pertama kalau belum ada query

    // Listener Ctrl+K untuk buka/tutup modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen((prev) => !prev)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Focus input saat modal terbuka, reset state saat tutup
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50)
            setQuery('')
            setSelectedIndex(0)
        }
    }, [isOpen])

    // const handleSelect = useCallback(
    //     (doc: DocItem) => {
    //         router.push(`${doc.slug}`)
    //         setIsOpen(false)
    //     },
    //     [router]
    // )

    const handleSelect = useCallback(
        (doc: DocItem) => {
            // 1. Cari slug untuk docs_type
            // doc.docs_type biasanya berisi array ID, kita ambil yang pertama [0]
            const typeId = doc.docs_type?.[0]
            const typeSlug =
                docs_type.find((t) => t.id === typeId)?.slug || 'unknown-type'

            console.log(typeSlug)

            // 2. Cari slug untuk docs_section
            const sectionId = doc.docs_section?.[0]
            const sectionSlug =
                docs_section.find((s) => s.id === sectionId)?.slug ||
                'unknown-section'

            console.log(sectionSlug)

            // 3. Gabungkan menjadi path yang diinginkan
            // Format: /elementor/getting-started/getting-started
            const fullPath = `/${typeSlug}/${sectionSlug}/${doc.slug}`

            router.push(fullPath)
            setIsOpen(false)
        },
        [router, docs_type, docs_section] // Pastikan docs_type & docs_section masuk dependency
    )

    // Navigasi Arrow Key + Enter di dalam modal
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : 0
                )
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : results.length - 1
                )
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                handleSelect(results[selectedIndex])
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, results, selectedIndex, handleSelect])

    // Reset selectedIndex kalau results berubah
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    function stripHtml(html: string) {
        return html.replace(/<[^>]*>/g, '').trim()
    }

    return (
        <>
            {/* ── Tombol Trigger di Header ── */}
            <button
                id="search-trigger-btn"
                onClick={() => setIsOpen(true)}
                className="hidden lg:flex items-center gap-3 h-9 px-3 rounded-md border border-border bg-muted/50 text-muted-foreground text-sm transition-all duration-150 hover:bg-muted hover:text-foreground hover:border-border/80 cursor-pointer group min-w-48"
                aria-label="Open search"
            >
                {/* Icon Search */}
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>

                <span className="flex-1 text-left">Search...</span>

                {/* Shortcut hint */}
                <kbd className="hidden sm:flex items-center gap-0.5 text-xs font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                    <span>Ctrl</span>
                    <span className="mx-0.5">+</span>
                    <span>K</span>
                </kbd>
            </button>

            {/* ── Modal Overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh]"
                    aria-modal="true"
                    role="dialog"
                    aria-label="Search documentation"
                >
                    {/* Background overlay - klik untuk tutup */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dialog box */}
                    <div className="relative w-full max-w-xl mx-4 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-150">
                        {/* Input area */}
                        <div className="flex items-center gap-3 px-4 border-b border-border">
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
                            <input
                                ref={inputRef}
                                id="search-input"
                                type="text"
                                placeholder="Search documentation..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                            />
                            <kbd
                                onClick={() => setIsOpen(false)}
                                className="flex items-center text-xs font-mono bg-muted border border-border rounded px-1.5 py-0.5 text-muted-foreground cursor-pointer hover:bg-accent transition-colors"
                            >
                                Esc
                            </kbd>
                        </div>

                        {/* Results list */}
                        <div className="max-h-80 overflow-y-auto p-2">
                            {results.length > 0 ? (
                                <>
                                    {/* Label section */}
                                    <p className="text-xs text-muted-foreground px-2 py-1.5 font-medium">
                                        {query.trim()
                                            ? `${results.length} result${results.length > 1 ? 's' : ''} for "${query}"`
                                            : 'Documentation'}
                                    </p>

                                    {results.map((doc, index) => (
                                        <button
                                            key={doc.id}
                                            id={`search-result-${index}`}
                                            onClick={() => handleSelect(doc)}
                                            onMouseEnter={() =>
                                                setSelectedIndex(index)
                                            }
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-75 cursor-pointer ${
                                                index === selectedIndex
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'text-foreground hover:bg-accent/50'
                                            }`}
                                        >
                                            {/* Doc icon */}
                                            <div
                                                className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-md border ${
                                                    index === selectedIndex
                                                        ? 'border-border bg-background'
                                                        : 'border-border/50 bg-muted'
                                                }`}
                                            >
                                                <svg
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-muted-foreground"
                                                >
                                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                            </div>

                                            {/* Text content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {stripHtml(
                                                        doc.title.rendered
                                                    )}
                                                </p>
                                                {doc.excerpt?.rendered && (
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                        {stripHtml(
                                                            doc.excerpt.rendered
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Arrow icon saat selected */}
                                            {index === selectedIndex && (
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-muted-foreground shrink-0"
                                                >
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                // Kalau tidak ada hasil
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-muted-foreground mb-3"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <p className="text-sm font-medium text-foreground">
                                        No results found
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer hint navigasi */}
                        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/30">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <kbd className="flex items-center justify-center w-5 h-5 bg-background border border-border rounded text-[10px] font-mono">
                                    ↑
                                </kbd>
                                <kbd className="flex items-center justify-center w-5 h-5 bg-background border border-border rounded text-[10px] font-mono">
                                    ↓
                                </kbd>
                                <span>Navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <kbd className="flex items-center justify-center h-5 px-1.5 bg-background border border-border rounded text-[10px] font-mono">
                                    ↵
                                </kbd>
                                <span>Open</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <kbd className="flex items-center justify-center h-5 px-1.5 bg-background border border-border rounded text-[10px] font-mono">
                                    Esc
                                </kbd>
                                <span>Close</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
