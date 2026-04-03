'use client'

import { ThumbsDown, ThumbsUp, Mail } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function DocsFeedback() {
    const [helpful, setHelpful] = useState<boolean | null>(null)

    return (
        <div className="docs-feedback flex items-center justify-center flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 pt-6 border-t border-border pb-20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span>Still stuck?</span>
                <Link
                    href="/support"
                    className="text-primary hover:underline font-medium"
                >
                    How can we help?
                </Link>
            </div>

            <div className="flex items-center gap-3">
                {helpful === null ? (
                    <>
                        <span className="text-sm text-muted-foreground">
                            Was this page helpful?
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setHelpful(true)}
                                className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-green-500 transition-colors"
                                title="Yes"
                            >
                                <ThumbsUp className="size-4" />
                            </button>
                            <button
                                onClick={() => setHelpful(false)}
                                className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-red-500 transition-colors"
                                title="No"
                            >
                                <ThumbsDown className="size-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">
                        Thanks for your feedback!
                    </span>
                )}
            </div>
        </div>
    )
}
