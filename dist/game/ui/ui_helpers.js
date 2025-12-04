export const formatCurrency = (value) => `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
export const formatChange = (value) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(2)}`;
};
export const createListItem = (content) => {
    const item = document.createElement("li");
    item.textContent = content;
    return item;
};
