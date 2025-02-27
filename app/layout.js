import './globals.css';

import { EventProvider } from '@/providers/EventProvider';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DataProvider } from '@/providers/DataProvider';
import OrderModal from '@/components/OrderModal';

export const metadata = {
    title: 'TOM (Tea Ordering Matches)',
    description: 'Sign up for the next Tea Ordering match!',
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <body className='antialiased'>
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
