'use client';

import determineEvent from '@/utils/determineEvent';
import determineJudge from '@/utils/determineJudge';
import determineRounds from '@/utils/determineRounds';
import { createContext, useContext, useEffect, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (!event) {
            setEvent({
                name: determineEvent(
                    process.env.NEXT_PUBLIC_EVENT_NAMES.split(','),
                ),
                rounds: determineRounds(),
                judge: determineJudge(
                    process.env.NEXT_PUBLIC_EVENT_JUDGES.split(','),
                ),
            });
        }
    }, []);

    if (!event) return <div className='p-4'>Loading event..</div>;

    return (
        <EventContext.Provider value={{ event }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    return useContext(EventContext);
};
