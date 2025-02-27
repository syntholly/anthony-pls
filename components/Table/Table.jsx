'use client';

import { useData } from '@/providers/DataProvider';
import determineMatchRecord from '@/utils/determineMatchRecord';
import determineMatchPoints from '@/utils/determineMatchPoints';
import determineOpponentsWin from '@/utils/determineOpponentsWin';
import React from 'react';

const Table = () => {
    const { data } = useData();

    const sortedData = [...data].sort((a, b) => {
        const pointsA = determineMatchPoints(determineMatchRecord(a.orders));
        const pointsB = determineMatchPoints(determineMatchRecord(b.orders));

        if (pointsA !== pointsB) {
            return pointsB - pointsA;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <div>
            <h2 className='mb-4 font-bold text-3xl'>Masters Division</h2>
            <table className='w-full block'>
                <thead className='w-full'>
                    <tr className='text-left border w-full'>
                        <th className='p-2 border'>Standing</th>
                        <th className='p-2 border'>Name</th>
                        <th className='p-2 border'>Order</th>
                        <th className='p-2 border hidden lg:table-cell'>
                            Flight
                        </th>
                        <th className='p-2 border hidden lg:table-cell text-center'>
                            Drop Round
                        </th>
                        <th className='p-2 border text-center'>Match Record</th>
                        <th className='p-2 border text-center'>Match Points</th>
                        <th className='p-2 border hidden lg:table-cell text-right'>
                            Opponents' Win %
                        </th>
                        <th className='p-2 border hidden lg:table-cell text-right'>
                            Opponents' Opponent Win %
                        </th>
                    </tr>
                </thead>
                <tbody className='w-full'>
                    {sortedData.map((player, index) => (
                        <tr
                            key={index}
                            className='text-left border'>
                            <td className='p-2 border text-center'>
                                {index + 1}
                            </td>
                            <td
                                className={`p-2 border ${index <= 3 ? 'font-bold' : ''}`}>
                                {player.name}
                            </td>
                            <td className='p-2 border'>
                                {player.orders[player.orders.length - 1] ?? ''}
                            </td>
                            <td className='p-2 border hidden lg:table-cell text-center'>
                                {player.emoji}
                            </td>
                            <td className='p-2 border hidden lg:table-cell text-center'>
                                N/A
                            </td>
                            <td className='p-2 border text-center'>
                                {determineMatchRecord(player.orders).join('/')}
                            </td>
                            <td className='p-2 border text-center'>
                                {determineMatchPoints(
                                    determineMatchRecord(player.orders),
                                )}
                            </td>
                            <td className='p-2 border hidden lg:table-cell text-right'>
                                {determineOpponentsWin(
                                    player.name,
                                    false,
                                ).toFixed(2)}
                                %
                            </td>
                            <td className='p-2 border hidden lg:table-cell text-right'>
                                {determineOpponentsWin(
                                    player.name,
                                    true,
                                ).toFixed(2)}
                                %
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
