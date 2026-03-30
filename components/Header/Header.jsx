'use client';

import {useEvent} from '@/providers/EventProvider';
import React, {useEffect, useState} from 'react';

const PERTH_OFFSET_MINUTES = 8 * 60;
const ROUND_END_MINUTES = 17 * 60 + 15;
const MINUTES_PER_DAY = 24 * 60;
const SECONDS_PER_DAY = MINUTES_PER_DAY * 60;

const getCountdown = () => {
    const now = new Date();
    const perthMinutes = (now.getUTCHours() * 60 + now.getUTCMinutes() + PERTH_OFFSET_MINUTES) % MINUTES_PER_DAY;

    let remainingSeconds = (ROUND_END_MINUTES - perthMinutes) * 60 - now.getUTCSeconds();
    let expired = false;

    if (remainingSeconds < 0) {
        remainingSeconds += SECONDS_PER_DAY;
        expired = true;
    }

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return {
        expired,
        timeLeft: `${minutes}:${String(seconds).padStart(2, '0')}`,
    };
};

const Header = () => {
    const {event} = useEvent();
    const [countdown, setCountdown] = useState(getCountdown);

    useEffect(() => {
        const updateCountdown = () => {
            setCountdown(getCountdown());
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!event) return null;

    return (
        <div>
            <h2 className="mb-4 font-bold md:text-2xl">
                Standings - Round {countdown.expired ? event.rounds : event.rounds - 1}/{event.rounds} (round ends:{' '}
                {countdown.timeLeft})
            </h2>
            <h3 className="mb-6">
                Tournament: <span className="font-bold">{event.name}</span>
            </h3>
        </div>
    );
};

export default Header;
