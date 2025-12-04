export const portfolioValue = (state) => {
    const holdingsValue = Object.entries(state.portfolio.holdings).reduce((sum, [ticker, quantity]) => {
        const company = state.companies.find((item) => item.ticker === ticker);
        if (!company)
            return sum;
        return sum + company.price * quantity;
    }, 0);
    return Number((state.portfolio.cash + holdingsValue).toFixed(2));
};
export const executeTrade = (portfolio, ticker, quantity, price) => {
    const newHoldings = {
        ...portfolio.holdings,
        [ticker]: (portfolio.holdings[ticker] ?? 0) + quantity,
    };
    return {
        ...portfolio,
        cash: Number((portfolio.cash - price * quantity).toFixed(2)),
        holdings: newHoldings,
    };
};
export const buyAtPrice = (state, ticker, price, maxCashToSpend) => {
    if (price <= 0 || maxCashToSpend <= 0) {
        return 0;
    }
    const cashAvailable = Math.min(maxCashToSpend, state.portfolio.cash);
    const quantity = Math.floor(cashAvailable / price);
    if (quantity <= 0) {
        return 0;
    }
    state.portfolio = executeTrade(state.portfolio, ticker, quantity, price);
    return quantity;
};
export const sellAtPrice = (state, ticker, price, sharesToSell) => {
    const held = state.portfolio.holdings[ticker] ?? 0;
    const targetShares = Math.max(0, Math.floor(sharesToSell));
    const quantity = Math.min(held, targetShares);
    if (quantity <= 0) {
        return 0;
    }
    state.portfolio = executeTrade(state.portfolio, ticker, -quantity, price);
    return quantity;
};
