'use client';

import {DataProvider} from '@/providers/DataProvider';
import {EventProvider} from '@/providers/EventProvider';
import {KonamiProvider} from '@/providers/KonamiCode';

export const AppProviders = ({children}) => {
    return (
        <KonamiProvider>
            <DataProvider>
                <EventProvider>{children}</EventProvider>
            </DataProvider>
        </KonamiProvider>
    );
};
