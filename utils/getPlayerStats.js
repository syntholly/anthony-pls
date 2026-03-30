import determineMatchPoints from '@/utils/determineMatchPoints';
import determineMatchRecord from '@/utils/determineMatchRecord';
import determineOpponentsWin from '@/utils/determineOpponentsWin';

const getPlayerStats = (player) => {
    const matchRecord = determineMatchRecord(player.orders);

    return {
        latestOrder: player.orders.at(-1) ?? null,
        matchPoints: determineMatchPoints(matchRecord),
        matchRecord,
        opponentsWin: determineOpponentsWin(player.name, false),
        opponentsOpponentsWin: determineOpponentsWin(player.name, true),
    };
};

export default getPlayerStats;
