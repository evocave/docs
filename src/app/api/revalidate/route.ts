import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { invalidateNavTreeCache } from '@/lib/docs-api'

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret')

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    try {
        const body = await request.json()

        // Invalidate Redis nav tree cache
        await invalidateNavTreeCache()

        // Revalidate Next.js page cache
        revalidatePath('/', 'layout')

        console.log('Revalidated:', body?.post?.slug || 'all')

        return NextResponse.json({
            revalidated: true,
            slug: body?.post?.slug || null
        })
    } catch {
        return NextResponse.json(
            { message: 'Error revalidating' },
            { status: 500 }
        )
    }
}
