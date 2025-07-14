'use client';

import {useEvent} from '@/providers/EventProvider';
import React, {useEffect, useState} from 'react';

const Header = () => {
    const {event} = useEvent();
    const [timeLeft, setTimeLeft] = useState('');
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const perthOffset = 8 * 60;
            const nowUtcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
            const targetUtcMinutes = 17 * 60 + 15 - perthOffset;

            let minutesLeft = targetUtcMinutes - nowUtcMinutes;
            if (minutesLeft < 0) {
                minutesLeft += 24 * 60;
                setExpired(true);
            }

            const mins = Math.floor(minutesLeft);
            const secs = 60 - now.getSeconds();
            setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!event) return null;

    return (
        <div>
            <h2 className="mb-4 font-bold md:text-2xl">
                Standings - Round {expired ? event.rounds : event.rounds - 1}/{event.rounds} (round ends: {timeLeft})
            </h2>
            <h3 className="mb-6">
                Tournament: <span className="font-bold">{event.name}</span>
            </h3>
        </div>
    );
};

export default Header;
