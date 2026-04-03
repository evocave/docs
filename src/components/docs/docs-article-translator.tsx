'use client'

import { useEffect, useState, useRef } from 'react'
import { useLang } from '@/context/language-context'

type Props = {
    content: string
    className?: string
}

export default function DocsArticleTranslator({ content, className }: Props) {
    const { lang } = useLang()
    const [translated, setTranslated] = useState(content)
    const [loading, setLoading] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (lang === 'en') {
            setTranslated(content)
            return
        }

        setLoading(true)
        fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: content, lang })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.translated) setTranslated(data.translated)
            })
            .catch(() => setTranslated(content))
            .finally(() => setLoading(false))
    }, [lang, content])

    // Inject Prism.js + copy button
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Load Prism CSS
        const existingLink = document.getElementById('prism-css')
        if (!existingLink) {
            const link = document.createElement('link')
            link.id = 'prism-css'
            link.rel = 'stylesheet'
            link.href =
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
            document.head.appendChild(link)
        }

        // Load Prism JS
        const loadPrism = async () => {
            if (!(window as Window & { Prism?: unknown }).Prism) {
                await new Promise<void>((resolve) => {
                    const script = document.createElement('script')
                    script.src =
                        'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js'
                    script.onload = () => resolve()
                    document.head.appendChild(script)
                })
                await new Promise<void>((resolve) => {
                    const script = document.createElement('script')
                    script.src =
                        'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js'
                    script.onload = () => resolve()
                    document.head.appendChild(script)
                })
            }

            // Highlight all code blocks
            const w = window as Window & {
                Prism?: { highlightAllUnder: (el: Element) => void }
            }

            // Set default language untuk code block tanpa class
            container
                .querySelectorAll('pre code:not([class*="language-"])')
                .forEach((el) => {
                    const text = el.textContent ?? ''
                    // Simple autodetect berdasarkan konten
                    if (text.includes('<?php')) {
                        el.className = 'language-php'
                    } else if (
                        text.includes('<html') ||
                        text.includes('</div>') ||
                        text.includes('<!DOCTYPE')
                    ) {
                        el.className = 'language-html'
                    } else if (
                        text.includes('SELECT ') ||
                        text.includes('INSERT ') ||
                        text.includes('FROM ')
                    ) {
                        el.className = 'language-sql'
                    } else if (
                        text.includes(': ') &&
                        text.includes('\n') &&
                        !text.includes('{')
                    ) {
                        el.className = 'language-yaml'
                    } else if (
                        text.includes('$ ') ||
                        text.includes('npm ') ||
                        text.includes('git ')
                    ) {
                        el.className = 'language-bash'
                    } else {
                        el.className = 'language-javascript'
                    }
                })

            if (w.Prism) {
                w.Prism.highlightAllUnder(container)
            }

            // Inject copy buttons
            const preBlocks = container.querySelectorAll('pre')
            preBlocks.forEach((pre) => {
                if (pre.querySelector('.copy-btn')) return

                pre.style.position = 'relative'

                const button = document.createElement('button')
                button.className = 'copy-btn'
                button.setAttribute('aria-label', 'Copy code')
                button.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </svg>
                `
                button.style.cssText = `
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    padding: 0.375rem;
                    border-radius: 0.375rem;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.5);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s;
                    opacity: 0;
                `

                pre.addEventListener('mouseenter', () => {
                    button.style.opacity = '1'
                })
                pre.addEventListener('mouseleave', () => {
                    button.style.opacity = '0'
                })

                button.addEventListener('click', async () => {
                    const code = pre.querySelector('code')
                    const text = code?.innerText ?? pre.innerText
                    try {
                        await navigator.clipboard.writeText(text)
                        button.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        `
                        button.style.color = 'rgba(255,255,255,0.9)'
                        setTimeout(() => {
                            button.innerHTML = `
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                </svg>
                            `
                            button.style.color = 'rgba(255,255,255,0.5)'
                        }, 2000)
                    } catch {
                        // clipboard not available
                    }
                })

                pre.appendChild(button)
            })
        }

        loadPrism()
    }, [translated])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}
            dangerouslySetInnerHTML={{ __html: translated }}
        />
    )
}
