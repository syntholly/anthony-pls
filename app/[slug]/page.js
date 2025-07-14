'use client';

import {useData} from '@/providers/DataProvider';
import Link from 'next/link';
import {useParams} from 'next/navigation';

export default function User() {
    const {data} = useData();
    const {slug} = useParams();

    if (!data || data.length === 0) {
        return <div>Loading your previous orders..</div>;
    }

    const userData = data.find((item) => item.name.split(' ')[0].toLowerCase() === slug?.toLowerCase());

    if (!userData) {
        return <div>User {slug} not found - just use your first name before any spaces!</div>;
    }

    return (
        <div>
            <h2 className="mb-2 font-bold">Orders for {userData.name}</h2>
            <ol>
                {userData.orders.map((order, index) => (
                    <li key={index}>
                        <span>{order.name}</span>
                    </li>
                ))}
            </ol>
            <Link className="mt-8 block font-bold text-orange-400" href="/">
                ← Back to TOM
            </Link>
        </div>
    );
}
