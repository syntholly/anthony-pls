const determineEvent = (events) => {
    const date = new Date();
    const day = date.getDate();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${String(day).padStart(2, '0')}${month}${year}`;

    const index = (day - 1) % events.length;
    return `${events[index]}${formattedDate}`;
};

export default determineEvent;
