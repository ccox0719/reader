import { buyAtPrice, sellAtPrice } from "./portfolioSystem.js";
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const getLimitBuyFillPrice = (range, triggerPrice) => {
    const minAllowed = Math.min(range.open, range.low);
    const maxAllowed = Math.max(range.open, triggerPrice);
    return clamp(triggerPrice, minAllowed, maxAllowed);
};
const getLimitSellFillPrice = (range, triggerPrice) => {
    const minAllowed = Math.min(range.open, triggerPrice);
    const maxAllowed = Math.max(range.open, range.high);
    return clamp(triggerPrice, minAllowed, maxAllowed);
};
const getStopLossFillPrice = (range, triggerPrice) => {
    if (range.low <= triggerPrice && range.open < triggerPrice) {
        return Math.max(range.low, triggerPrice * 0.9);
    }
    return Math.min(triggerPrice, range.open);
};
export const placeLimitBuyWatch = (state, companyId, triggerPrice, maxCashToSpend, timeInForce = "good-till-run") => {
    const order = {
        id: crypto.randomUUID(),
        companyId,
        type: "limit-buy",
        triggerPrice,
        maxCashToSpend,
        timeInForce,
        createdDay: state.day,
    };
    state.watchOrders.push(order);
    return order;
};
export const placeLimitSellWatch = (state, companyId, triggerPrice, sharesToSell, timeInForce = "good-till-run") => {
    const order = {
        id: crypto.randomUUID(),
        companyId,
        type: "limit-sell",
        triggerPrice,
        sharesToSell,
        timeInForce,
        createdDay: state.day,
    };
    state.watchOrders.push(order);
    return order;
};
export const placeStopLossWatch = (state, companyId, triggerPrice, sharesToSell, timeInForce = "good-till-run") => {
    const order = {
        id: crypto.randomUUID(),
        companyId,
        type: "stop-loss",
        triggerPrice,
        sharesToSell,
        timeInForce,
        createdDay: state.day,
    };
    state.watchOrders.push(order);
    return order;
};
export const cancelWatchOrder = (state, orderId) => {
    state.watchOrders = state.watchOrders.filter((order) => order.id !== orderId);
};
export const processWatchOrdersForDay = (state) => {
    const remaining = [];
    for (const order of state.watchOrders) {
        const company = state.companies.find((item) => item.id === order.companyId);
        const range = company?.todayRange;
        const expired = order.timeInForce === "day" && order.createdDay < state.day;
        if (expired) {
            continue;
        }
        if (!company || !range?.generated) {
            if (order.timeInForce === "good-till-run") {
                remaining.push(order);
            }
            continue;
        }
        const hit = range.low <= order.triggerPrice && range.high >= order.triggerPrice;
        if (!hit) {
            if (order.timeInForce === "day" && order.createdDay === state.day) {
                continue;
            }
            remaining.push(order);
            continue;
        }
        const fillPrice = order.type === "limit-buy"
            ? getLimitBuyFillPrice(range, order.triggerPrice)
            : order.type === "limit-sell"
                ? getLimitSellFillPrice(range, order.triggerPrice)
                : getStopLossFillPrice(range, order.triggerPrice);
        if (order.type === "limit-buy") {
            const spend = order.maxCashToSpend ?? state.portfolio.cash;
            buyAtPrice(state, company.ticker, fillPrice, spend);
        }
        else if (order.type === "limit-sell") {
            const shares = order.sharesToSell ?? Math.floor(state.portfolio.holdings[company.ticker] ?? 0);
            sellAtPrice(state, company.ticker, fillPrice, shares);
        }
        else if (order.type === "stop-loss") {
            const shares = order.sharesToSell ?? Math.floor(state.portfolio.holdings[company.ticker] ?? 0);
            sellAtPrice(state, company.ticker, fillPrice, shares);
        }
    }
    state.watchOrders = remaining;
};
