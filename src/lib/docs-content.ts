export function sanitizeContent(html: string): string {
    return (
        html
            // Hapus semua class dari wp-block-group div
            .replace(/<div[^>]*wp-block[^>]*>/gi, '<div>')
            // Hapus class dari figure
            .replace(/<figure[^>]*>/gi, '<figure>')
            // Hapus class dari ul
            .replace(/<ul[^>]*>/gi, '<ul>')
            // Hapus class dari blockquote
            .replace(/<blockquote[^>]*>/gi, '<blockquote>')
            // Hapus &nbsp;
            .replace(/&nbsp;/g, ' ')
    )
}

export function addHeadingIds(html: string): string {
    const idCount: Record<string, number> = {}

    return html.replace(
        /<(h[23])[^>]*>(.*?)<\/h[23]>/gi,
        (match, tag, text) => {
            const plainText = text.replace(/<[^>]+>/g, '')
            const baseId = plainText
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')

            let id = baseId
            if (idCount[baseId] !== undefined) {
                idCount[baseId]++
                id = `${baseId}-${idCount[baseId]}`
            } else {
                idCount[baseId] = 0
            }

            return `<${tag} id="${id}" style="scroll-margin-top: 112px">${text}</${tag}>`
        }
    )
}
