import {SpeedInsights} from '@vercel/speed-insights/next';
import {Analytics} from '@vercel/analytics/react';

import {DataProvider} from '@/providers/DataProvider';
import {EventProvider} from '@/providers/EventProvider';

import Header from '@/components/Header';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';
import {KonamiProvider} from '@/providers/KonamiCode';
import Table from '@/components/Table';

export default function Home() {
    return (
        <div>
            <Header />
            <main>
                <Table />
            </main>
            <Footer />
            <OrderModal />
        </div>
    );
}
