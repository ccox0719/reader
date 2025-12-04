import { createSeededRng } from "./rng.js";
import { CONFIG, getDifficultyMode } from "./config.js";
import { computeArtifactEffects } from "./artifactEffects.js";
import { generateArtifactPool } from "../generators/artifactGen.js";
import { generateCompany } from "../generators/companyGen.js";
import { generateEras } from "../generators/eraGen.js";
import { generateSectors } from "../generators/sectorGen.js";
export const createInitialState = (seed, providedRng, options = {}) => {
    const runSeed = seed ?? Date.now();
    const rng = providedRng ?? createSeededRng(runSeed);
    const difficulty = options.difficulty ?? getDifficultyMode();
    const artifactEffects = options.artifactEffects ?? computeArtifactEffects(generateArtifactPool());
    const sectors = generateSectors();
    const targetCompanyCount = Math.max(CONFIG.COMPANY_COUNT, sectors.length);
    const coreCompanies = sectors.map((sector) => generateCompany(rng, sectors, sector));
    const remainingCompaniesCount = Math.max(0, targetCompanyCount - coreCompanies.length);
    const additionalCompanies = Array.from({ length: remainingCompaniesCount }, () => generateCompany(rng, sectors));
    const companies = [...coreCompanies, ...additionalCompanies];
    const baseCash = CONFIG.START_CASH * difficulty.modifiers.startingCashMultiplier;
    const startingCash = Number((baseCash * (1 + artifactEffects.startingCashBonus)).toFixed(2));
    const baseEventChance = CONFIG.DAILY_EVENT_CHANCE * difficulty.modifiers.eventMultiplier;
    const eventChance = Math.min(1, baseEventChance * (1 + artifactEffects.eventChanceBonus));
    const volatilityMultiplier = difficulty.modifiers.volatilityMultiplier;
    const totalDays = difficulty.special?.noRunOver ? Number.MAX_SAFE_INTEGER : CONFIG.DAYS_PER_RUN;
    const eras = generateEras(rng).map((era) => ({
        ...era,
        duration: Math.max(2, era.duration - artifactEffects.eraDurationReduction),
    }));
    return {
        day: 1,
        totalDays,
        companies,
        eras,
        sectors,
        currentEraIndex: 0,
        currentEraDay: 0,
        portfolio: {
            cash: startingCash,
            holdings: {},
            debt: 0,
            marginLimit: startingCash * 0.25,
        },
        discoveredTools: [],
        eventsToday: [],
        runOver: false,
        artifacts: generateArtifactPool(),
        seed: runSeed,
        eventChance,
        volatilityMultiplier,
        difficultyId: difficulty.id,
        difficultyLabel: difficulty.label,
        artifactEffects,
        pendingChoice: null,
        watchOrders: [],
    };
};
