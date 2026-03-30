'use client';

import {useData} from '@/providers/DataProvider';
import getPlayerStats from '@/utils/getPlayerStats';
import getUserSlug from '@/utils/getUserSlug';
import {getLatestOrderName} from '@/utils/orderRules';
import React, {useMemo} from 'react';
import Link from 'next/link';

const Table = () => {
    const {data} = useData();

    const sortedData = useMemo(() => {
        const now = Date.now();

        return data
            .map((player) => ({
                player,
                stats: getPlayerStats(player),
                latestOrderName: getLatestOrderName(player.orders, now),
            }))
            .sort((a, b) => {
                if (a.stats.matchPoints !== b.stats.matchPoints) {
                    return b.stats.matchPoints - a.stats.matchPoints;
                }

                return b.stats.opponentsWin - a.stats.opponentsWin;
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
                    {sortedData.map(({player, stats, latestOrderName}, index) => (
                        <tr key={player.name} className="border text-left hover:bg-slate-50">
                            <td className="hidden border p-2 text-center md:table-cell">{index + 1}</td>
                            <td className={`w-2/5 border p-2 md:w-auto ${index <= 3 ? 'font-bold' : ''}`}>
                                <Link href={`/${getUserSlug(player.name)}`} className="cursor-pointer" prefetch>
                                    {player.name}
                                </Link>
                            </td>
                            <td className="w-3/5 border p-2 md:w-auto">{latestOrderName}</td>
                            <td className="hidden border p-2 text-center sm:table-cell">{player.emoji}</td>
                            <td className="hidden border p-2 text-center md:table-cell">N/A</td>
                            <td className="hidden border p-2 text-center md:table-cell">
                                {stats.matchRecord.join('/')}
                            </td>
                            <td className="hidden border p-2 text-center sm:table-cell">{stats.matchPoints}</td>
                            <td className="hidden border p-2 text-right lg:table-cell">
                                {stats.opponentsWin.toFixed(2)}%
                            </td>
                            <td className="hidden border p-2 text-right lg:table-cell">
                                {stats.opponentsOpponentsWin.toFixed(2)}%
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
