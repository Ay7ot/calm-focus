import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const supabase = await createClient()
    await supabase.auth.signOut()
    return NextResponse.redirect(`${requestUrl.origin}/login`, { status: 302 })
}
