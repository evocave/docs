import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
import * as deepl from 'deepl-node'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

const translator = new deepl.Translator(process.env.DEEPL_API_KEY!)

const SUPPORTED_LANGS: Record<string, deepl.TargetLanguageCode> = {
    id: 'id',
    ja: 'ja',
    de: 'de',
    fr: 'fr',
    es: 'es',
    pt: 'pt-BR',
    zh: 'zh',
    ko: 'ko',
    ar: 'ar'
}

// ─── Helper: generate cache key dari konten ───────────────────────────────────

function getCacheKey(lang: string, text: string): string {
    // Pakai hash sederhana dari konten supaya key tidak terlalu panjang
    let hash = 0
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return `translate:${lang}:${Math.abs(hash)}`
}

// ─── POST: translate konten ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const { text, lang } = await request.json()

        if (!text || !lang) {
            return NextResponse.json(
                { error: 'Missing text or lang' },
                { status: 400 }
            )
        }

        if (lang === 'en') {
            return NextResponse.json({ translated: text })
        }

        const targetLang = SUPPORTED_LANGS[lang]
        if (!targetLang) {
            return NextResponse.json(
                { error: 'Unsupported language' },
                { status: 400 }
            )
        }

        // Check cache Redis
        const cacheKey = getCacheKey(lang, text)
        const cached = await redis.get<string>(cacheKey)
        if (cached) {
            return NextResponse.json({ translated: cached, cached: true })
        }

        // Translate via DeepL
        const result = await translator.translateText(text, null, targetLang, {
            tagHandling: 'html'
        })

        const translated = Array.isArray(result) ? result[0].text : result.text

        // Cache 1 tahun — hanya re-translate ketika artikel di-update via webhook
        await redis.set(cacheKey, translated, { ex: 60 * 60 * 24 * 365 })

        return NextResponse.json({ translated, cached: false })
    } catch (error) {
        console.error('Translation error:', error)
        return NextResponse.json(
            { error: 'Translation failed' },
            { status: 500 }
        )
    }
}

// ─── DELETE: invalidate cache untuk konten tertentu ──────────────────────────
// Dipanggil dari webhook WordPress ketika artikel di-update

export async function DELETE(request: NextRequest) {
    try {
        const { text } = await request.json()

        if (!text) {
            return NextResponse.json({ error: 'Missing text' }, { status: 400 })
        }

        // Hapus cache untuk semua bahasa
        const langs = Object.keys(SUPPORTED_LANGS)
        const keys = langs.map((lang) => getCacheKey(lang, text))
        await Promise.all(keys.map((key) => redis.del(key)))

        return NextResponse.json({ deleted: keys.length })
    } catch (error) {
        console.error('Cache invalidation error:', error)
        return NextResponse.json(
            { error: 'Cache invalidation failed' },
            { status: 500 }
        )
    }
}
