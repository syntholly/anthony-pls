'use client';

import { useData } from '@/providers/DataProvider';
import determineMatchRecord from '@/utils/determineMatchRecord';
import determineMatchPoints from '@/utils/determineMatchPoints';
import determineOpponentsWin from '@/utils/determineOpponentsWin';
import React, { useMemo } from 'react';
import Link from 'next/link';

const Table = () => {
    const { data } = useData();

    const sortedData = useMemo(() => {
        return data.slice().sort((a, b) => {
            const pointsA = determineMatchPoints(
                determineMatchRecord(a.orders),
            );
            const pointsB = determineMatchPoints(
                determineMatchRecord(b.orders),
            );
            if (pointsA !== pointsB) {
                return pointsB - pointsA;
            }
            return a.name.localeCompare(b.name);
        });
    }, [data]);

    return (
        <div className='select-none'>
            <h2 className='mb-4 font-bold text-3xl'>Masters Division</h2>
            <table className='w-full min-w-full'>
                <thead>
                    <tr className='text-left border w-full'>
                        <th className='p-2 border hidden md:table-cell'>
                            Standing
                        </th>
                        <th className='p-2 border'>Name</th>
                        <th className='p-2 border'>Order</th>
                        <th className='p-2 text-center border hidden sm:table-cell'>
                            Flight
                        </th>
                        <th className='p-2 border hidden md:table-cell text-center'>
                            Drop Round
                        </th>
                        <th className='p-2 border text-center hidden md:table-cell'>
                            Match Record
                        </th>
                        <th className='p-2 border text-center hidden sm:table-cell'>
                            Match Points
                        </th>
                        <th className='p-2 border hidden lg:table-cell text-right'>
                            <span
                                className='cursor-pointer'
                                title='Randomly generated, chill.'>
                                Opponents' Win %
                            </span>
                        </th>
                        <th className='p-2 border hidden lg:table-cell text-right'>
                            <span
                                className='cursor-pointer'
                                title='Randomly generated, chill.'>
                                Opponents' Opponent Win %
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className='w-full'>
                    {sortedData.map((player, index) => (
                        <tr
                            key={index}
                            className='text-left border hover:bg-slate-50'>
                            <td className='p-2 border text-center hidden md:table-cell'>
                                {index + 1}
                            </td>
                            <td
                                className={`p-2 border ${index <= 3 ? 'font-bold' : ''} w-2/5 md:w-auto`}>
                                <Link
                                    href={`/${player.name.split(' ')[0]}`}
                                    className='cursor-pointer'
                                    prefetch>
                                    {player.name}
                                </Link>
                            </td>
                            <td className='p-2 border w-3/5 md:w-auto'>
                                {(
                                    player.orders.length
                                    && Date.now()
                                        - player.orders[
                                            player.orders.length - 1
                                        ].date
                                        < 12 * 60 * 60 * 1000
                                ) ?
                                    player.orders[player.orders.length - 1].name
                                :   ''}
                            </td>
                            <td className='p-2 border hidden sm:table-cell text-center'>
                                {player.emoji}
                            </td>
                            <td className='p-2 border hidden md:table-cell text-center'>
                                N/A
                            </td>
                            <td className='p-2 border text-center hidden md:table-cell'>
                                {determineMatchRecord(player.orders).join('/')}
                            </td>
                            <td className='p-2 border text-center hidden sm:table-cell'>
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
            <span className='text-xs mt-4 block ml-2 lg:hidden'>
                More content available on a larger screen.
            </span>
        </div>
    );
};

export default Table;
