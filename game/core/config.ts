import difficultyModes from "../content/difficultyModes.json" assert { type: "json" };

export type DifficultyModifiers = {
  startingCashMultiplier: number;
  volatilityMultiplier: number;
  eventMultiplier: number;
};

export interface DifficultyMode {
  id: string;
  label: string;
  description: string;
  modifiers: DifficultyModifiers;
  special?: Record<string, unknown>;
}

export const CONFIG = {
  START_CASH: 1_000,
  DAYS_PER_RUN: 30,
  VOLATILITY_RANGE: [0.01, 0.20] as const,
  TREND_BIAS_RANGE: [-0.02, 0.05] as const,
  RANDOMNESS_RANGE: [0.01, 0.10] as const,
  DAILY_EVENT_CHANCE: 0.15,
  ERA_COUNT_RANGE: [3, 6] as const,
  ERA_DURATION_RANGE: [3, 7] as const,
  COMPANY_COUNT: 18,
  STARTING_PRICE_RANGE: [5, 35] as const,
  DEFAULT_DIFFICULTY: "classic",
  DIFFICULTY_MODES: difficultyModes as DifficultyMode[],
};

const difficultyMap = new Map<
  DifficultyMode["id"],
  DifficultyMode
>(CONFIG.DIFFICULTY_MODES.map((entry) => [entry.id, entry]));

export const getDifficultyMode = (
  id?: DifficultyMode["id"]
): DifficultyMode =>
  difficultyMap.get(id ?? CONFIG.DEFAULT_DIFFICULTY) ??
  CONFIG.DIFFICULTY_MODES[0];
