import {NextResponse} from 'next/server';

import {fetchBobabobaMenu} from '@/lib/bobabobaMenu';

export const revalidate = 3600;

export async function GET() {
    try {
        const menu = await fetchBobabobaMenu();

        return NextResponse.json(menu, {
            headers: {
                'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch {
        return NextResponse.json(
            {
                error: 'Failed to load Bobaboba menu options',
            },
            {status: 503},
        );
    }
}
