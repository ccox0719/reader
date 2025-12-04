import { formatCurrency } from "./ui_helpers.js";
export const refreshHoldingsPanel = (container, portfolio, companies, selectedTicker, onSelect) => {
    if (!container)
        return;
    container.innerHTML = "";
    const entries = Object.entries(portfolio.holdings);
    if (entries.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No positions yet — buy shares to populate holdings.";
        container.appendChild(empty);
        return;
    }
    for (const [ticker, quantity] of entries) {
        const company = companies.find((item) => item.ticker === ticker);
        const value = (company?.price ?? 0) * quantity;
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "holding-button";
        if (ticker === selectedTicker) {
            button.classList.add("selected");
        }
        button.textContent = `${ticker}: ${quantity} sh · ${formatCurrency(value)}`;
        button.addEventListener("click", () => onSelect?.(ticker));
        item.appendChild(button);
        container.appendChild(item);
    }
};
export const populateTickerOptions = (select, companies) => {
    if (!select)
        return;
    select.innerHTML = "";
    for (const company of companies) {
        const option = document.createElement("option");
        option.value = company.ticker;
        option.textContent = `${company.ticker} · ${company.name}`;
        select.appendChild(option);
    }
};
