const determineMatchPoints = (matchRecord) => {
    const [wins, losses, draws] = matchRecord;
    return wins * 3 + draws * 1;
};

export default determineMatchPoints;
