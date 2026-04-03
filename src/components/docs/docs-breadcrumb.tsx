import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

type BreadcrumbItem = {
    label: string
    href?: string
}

type Props = {
    items: BreadcrumbItem[]
}

export default function DocsBreadcrumb({ items }: Props) {
    const lastIndex = items.length - 1

    // Mobile: tampilkan hanya item pertama + "..." + item terakhir kalau > 2 item
    const mobileItems =
        items.length > 2
            ? [items[0], { label: '...', href: undefined }, items[lastIndex]]
            : items

    const renderItem = (
        item: BreadcrumbItem,
        i: number,
        arr: BreadcrumbItem[]
    ) => {
        const isLast = i === arr.length - 1
        const isEllipsis = item.label === '...'

        return (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0" />}
                {isEllipsis ? (
                    <span className="text-muted-foreground">...</span>
                ) : item.href ? (
                    <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors truncate max-w-24"
                    >
                        {item.label}
                    </Link>
                ) : isLast ? (
                    <span className="text-foreground font-medium truncate max-w-32">
                        {item.label}
                    </span>
                ) : (
                    <span className="truncate max-w-24">{item.label}</span>
                )}
            </span>
        )
    }

    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 min-w-0">
            {/* Mobile: truncated */}
            <span className="flex lg:hidden items-center gap-1.5 min-w-0 overflow-hidden">
                {mobileItems.map((item, i) => renderItem(item, i, mobileItems))}
            </span>

            {/* Desktop: full breadcrumb */}
            <span className="hidden lg:flex items-center gap-1.5">
                {items.map((item, i) => renderItem(item, i, items))}
            </span>
        </nav>
    )
}
