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

const normalizeToppings = (toppings) => {
    if (Array.isArray(toppings)) {
        return toppings
            .filter(Boolean)
            .map((topping) => ({name: topping, quantity: 1}));
    }

    if (!toppings || typeof toppings !== 'object') {
        return [];
    }

    return Object.entries(toppings)
        .filter(([, quantity]) => Number.isFinite(quantity) && quantity > 0)
        .map(([name, quantity]) => ({name, quantity}));
};

export const formatOrderSelection = (drinkName, toppings = []) => {
    if (!drinkName) {
        return '';
    }

    const normalizedToppings = normalizeToppings(toppings);

    if (!normalizedToppings.length) {
        return drinkName;
    }

    const formattedToppings = normalizedToppings.map(({name, quantity}) => {
        return quantity > 1 ? `${quantity}x ${name}` : name;
    });

    return `${drinkName} + ${formattedToppings.join(', ')}`;
};
