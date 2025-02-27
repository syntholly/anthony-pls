'use client';

import { useEvent } from '@/providers/EventProvider';
import React from 'react';

const Header = () => {
    const { event } = useEvent();

    if (!event) return null;

    return (
        <div>
            <h2 className='font-bold lg:text-2xl mb-4'>
                Standings - Round {event.rounds}/{event.rounds}
            </h2>
            <h3 className='mb-6'>
                Tournament: <span className='font-bold'>{event.name}</span>
            </h3>
        </div>
    );
};

export default Header;
