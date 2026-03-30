'use client';

import determineEvent from '@/utils/determineEvent';
import determineJudge from '@/utils/determineJudge';
import determineRounds from '@/utils/determineRounds';
import {createContext, useContext, useState} from 'react';

const EventContext = createContext();
const FALLBACK_EVENT_NAME = 'TOM';
const FALLBACK_JUDGE_NAME = 'Judge TBD';

const getConfigList = (value) => {
    return value?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? [];
};

const createEvent = () => {
    const eventNames = getConfigList(process.env.NEXT_PUBLIC_EVENT_NAMES);
    const judges = getConfigList(process.env.NEXT_PUBLIC_EVENT_JUDGES);

    return {
        name: eventNames.length ? determineEvent(eventNames) : FALLBACK_EVENT_NAME,
        rounds: determineRounds(),
        judge: judges.length ? determineJudge(judges) : FALLBACK_JUDGE_NAME,
    };
};

export const EventProvider = ({children}) => {
    const [event] = useState(createEvent);

    return <EventContext.Provider value={{event}}>{children}</EventContext.Provider>;
};

export const useEvent = () => {
    return useContext(EventContext);
};
