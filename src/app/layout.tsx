import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import DocsHeader from '@/components/docs/docs-header'
import DocsFooter from '@/components/docs/docs-footer'
import { LanguageProvider } from '@/context/language-context'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Evocave Docs',
    description:
        'Official documentation for Evocave — explore guides, references, and more.'
}

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="antialiased" suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <LanguageProvider>
                        <DocsHeader />
                        {children}
                        <DocsFooter />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
