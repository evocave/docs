import DocsSidebar from '@/components/docs/docs-sidebar'
import DocsMobileSidebar from '@/components/docs/docs-mobile-sidebar'
import DocsSwitcherWrapper from '@/components/docs/docs-switcher-wrapper'
import DocsSidebarNavWrapper from '@/components/docs/docs-sidebar-nav-wrapper'
import DocsSearchWrapper from '@/components/docs/docs-search-wrapper'

export default function DocsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <main className="w-full mx-auto flex flex-1 flex-col">
            <div className="lg:hidden">
                <DocsMobileSidebar
                    switcher={<DocsSwitcherWrapper />}
                    nav={<DocsSidebarNavWrapper />}
                />
            </div>

            <div className="w-full max-w-350 mx-auto flex flex-1 flex-row px-4 lg:px-6 lg:pt-12">
                <DocsSidebar />
                <div className="w-full min-w-0 lg:pl-12 lg:px-6">
                    <div className="pt-6 lg:pt-0">{children}</div>
                </div>
            </div>

            <DocsSearchWrapper />
        </main>
    )
}
