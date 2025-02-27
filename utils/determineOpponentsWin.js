const determineOpponentsWin = (name, opponentsOpponents = false) => {
    const date = new Date();
    const day = date.getDate();

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff; // Better hash mixing
    }

    // Spread out values better
    const combined = Math.abs((hash ^ (day * 173)) % 10000); // Larger spread

    // Normalize to [40, 100] with better variance
    let normalized = 40 + (combined % 61) + ((combined >> 3) % 10) - 5;

    if (opponentsOpponents) {
        const modifier = ((hash * 17) % 31) - 15; // Slightly bigger spread in modifier
        normalized += modifier;
    }

    // Ensure within range and format to 2 decimal places
    normalized = Math.max(40, Math.min(100, normalized));

    return parseFloat(normalized.toFixed(2));
};

export default determineOpponentsWin;
