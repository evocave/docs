'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { DocNavTopic } from '@/types/docs'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

// ─── Icons ───────────────────────────────────────────────────────────────────

const ElementorIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.8 19H5V5H7.8V19ZM19 19H10.6V16.2H19V19ZM19 13.3984H10.6V10.5984H19V13.3984ZM19 7.8H10.6V5H19V7.8Z"
            fill="white"
        />
    </svg>
)

const FigmaIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.66646 22C10.5065 22 11.9998 20.5066 11.9998 18.6666V15.3333H8.66646C6.82646 15.3333 5.33313 16.8266 5.33313 18.6666C5.33313 20.5066 6.82646 22 8.66646 22Z"
            fill="#0ACF83"
        />
        <path
            d="M5.33313 12C5.33313 10.16 6.82646 8.66669 8.66647 8.66669H11.9998V15.3334H8.66647C6.82646 15.3334 5.33313 13.84 5.33313 12Z"
            fill="#A259FF"
        />
        <path
            d="M5.33398 5.33333C5.33398 3.49333 6.82732 2 8.66732 2H12.0007V8.66667H8.66732C6.82732 8.66667 5.33398 7.17334 5.33398 5.33333Z"
            fill="#F24E1E"
        />
        <path
            d="M12.0001 2H15.3334C17.1734 2 18.6667 3.49333 18.6667 5.33334C18.6667 7.17334 17.1734 8.66667 15.3334 8.66667H12.0001V2Z"
            fill="#FF7262"
        />
        <path
            d="M18.6669 12C18.6669 13.84 17.1735 15.3334 15.3335 15.3334C13.4935 15.3334 12.0002 13.84 12.0002 12C12.0002 10.16 13.4935 8.66669 15.3335 8.66669C17.1735 8.66669 18.6669 10.16 18.6669 12Z"
            fill="#1ABCFE"
        />
    </svg>
)

const HtmlIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.78561 20.0068L3.18134 2H20.8187L19.2144 19.9971L11.9854 22"
            fill="#E44D26"
        />
        <path
            d="M12.0001 20.5746V3.37146H19.2997L17.9067 18.9257"
            fill="#F16529"
        />
        <path
            d="M6.38879 5.60046H12.0001V7.83515H8.84006L9.04679 10.124H12.0001V12.3537H6.99915M7.09759 13.476H9.34212L9.49963 15.2628L12.0001 15.9322V18.2653L7.41262 16.9856"
            fill="#EBEBEB"
        />
        <path
            d="M17.5918 5.60046H11.9903V7.83515H17.385M17.1832 10.124H11.9903V12.3587H14.7467L14.4859 15.2628L11.9903 15.9322V18.2555L16.568 16.9856"
            fill="white"
        />
    </svg>
)

// ─── Icon map by slug ─────────────────────────────────────────────────────────

const topicIconMap: Record<string, React.ReactNode> = {
    'elementor-template': <ElementorIcon />,
    'figma-ui': <FigmaIcon />,
    'html-template': <HtmlIcon />
}

const topicBgMap: Record<string, string> = {
    'elementor-template': 'bg-secondary/50',
    'figma-ui': 'bg-secondary/50',
    'html-template': 'bg-secondary/50'
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
    navTree: DocNavTopic[]
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DocsSwitcher({ navTree }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    // Detect active topic dari URL
    const activeTopicSlug = pathname.split('/')[1]
    const activeTopic =
        navTree.find((t) => t.slug === activeTopicSlug) ?? navTree[0]

    const handleSelect = (topic: DocNavTopic) => {
        router.push(`/${topic.slug}`)
    }

    if (!activeTopic) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex w-full items-center gap-2 rounded-[8px] px-2 h-15 text-left',
                        'hover:bg-secondary/30 transition-colors',
                        'data-[state=open]:bg-secondary/50',
                        'focus-visible:outline-none',
                        'border'
                    )}
                >
                    <div
                        className={cn(
                            '--icon-topic  size-9 shrink-0 rounded-lg overflow-hidden border border-border flex justify-center items-center',
                            topicBgMap[activeTopic.slug] ?? 'bg-secondary/50'
                        )}
                    >
                        {topicIconMap[activeTopic.slug] ?? <ElementorIcon />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground leading-5">
                            {activeTopic.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {activeTopic.count} documentation
                        </p>
                    </div>
                    <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={cn(
                    'p-0',
                    'border-border ',
                    'rounded-[8px]',
                    'bg-background'
                )}
                style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
                align="start"
                sideOffset={6}
            >
                {navTree.map((topic, i) => (
                    <DropdownMenuItem
                        key={topic.id}
                        className={cn(
                            'flex items-center gap-2',
                            'px-2 py-3',
                            'cursor-pointer',
                            'hover:bg-secondary/50',
                            'focus:bg-secondary/50',
                            'focus:text-foreground',
                            i === 0 && 'rounded-none',
                            i === navTree.length - 1 && 'rounded-none',
                            i !== navTree.length - 1 &&
                                'border-b border-border rounded-none'
                        )}
                        onClick={() => handleSelect(topic)}
                    >
                        <div
                            className={cn(
                                '--icon-topic w-9 h-9 shrink-0 rounded-lg border border-border flex justify-center items-center ',
                                topicBgMap[topic.slug] ?? 'bg-secondary/50'
                            )}
                        >
                            {topicIconMap[topic.slug] ?? <ElementorIcon />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground leading-5">
                                {topic.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {topic.count} documentation
                            </p>
                        </div>
                        {topic.slug === activeTopicSlug && (
                            <Check className="size-4 shrink-0 text-foreground ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
