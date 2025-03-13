const determineMatchRecord = (orders) => {
    const variance = 8.64e7; // one day
    const lossDifference = 6.912e8; // 8 days
    const drawDifference = 1.123e9; // 13 days

    let W = 0,
        L = 0,
        D = 0;

    for (let i = 1; i < orders.length; i++) {
        let diff = orders[i].date - orders[i - 1].date;

        if (diff <= lossDifference) {
            W++;
        } else if (diff >= lossDifference) {
            L += Math.floor(diff / lossDifference);

            if (diff >= drawDifference) {
                L--;
                D++;
            }
        }
    }

    return [W, L, D];
};

export default determineMatchRecord;
