'use client'

import { useLang } from '@/context/language-context'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { ChevronUp, Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ─── Language Switcher ────────────────────────────────────────────────────────

const LANGUAGES = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'id', label: 'Bahasa Indonesia', short: 'ID' },
    { code: 'ja', label: '日本語', short: 'JA' },
    { code: 'de', label: 'Deutsch', short: 'DE' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'pt', label: 'Português', short: 'PT' },
    { code: 'zh', label: '简体中文', short: 'ZH' },
    { code: 'ko', label: '한국어', short: 'KO' },
    { code: 'ar', label: 'العربية', short: 'AR' }
]

// ─── Footer Menu ──────────────────────────────────────────────────────────────

const MENU = [
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '/' },
            { label: 'Support Policy', href: '#' },
            { label: 'Changelog', href: '#' },
            { label: 'Templates', href: '#' }
        ]
    },
    {
        title: 'Company',
        links: [
            { label: 'About Evocave', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Contact', href: '#t' },
            { label: 'Careers', href: '#', soon: true }
        ]
    },
    {
        title: 'Market',
        links: [
            { label: 'Envato Elements', href: '#', soon: true },
            {
                label: 'Themeforest',
                href: 'https://themeforest.net/user/evocave'
            },
            { label: 'Figma Community', href: '#', soon: true },
            { label: 'Ui8', href: '#', soon: true }
        ]
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' }
        ]
    }
]

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const options = [
        { value: 'light', icon: Sun },
        { value: 'system', icon: Monitor },
        { value: 'dark', icon: Moon }
    ]

    if (!mounted) {
        return (
            <div className="flex items-center gap-0.5 bg-secondary rounded-full p-1">
                {options.map(({ value, icon: Icon }) => (
                    <div
                        key={value}
                        className="p-1.5 rounded-full text-muted-foreground"
                    >
                        <Icon className="size-3.5" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-0.5 bg-secondary rounded-full p-1">
            {options.map(({ value, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                        'p-1.5 rounded-full transition-colors',
                        theme === value
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    )}
                >
                    <Icon className="size-3.5" />
                </button>
            ))}
        </div>
    )
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function DocsFooter() {
    const { lang, setLang } = useLang()
    const [open, setOpen] = useState(false)
    const activeLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

    return (
        <footer className="w-full border-t border-border mt-12">
            <div className="w-full max-w-350 mx-auto px-4 lg:px-6 py-10">
                {/* Menu columns */}
                <div className="flex justify-between lg:flex-row flex-col gap-8">
                    <Link href="/" aria-label="Go to Evocave homepage">
                        <svg
                            width="126"
                            height="32"
                            viewBox="0 0 126 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-foreground"
                        >
                            <path
                                d="M20 16.1655V19.2294C20 22.9693 16.9681 26 13.2271 26H6.77462C3.03545 26 0 22.964 0 19.2277V12.7776C0 9.03598 3.03545 6 6.77462 6H13.2271C13.7453 6 14.2512 6.05953 14.7361 6.17158C20.723 7.53375 21.5317 15.656 16.1015 18.5134C14.4578 19.3818 12.7002 19.5936 11.6849 19.3975C8.39037 18.7602 8.07527 14.7648 11.2665 14.208L11.7532 16.0009L15.0722 11.7796L9.7628 8.72433L10.2652 10.5715C3.28228 11.5467 2.73611 18.8653 7.02495 21.299C11.5554 23.8692 18.526 21.6841 20 16.1637V16.1655Z"
                                fill="currentColor"
                            />
                            <path
                                d="M26 16.0272C26 11.8709 28.7095 9 32.5975 9C36.4855 9 39.0881 11.6551 39.0881 15.7852V16.7778L29.1111 16.8041C29.3531 19.1365 30.586 20.3168 32.7589 20.3168C34.5564 20.3168 35.7367 19.6188 36.112 18.3596H39.1424C38.5795 21.2568 36.1664 23 32.7062 23C28.7639 23 26.0018 20.1309 26.0018 16.0272H26ZM29.1918 14.7136H35.8437C35.8437 12.8898 34.5827 11.6832 32.6256 11.6832C30.6684 11.6832 29.5145 12.7284 29.1935 14.7136H29.1918Z"
                                fill="currentColor"
                            />
                            <path
                                d="M39.6492 9.40336H43.1357L45.4418 15.4905C46.0048 17.0724 46.4607 18.4403 46.6221 19.1646C46.8097 18.3333 47.292 16.9391 47.8549 15.4905L50.2681 9.40336H53.6475L48.1233 22.6528H44.9052L39.6492 9.40336Z"
                                fill="currentColor"
                            />
                            <path
                                d="M61.185 9.0263C65.2887 9.0263 68.2648 11.8691 68.2648 15.9991C68.2648 20.1291 65.287 22.9719 61.185 22.9719C57.0831 22.9719 54.1052 20.1291 54.1052 15.9991C54.1052 11.8691 57.0813 9.0263 61.185 9.0263ZM61.185 20.0502C63.4386 20.0502 64.9941 18.414 64.9941 16.0009C64.9941 13.5877 63.4386 11.9515 61.185 11.9515C58.9315 11.9515 57.3759 13.5877 57.3759 16.0009C57.3759 18.414 58.9315 20.0502 61.185 20.0502Z"
                                fill="currentColor"
                            />
                            <path
                                d="M76.7125 9C80.334 9 82.7997 11.0115 83.1487 14.2033H79.8762C79.5009 12.7021 78.4014 11.9235 76.8458 11.9235C74.7536 11.9235 73.3594 13.5053 73.3594 16.0009C73.3594 18.4964 74.6466 20.0502 76.7388 20.0502C78.3751 20.0502 79.529 19.2453 79.8762 17.7967H83.175C82.7734 20.8815 80.1989 23 76.7388 23C72.7158 23 70.0869 20.2116 70.0869 16.0009C70.0869 11.7902 72.7964 9.00175 76.7108 9.00175L76.7125 9Z"
                                fill="currentColor"
                            />
                            <path
                                d="M85.0252 18.87C85.0252 16.4288 86.7947 14.9013 89.9339 14.6593L93.9025 14.3646V14.07C93.9025 12.2725 92.8293 11.5482 91.1667 11.5482C89.2359 11.5482 88.1626 12.3531 88.1626 13.7473H85.3742C85.3742 10.8782 87.7347 9 91.3281 9C94.9215 9 97.0943 10.9309 97.0943 14.6049V22.651H94.2252L93.9832 20.6938C93.4203 22.0618 91.6227 23 89.5586 23C86.7421 23 85.0252 21.3638 85.0252 18.87ZM93.9288 17.2881V16.5901L91.1667 16.8041C89.1289 16.9917 88.3502 17.6617 88.3502 18.7349C88.3502 19.9415 89.1552 20.5325 90.6301 20.5325C92.6416 20.5325 93.9288 19.3259 93.9288 17.2881Z"
                                fill="currentColor"
                            />
                            <path
                                d="M98.2728 9.40336H101.759L104.065 15.4905C104.628 17.0724 105.084 18.4403 105.246 19.1646C105.433 18.3333 105.916 16.9391 106.479 15.4905L108.892 9.40336H112.271L106.747 22.6528H103.529L98.2728 9.40336Z"
                                fill="currentColor"
                            />
                            <path
                                d="M112.727 16.0272C112.727 11.8709 115.437 9 119.325 9C123.213 9 125.815 11.6551 125.815 15.7852V16.7778L115.838 16.8041C116.08 19.1365 117.313 20.3168 119.486 20.3168C121.283 20.3168 122.464 19.6188 122.839 18.3596H125.869C125.307 21.2568 122.893 23 119.433 23C115.491 23 112.729 20.1309 112.729 16.0272H112.727ZM115.919 14.7136H122.571C122.571 12.8898 121.31 11.6832 119.353 11.6832C117.395 11.6832 116.242 12.7284 115.921 14.7136H115.919Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Link>
                    <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-10 gap-8 mb-10">
                        {MENU.map((col) => (
                            <div key={col.title}>
                                <p className="text-sm font-semibold text-foreground mb-4">
                                    {col.title}
                                </p>
                                <ul className="space-y-4">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors h-6"
                                            >
                                                {link.label}
                                                {link.soon && (
                                                    <div className="flex items-center bg-linear-to-tr from-[#CC7A00] to-[#FF9900] rounded-none py-0.5 px-1.5">
                                                        <span className="text-[10px] text-foreground font-medium">
                                                            SOON
                                                        </span>
                                                    </div>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border pt-6 flex flex-col-reverse items-center sm:flex-row sm:items-center sm:justify-between gap-6">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Evocave. All rights
                        reserved.
                    </p>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                        {/* Theme toggle */}
                        <ThemeToggle />

                        {/* Language switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen((o) => !o)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors"
                            >
                                <span className="font-medium text-xs">
                                    {activeLang.short}
                                </span>
                                <span>{activeLang.label}</span>
                                <ChevronUp
                                    className={cn(
                                        'size-3.5 transition-transform',
                                        open ? 'rotate-0' : 'rotate-180'
                                    )}
                                />
                            </button>

                            {open && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setOpen(false)}
                                    />
                                    <div className="absolute bottom-full mb-2 right-0 z-50 bg-background border border-border rounded-xl shadow-lg overflow-hidden w-64">
                                        <div className="grid grid-cols-2 p-2 gap-0.5">
                                            {LANGUAGES.map((language) => (
                                                <button
                                                    key={language.code}
                                                    onClick={() => {
                                                        setLang(language.code)
                                                        setOpen(false)
                                                    }}
                                                    className={cn(
                                                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                                                        lang === language.code
                                                            ? 'bg-secondary text-foreground font-medium'
                                                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                                    )}
                                                >
                                                    <span className="text-xs font-semibold w-6 shrink-0">
                                                        {language.short}
                                                    </span>
                                                    <span className="truncate">
                                                        {language.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
