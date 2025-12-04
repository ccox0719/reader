import { CONFIG } from "../core/config.js";
import { generateName, generateTicker } from "./nameGen.js";
import { pickSector } from "./sectorGen.js";
const randRange = (rng, min, max) => min + (max - min) * rng.next();
const buildAffinities = (rng, sectors) => {
    const affinities = {};
    for (const sector of sectors) {
        affinities[sector.name] = rng.next() * 2 - 1;
    }
    return affinities;
};
const pickCorrelations = (rng, sectors, primary) => {
    const others = sectors.map((sector) => sector.name).filter((name) => name !== primary);
    const shuffled = [...others].sort(() => rng.next() - 0.5);
    return shuffled.slice(0, 2);
};
const buildInitialRange = (price) => ({
    open: price,
    high: price,
    low: price,
    close: price,
    generated: true,
});
export const generateCompany = (rng, sectors, forcedSector) => {
    const primarySector = forcedSector ?? pickSector(rng, sectors);
    const name = generateName(rng, primarySector.branding, primarySector.name);
    const ticker = generateTicker(rng);
    const price = Number(randRange(rng, ...CONFIG.STARTING_PRICE_RANGE).toFixed(2));
    return {
        id: crypto.randomUUID(),
        name,
        ticker,
        sector: primarySector.name,
        price,
        history: [price],
        volatility: Number(randRange(rng, ...CONFIG.VOLATILITY_RANGE).toFixed(3)),
        trendBias: Number(randRange(rng, ...CONFIG.TREND_BIAS_RANGE).toFixed(4)),
        randomness: Number(randRange(rng, ...CONFIG.RANDOMNESS_RANGE).toFixed(3)),
        eventAffinity: buildAffinities(rng, sectors),
        correlations: pickCorrelations(rng, sectors, primarySector.name),
        todayRange: buildInitialRange(price),
    };
};
