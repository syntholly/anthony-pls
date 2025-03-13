const determineJudge = (judges) => {
    const day = new Date().getDate();
    const index = (day - 1) % judges.length;
    return judges[index];
};

export default determineJudge;
