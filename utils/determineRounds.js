const determineRounds = () => {
    const date = new Date();
    const sum = date.getDate() + (date.getMonth() + 1) + date.getFullYear();
    return (sum % 4) + 5;
};

export default determineRounds;
