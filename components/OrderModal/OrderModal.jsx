'use client';

import React, { useState } from 'react';

const OrderModal = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className=''>
            {isOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg'>
                        <form className='flex flex-col gap-4'>
                            <select
                                name='user'
                                id='user'
                                className='border px-2 py-2 rounded'>
                                <option value='Chloe McCabe'>
                                    Chloe McCabe
                                </option>
                                <option value='Holly Woodward'>
                                    Holly Woodward
                                </option>
                                <option value='Marco Giovannini'>
                                    Marco Giovannini
                                </option>
                                <option value='Anthony Tsang'>
                                    Anthony Tsang
                                </option>
                                <option value='Daniel Hing'>Daniel Hing</option>
                                <option value='Cara Smart'>Cara Smart</option>
                                <option value='Diana Johari'>
                                    Diana Johari
                                </option>
                                <option value='Scott Wilmott'>
                                    Scott Wilmott
                                </option>
                            </select>

                            <input
                                type='text'
                                name='order'
                                id='order'
                                placeholder='Enter order'
                                className='border p-2 rounded'
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className='px-4 py-2 bg-green-400 text-white rounded cursor-pointer'>
                                Submit Order
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='px-4 py-2 bg-red-400 text-white rounded cursor-pointer'>
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
