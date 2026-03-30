import './globals.css';

import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';

import {AppProviders} from '@/providers/AppProviders';

export const metadata = {
    title: 'TOM (Tea Ordering Matches)',
    description: 'Sign up for the next Tea Ordering match!',
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <SpeedInsights />
                <Analytics />
                <AppProviders>
                    <div className="mx-auto w-full max-w-6xl p-4">
                        {children}
                    </div>
                </AppProviders>
            </body>
        </html>
    );
}
