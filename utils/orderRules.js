export const ORDER_EDIT_WINDOW_MS = 12 * 60 * 60 * 1000;

export const isRecentOrder = (timestamp, now = Date.now()) => {
    return Number.isFinite(timestamp) && now - timestamp < ORDER_EDIT_WINDOW_MS;
};

export const getLatestOrderName = (orders = [], now = Date.now()) => {
    const latestOrder = orders.at(-1);

    if (!latestOrder || !isRecentOrder(latestOrder.date, now)) {
        return '';
    }

    return latestOrder.name;
};

export const formatOrderSelection = (drinkName, toppings = []) => {
    if (!drinkName) {
        return '';
    }

    if (!toppings.length) {
        return drinkName;
    }

    return `${drinkName} + ${toppings.join(', ')}`;
};
