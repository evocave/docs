import { getDocNavTree } from '@/lib/docs-api'
import DocsSidebarNav from './docs-sidebar-nav'

export default async function DocsSidebarNavWrapper() {
    const navTree = await getDocNavTree()
    return <DocsSidebarNav navTree={navTree} />
}
