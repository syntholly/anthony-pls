'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BIN_ID = '67bfd1e7e41b4d34e49d8fd1';
    const API_KEY =
        '$2a$10$dhDGoYephc6t09M.V6/9gek5W.YLXLVbEejVGieyKqUmelttmPVCe';
    const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(BASE_URL, {
                    method: 'GET',
                    headers: { 'X-Master-Key': API_KEY },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const result = await response.json();
                setData(result.record.users);
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!data) {
            fetchData();
        }
    }, [data]);

    if (loading) return <div className='p-4'>Loading users...</div>;
    if (error) return <div className='p-4 text-red-500'>Error: {error}</div>;

    return (
        <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
