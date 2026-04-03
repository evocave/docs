'use client'

import { useEffect, useState } from 'react'

type Props = {
    slug: string
}

export default function DocViewCount({ slug }: Props) {
    const [views, setViews] = useState<number | null>(null)

    useEffect(() => {
        const sessionKey = `viewed:${slug}`
        const alreadyViewed = sessionStorage.getItem(sessionKey)

        if (alreadyViewed) {
            // Sudah dihitung di session ini — ambil count tanpa increment
            fetch(`/api/views/${slug}`)
                .then((res) => res.json())
                .then((data) => setViews(data.views))
                .catch(() => null)
        } else {
            // Belum dihitung — increment dan tandai sudah dilihat
            fetch(`/api/views/${slug}`, { method: 'POST' })
                .then((res) => res.json())
                .then((data) => {
                    setViews(data.views)
                    sessionStorage.setItem(sessionKey, '1')
                })
                .catch(() => null)
        }
    }, [slug])

    if (views === null) return null

    return (
        <span>
            · {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
        </span>
    )
}
