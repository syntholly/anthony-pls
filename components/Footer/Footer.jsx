'use client';

import {useEvent} from '@/providers/EventProvider';
import React from 'react';

const Footer = () => {
    const {event} = useEvent();

    const now = new Date();

    const pad = (num) => num.toString().padStart(2, '0');

    const formattedDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    if (!event) return null;
    return (
        <div>
            <p className="mt-6 md:mt-12">
                <span className="mr-2 text-2xl">*</span>
                This player has received one or more losses for tardiness and will always be ordered, in Swiss rounds,
                after players with the same match record who were on time.
            </p>
            <div className="mt-6 flex w-full justify-between font-bold md:mt-12">
                <span>{event.name}</span>
                <span>{event.judge}</span>
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};

export default Footer;
