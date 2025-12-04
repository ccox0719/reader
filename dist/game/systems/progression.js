import { portfolioValue } from "./portfolioSystem.js";
export const UNLOCK_THRESHOLDS = [
    { value: 5000, tool: "sectorView" },
    { value: 15000, tool: "options" },
    { value: 40000, tool: "insiderTips" },
];
export const checkUnlocks = (state) => {
    const value = portfolioValue(state);
    for (const threshold of UNLOCK_THRESHOLDS) {
        if (value > threshold.value && !state.discoveredTools.includes(threshold.tool)) {
            state.discoveredTools.push(threshold.tool);
        }
    }
};
