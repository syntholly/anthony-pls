const determineOpponentsWin = (name, opponentsOpponents = false) => {
    const date = new Date();
    const day = date.getDate();

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    }

    const combined = Math.abs((hash ^ (day * 173)) % 10000);

    let normalized = 40 + (combined % 61) + ((combined >> 3) % 10) - 5;

    if (opponentsOpponents) {
        const modifier = ((hash * 17) % 31) - 15;
        normalized += modifier;
    }

    // Scale from [40, 100] to [40, 80]
    normalized = 40 + (normalized - 40) * (40 / 60);

    return parseFloat(normalized.toFixed(2));
};

export default determineOpponentsWin;
