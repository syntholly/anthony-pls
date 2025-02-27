import './globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';

import { DataProvider } from '@/providers/DataProvider';
import { EventProvider } from '@/providers/EventProvider';

import Header from '@/components/Header';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'TOM (Tea Ordering Matches)',
    description: 'Sign up for the next Tea Ordering match!',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className='antialiased'>
                <SpeedInsights />
                <DataProvider>
                    <EventProvider>
                        <div className='w-full max-w-6xl p-4'>
                            <Header />
                            <main>{children}</main>
                            <Footer />
                            <OrderModal />
                        </div>
                    </EventProvider>
                </DataProvider>
            </body>
        </html>
    );
}
