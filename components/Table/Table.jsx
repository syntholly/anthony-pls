'use client';

import {useData} from '@/providers/DataProvider';
import determineMatchRecord from '@/utils/determineMatchRecord';
import determineMatchPoints from '@/utils/determineMatchPoints';
import determineOpponentsWin from '@/utils/determineOpponentsWin';
import React, {useMemo} from 'react';
import Link from 'next/link';

const Table = () => {
    const {data} = useData();

    const sortedData = useMemo(() => {
        return data.slice().sort((a, b) => {
            const pointsA = determineMatchPoints(determineMatchRecord(a.orders));
            const pointsB = determineMatchPoints(determineMatchRecord(b.orders));
            if (pointsA !== pointsB) {
                return pointsB - pointsA;
            }
            const oppWinA = determineOpponentsWin(a.name, false);
            const oppWinB = determineOpponentsWin(b.name, false);
            return oppWinB - oppWinA;
        });
    }, [data]);

    return (
        <div className="select-none">
            <h2 className="mb-4 text-3xl font-bold">Masters Division</h2>
            <table className="w-full min-w-full">
                <thead>
                    <tr className="w-full border text-left">
                        <th className="hidden border p-2 md:table-cell">Standing</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Order</th>
                        <th className="hidden border p-2 text-center sm:table-cell">Flight</th>
                        <th className="hidden border p-2 text-center md:table-cell">Drop Round</th>
                        <th className="hidden border p-2 text-center md:table-cell">Match Record</th>
                        <th className="hidden border p-2 text-center sm:table-cell">Match Points</th>
                        <th className="hidden border p-2 text-right lg:table-cell">
                            <span className="cursor-pointer" title="Randomly generated, chill.">
                                Opponents' Win %
                            </span>
                        </th>
                        <th className="hidden border p-2 text-right lg:table-cell">
                            <span className="cursor-pointer" title="Randomly generated, chill.">
                                Opponents' Opponent Win %
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody className="w-full">
                    {sortedData.map((player, index) => (
                        <tr key={index} className="border text-left hover:bg-slate-50">
                            <td className="hidden border p-2 text-center md:table-cell">{index + 1}</td>
                            <td className={`border p-2 ${index <= 3 ? 'font-bold' : ''} w-2/5 md:w-auto`}>
                                <Link href={`/${player.name.split(' ')[0]}`} className="cursor-pointer" prefetch>
                                    {player.name}
                                </Link>
                            </td>
                            <td className="w-3/5 border p-2 md:w-auto">
                                {player.orders.length &&
                                Date.now() - player.orders[player.orders.length - 1].date < 12 * 60 * 60 * 1000
                                    ? player.orders[player.orders.length - 1].name
                                    : ''}
                            </td>
                            <td className="hidden border p-2 text-center sm:table-cell">{player.emoji}</td>
                            <td className="hidden border p-2 text-center md:table-cell">N/A</td>
                            <td className="hidden border p-2 text-center md:table-cell">
                                {determineMatchRecord(player.orders).join('/')}
                            </td>
                            <td className="hidden border p-2 text-center sm:table-cell">
                                {determineMatchPoints(determineMatchRecord(player.orders))}
                            </td>
                            <td className="hidden border p-2 text-right lg:table-cell">
                                {determineOpponentsWin(player.name, false).toFixed(2)}%
                            </td>
                            <td className="hidden border p-2 text-right lg:table-cell">
                                {determineOpponentsWin(player.name, true).toFixed(2)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <span className="ml-2 mt-4 block text-xs lg:hidden">More content available on a larger screen.</span>
        </div>
    );
};

export default Table;
