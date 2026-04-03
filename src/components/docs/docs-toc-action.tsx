'use client'

import { cn } from '@/lib/utils'
import { Check, Copy, Printer, Share2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const MailIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M14.5 2H1.5C0.671562 2 0 2.67156 0 3.5V12.5C0 13.3284 0.671562 14 1.5 14H14.5C15.3284 14 16 13.3284 16 12.5V3.5C16 2.67156 15.3284 2 14.5 2ZM14.5 3.5V4.77516C13.7993 5.34575 12.6822 6.233 10.2942 8.10297C9.76787 8.51694 8.72537 9.51147 8 9.49988C7.27475 9.51159 6.23191 8.51678 5.70584 8.10297C3.31813 6.23328 2.20078 5.34584 1.5 4.77516V3.5H14.5ZM1.5 12.5V6.69994C2.21606 7.27028 3.23153 8.07063 4.77931 9.28263C5.46234 9.82028 6.6585 11.0072 8 11C9.33491 11.0072 10.5159 9.8375 11.2204 9.28288C12.7682 8.07091 13.7839 7.27034 14.5 6.69997V12.5H1.5Z"
            fill="currentColor"
        />
    </svg>
)

const TwitterIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.1622 1.5H14.3684L9.54966 7.00625L15.2184 14.5H10.7809L7.30278 9.95625L3.32778 14.5H1.11841L6.27153 8.60938L0.837158 1.5H5.38716L8.52778 5.65312L12.1622 1.5ZM11.3872 13.1812H12.609L4.72153 2.75H3.40903L11.3872 13.1812Z"
            fill="currentColor"
        />
    </svg>
)

const LinkedinIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4.13375 14.0002H1.23125V4.6533H4.13375V14.0002ZM2.68094 3.3783C1.75281 3.3783 1 2.60955 1 1.68143C1 1.23561 1.1771 0.80806 1.49234 0.492823C1.80757 0.177587 2.23513 0.000488281 2.68094 0.000488281C3.12675 0.000488281 3.5543 0.177587 3.86954 0.492823C4.18478 0.80806 4.36188 1.23561 4.36188 1.68143C4.36188 2.60955 3.60875 3.3783 2.68094 3.3783ZM14.9969 14.0002H12.1006V9.45018C12.1006 8.3658 12.0787 6.97518 10.5916 6.97518C9.0825 6.97518 8.85125 8.1533 8.85125 9.37205V14.0002H5.95188V4.6533H8.73562V5.9283H8.77625C9.16375 5.19393 10.1103 4.41893 11.5225 4.41893C14.46 4.41893 15 6.3533 15 8.8658V14.0002H14.9969Z"
            fill="currentColor"
        />
    </svg>
)

const FacebookIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M11.7234 9L12.1678 6.10437H9.38933V4.22531C9.38933 3.43313 9.77745 2.66094 11.0218 2.66094H12.285V0.195625C12.285 0.195625 11.1387 0 10.0428 0C7.75464 0 6.25901 1.38688 6.25901 3.8975V6.10437H3.71558V9H6.25901V16H9.38933V9H11.7234Z"
            fill="currentColor"
        />
    </svg>
)

const WhatsappIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.9031 3.03437C11.5937 1.72187 9.85 1 7.99687 1C4.17187 1 1.05937 4.1125 1.05937 7.9375C1.05937 9.15937 1.37813 10.3531 1.98438 11.4062L1 15L4.67812 14.0344C5.69062 14.5875 6.83125 14.8781 7.99375 14.8781H7.99687C11.8187 14.8781 15 11.7656 15 7.94063C15 6.0875 14.2125 4.34687 12.9031 3.03437ZM7.99687 13.7094C6.95937 13.7094 5.94375 13.4312 5.05937 12.9062L4.85 12.7812L2.66875 13.3531L3.25 11.225L3.1125 11.0063C2.53437 10.0875 2.23125 9.02813 2.23125 7.9375C2.23125 4.75938 4.81875 2.17188 8 2.17188C9.54062 2.17188 10.9875 2.77187 12.075 3.8625C13.1625 4.95312 13.8313 6.4 13.8281 7.94063C13.8281 11.1219 11.175 13.7094 7.99687 13.7094ZM11.1594 9.39062C10.9875 9.30313 10.1344 8.88437 9.975 8.82812C9.81563 8.76875 9.7 8.74062 9.58438 8.91562C9.46875 9.09062 9.1375 9.47813 9.03438 9.59688C8.93438 9.7125 8.83125 9.72812 8.65938 9.64062C7.64063 9.13125 6.97188 8.73125 6.3 7.57812C6.12188 7.27187 6.47812 7.29375 6.80937 6.63125C6.86562 6.51562 6.8375 6.41562 6.79375 6.32812C6.75 6.24063 6.40313 5.3875 6.25938 5.04063C6.11875 4.70313 5.975 4.75 5.86875 4.74375C5.76875 4.7375 5.65312 4.7375 5.5375 4.7375C5.42187 4.7375 5.23437 4.78125 5.075 4.95312C4.91562 5.12812 4.46875 5.54688 4.46875 6.4C4.46875 7.25313 5.09063 8.07813 5.175 8.19375C5.2625 8.30938 6.39687 10.0594 8.1375 10.8125C9.2375 11.2875 9.66875 11.3281 10.2188 11.2469C10.5531 11.1969 11.2437 10.8281 11.3875 10.4219C11.5312 10.0156 11.5313 9.66875 11.4875 9.59688C11.4469 9.51875 11.3313 9.475 11.1594 9.39062Z"
            fill="currentColor"
        />
    </svg>
)

type Props = {
    docTitle?: string
}

export default function DocsTocActions({ docTitle }: Props) {
    const [showModal, setShowModal] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handlePrint = () => window.print()

    const getShareUrl = (platform: string) => {
        const url = encodeURIComponent(window.location.href)
        const title = encodeURIComponent(docTitle || document.title)
        switch (platform) {
            case 'email':
                return `mailto:?subject=${title}&body=${url}`
            case 'twitter':
                return `https://twitter.com/intent/tweet?url=${url}&text=${title}`
            case 'linkedin':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${url}`
            case 'whatsapp':
                return `https://wa.me/?text=${title}%20${url}`
            default:
                return '#'
        }
    }

    const socials = [
        { platform: 'email', label: 'Email', icon: <MailIcon /> },
        { platform: 'twitter', label: 'Twitter / X', icon: <TwitterIcon /> },
        { platform: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon /> },
        { platform: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
        { platform: 'whatsapp', label: 'WhatsApp', icon: <WhatsappIcon /> }
    ]

    return (
        <>
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border">
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Share2 className="size-4" />
                    <span>Share this Doc</span>
                </button>
                <button
                    onClick={handlePrint}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Printer className="size-4" />
                </button>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-background border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-semibold text-foreground truncate pr-4">
                                {docTitle || 'Share this Doc'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-6">
                            {socials.map(({ platform, label, icon }) => (
                                <Link
                                    key={platform}
                                    href={getShareUrl(platform)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={label}
                                    className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    {icon}
                                </Link>
                            ))}
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                            Or copy link
                        </p>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/20">
                            <span className="flex-1 text-sm text-muted-foreground truncate">
                                {typeof window !== 'undefined'
                                    ? window.location.href
                                    : ''}
                            </span>
                            <button
                                onClick={handleCopy}
                                className={cn(
                                    'shrink-0 transition-colors',
                                    copied
                                        ? 'text-green-500'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {copied ? (
                                    <Check className="size-4" />
                                ) : (
                                    <Copy className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
