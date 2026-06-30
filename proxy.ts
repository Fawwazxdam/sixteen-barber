import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const url = req.nextUrl;
    const host = req.headers.get('host') || '';
    const hostname = host.split(':')[0];

    const isApp = hostname === 'app.memangkas.com' || hostname === 'app.memangkas.test' || hostname === 'app.localhost';

    if (isApp) {
        url.pathname = `/saas${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
