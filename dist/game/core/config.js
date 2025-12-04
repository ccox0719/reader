import difficultyModes from "../content/difficultyModes.json";
export const CONFIG = {
    START_CASH: 1000,
    DAYS_PER_RUN: 30,
    VOLATILITY_RANGE: [0.01, 0.20],
    TREND_BIAS_RANGE: [-0.02, 0.05],
    RANDOMNESS_RANGE: [0.01, 0.10],
    DAILY_EVENT_CHANCE: 0.15,
    ERA_COUNT_RANGE: [3, 6],
    ERA_DURATION_RANGE: [3, 7],
    COMPANY_COUNT: 18,
    STARTING_PRICE_RANGE: [5, 35],
    DEFAULT_DIFFICULTY: "classic",
    DIFFICULTY_MODES: difficultyModes,
};
const difficultyMap = new Map(CONFIG.DIFFICULTY_MODES.map((entry) => [entry.id, entry]));
export const getDifficultyMode = (id) => difficultyMap.get(id ?? CONFIG.DEFAULT_DIFFICULTY) ??
    CONFIG.DIFFICULTY_MODES[0];
