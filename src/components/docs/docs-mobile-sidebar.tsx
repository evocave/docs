'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
    switcher: React.ReactNode
    nav: React.ReactNode
}

export default function DocsMobileSidebar({ switcher, nav }: Props) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    return (
        <>
            <div className="fixed top-16.5 left-0 right-0 z-30 bg-background flex flex-col">
                {/* Trigger */}
                <button
                    onClick={() => setOpen((o) => !o)}
                    className={cn(
                        'flex items-center gap-2 w-full px-4 py-3.5 text-sm text-foreground border-b border-border'
                    )}
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 32 32"
                            fill="none"
                        >
                            <path
                                d="M6 6L26 26M26 6L6 26"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 32 32"
                            fill="none"
                        >
                            <path
                                d="M4 11H28M4 21H28"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                    <span className="tracking-[3px]">MENU</span>
                </button>

                {open && (
                    <>
                        <div className="px-4 pt-4 pb-2">{switcher}</div>
                        <div
                            className="overflow-y-auto px-4 pb-6"
                            style={{
                                height: 'calc(100dvh - 65px - 48px - 60px)'
                            }}
                        >
                            {nav}
                        </div>
                    </>
                )}
            </div>

            {/* Overlay */}
            {open && (
                <div className="fixed inset-0 top-16.5 z-20 bg-background" />
            )}

            {/* Spacer — tinggi sama dengan trigger button supaya konten tidak tertutup */}
            <div className="h-12" />
        </>
    )
}
