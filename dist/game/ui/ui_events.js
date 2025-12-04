import { createListItem } from "./ui_helpers.js";
export const renderEventList = (container, events) => {
    if (!container)
        return;
    container.innerHTML = "";
    if (events.length === 0) {
        container.appendChild(createListItem("No events today"));
        return;
    }
    for (const event of events) {
        const scope = event.sectorAffinity
            ? event.sectorAffinity
            : event.type === "global"
                ? "global"
                : event.type;
        const item = createListItem(`${event.description} · ${scope} · impact ${(event.impact * 100).toFixed(2)}%`);
        container.appendChild(item);
    }
};
