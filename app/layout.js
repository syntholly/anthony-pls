import './globals.css';

import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';

import {DataProvider} from '@/providers/DataProvider';
import {EventProvider} from '@/providers/EventProvider';
import {KonamiProvider} from '@/providers/KonamiCode';

export const metadata = {
    title: 'TOM (Tea Ordering Matches)',
    description: 'Sign up for the next Tea Ordering match!',
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <KonamiProvider />
                <SpeedInsights />
                <Analytics />
                <DataProvider>
                    <EventProvider>
                        <div className="w-full max-w-6xl p-4">{children}</div>
                    </EventProvider>
                </DataProvider>
            </body>
        </html>
    );
}
