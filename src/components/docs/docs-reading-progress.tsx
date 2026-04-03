'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocsReadingProgress() {
    const [progress, setProgress] = useState(0)
    const [showBackToTop, setShowBackToTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight
            const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

            setProgress(scrolled)
            setShowBackToTop(scrollTop > 400)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 z-200 h-px bg-transparent">
                <div
                    className="h-full bg-foreground/50 transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Back to top button */}
            <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className={cn(
                    'fixed lg:bottom-10 lg:right-10 bottom-4 right-4 z-50 p-2.5 rounded-full border border-border bg-background text-muted-foreground shadow-sm',
                    'hover:text-foreground hover:bg-secondary/50 transition-all duration-200',
                    showBackToTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                )}
            >
                <ArrowUp className="size-4" />
            </button>
        </>
    )
}
