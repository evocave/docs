import { getDocNavTree } from '@/lib/docs-api'
import DocsSearch from './docs-search'

export default async function DocsSearchWrapper() {
    const navTree = await getDocNavTree()
    return <DocsSearch navTree={navTree} />
}
