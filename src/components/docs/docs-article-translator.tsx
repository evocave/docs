'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/context/language-context'

type Props = {
    content: string
    className?: string
}

export default function DocsArticleTranslator({ content, className }: Props) {
    const { lang } = useLang()
    const [translated, setTranslated] = useState(content)
    const [loading, setLoading] = useState(false)

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

    return (
        <div
            className={className}
            style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}
            dangerouslySetInnerHTML={{ __html: translated }}
        />
    )
}
