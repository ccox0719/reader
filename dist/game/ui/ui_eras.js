import { createListItem } from "./ui_helpers.js";
export const renderEraList = (container, eras, currentIndex) => {
    if (!container)
        return;
    container.innerHTML = "";
    eras.forEach((era, index) => {
        const trend = era.effects.global ?? 0;
        const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(3)}`;
        const description = era.description ? ` — ${era.description}` : "";
        const item = createListItem(`${era.name} · ${era.duration}d · Trend ${trendLabel}${description}`);
        if (index === currentIndex) {
            item.classList.add("active-era");
        }
        container.appendChild(item);
    });
};
