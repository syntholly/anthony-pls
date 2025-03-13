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
            setData(result.record.users); // Assuming users is an array inside the record
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!data) {
            fetchData();
        }
    }, []);

    const updateUser = async (updatedObject) => {
        if (!data) return;

        try {
            // Clone data and update the matching object
            const updatedData = [...data];
            const index = updatedData.findIndex(
                (item) => item.name === updatedObject.name,
            );

            if (index !== -1) {
                updatedData[index] = {
                    ...updatedData[index],
                    ...updatedObject,
                };
            } else {
                throw new Error('User not found in JSONBin data');
            }

            // Push updated data back to JSONBin
            const response = await fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY,
                },
                body: JSON.stringify({ users: updatedData }), // Keeping the same structure
            });

            if (!response.ok) throw new Error('Failed to update JSONBin');

            const result = await response.json();
            setData(result.record.users); // Update state with the new data
        } catch (error) {
            console.error('Error updating JSONBin:', error.message);
        }
    };

    if (loading) return <div className='p-4'>Loading users...</div>;
    if (error) return <div className='p-4 text-red-500'>Error: {error}</div>;

    return (
        <DataContext.Provider value={{ data, updateUser }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
