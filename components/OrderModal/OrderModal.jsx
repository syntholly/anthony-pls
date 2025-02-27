'use client';

import { useData } from '@/providers/DataProvider';
import React, { useState } from 'react';

const OrderModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [orderInput, setOrderInput] = useState('');
    const { data, updateUser } = useData();

    const handleSubmit = (e) => {
        e.preventDefault();

        const userToUpdate = data.find((user) => user.name === selectedUser);

        if (userToUpdate) {
            const twelveHours = 12 * 60 * 60 * 1000;
            const now = Date.now();
            const isRecentOrder =
                userToUpdate.orderLatest
                && now - userToUpdate.orderLatest < twelveHours;

            const updatedOrders =
                isRecentOrder ?
                    [
                        ...userToUpdate.orders.slice(0, -1),
                        { name: orderInput, date: now },
                    ]
                :   [...userToUpdate.orders, { name: orderInput, date: now }];

            updateUser({
                ...userToUpdate,
                orders: updatedOrders,
                orderLatest: now,
            });
        }

        setIsOpen(false);
        setOrderInput('');
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                disabled={new Date().getDay() === 2 ? false : true}
                className='mt-8 px-4 py-2 hover:bg-green-500 transition-colors bg-green-400 disabled:bg-green-200 text-white rounded cursor-pointer disabled:cursor-not-allowed'>
                {new Date().getDay() === 2 ? 'Submit Order' : 'Opens Tuesday'}
            </button>

            {isOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <form
                            className='flex flex-col gap-4'
                            onSubmit={handleSubmit}>
                            <select
                                name='user'
                                id='user'
                                className='border px-2 py-2 rounded'
                                value={selectedUser}
                                onChange={(e) =>
                                    setSelectedUser(e.target.value)
                                }>
                                <option
                                    value=''
                                    disabled>
                                    Select a user
                                </option>
                                {data.map((user) => (
                                    <option
                                        key={user.name}
                                        value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type='text'
                                name='order'
                                id='order'
                                placeholder='Enter order'
                                className='border p-2 rounded'
                                value={orderInput}
                                onChange={(e) => setOrderInput(e.target.value)}
                            />
                            <button
                                type='submit'
                                className='mt-4 px-4 py-2 bg-indigo-400 transition-colors hover:bg-indigo-500 text-white rounded cursor-pointer'>
                                Submit Order
                            </button>
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                className='px-4 py-2 bg-red-300 hover:bg-red-400 text-white transition-colors rounded cursor-pointer'>
                                Exit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderModal;
