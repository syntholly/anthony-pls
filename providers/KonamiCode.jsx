'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const KonamiContext = createContext();

export const KonamiProvider = ({ children }) => {
    const [isKonamiActive, setIsKonamiActive] = useState(false);

    useEffect(() => {
        const konamiCode = [
            'ArrowUp',
            'ArrowUp',
            'ArrowDown',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowLeft',
            'ArrowRight',
            'b',
            'a',
        ];
        let currentIndex = 0;

        const handleKeyDown = (event) => {
            if (event.key === konamiCode[currentIndex]) {
                currentIndex++;
                if (currentIndex === konamiCode.length) {
                    setIsKonamiActive((prev) => !prev);
                    document.documentElement.classList.toggle('konami');
                    currentIndex = 0;
                }
            } else {
                currentIndex = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <KonamiContext.Provider value={{ isKonamiActive }}>
            {children}
        </KonamiContext.Provider>
    );
};

export const useKonami = () => useContext(KonamiContext);
