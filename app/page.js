import Header from '@/components/Header';
import OrderModal from '@/components/OrderModal';
import Footer from '@/components/Footer';
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
