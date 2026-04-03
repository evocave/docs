import { getDocNavTree } from '@/lib/docs-api'
import DocsSwitcher from './docs-switcher'

export default async function DocsSwitcherWrapper() {
    const navTree = await getDocNavTree()
    return <DocsSwitcher navTree={navTree} />
}
