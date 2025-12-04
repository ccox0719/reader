import { calculateEventShock } from "./eventSystem.js";
const randRange = (rng, min, max) => min + (max - min) * rng.next();
const randNormal = (rng, mean = 0, deviation = 1) => {
    let u = 0;
    let v = 0;
    while (u === 0) {
        u = rng.next();
    }
    while (v === 0) {
        v = rng.next();
    }
    const standard = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return standard * deviation + mean;
};
const buildIntradayRange = (rng, open, close, volatility, eraIntraday) => {
    const baseSwing = Math.max(Math.abs(close - open), volatility * open * 0.3);
    const extraSwing = baseSwing * (0.5 + rng.next() * 0.7);
    const highPadding = open * eraIntraday * 0.03 * rng.next();
    const lowPadding = open * eraIntraday * 0.02 * rng.next();
    const rawHigh = Math.max(open, close) + extraSwing + highPadding;
    const rawLow = Math.max(0.05, Math.min(open, close) - extraSwing - lowPadding);
    return {
        open,
        high: Number(Math.max(rawHigh, close).toFixed(2)),
        low: Number(Math.min(rawLow, close).toFixed(2)),
        close: Number(close.toFixed(2)),
        generated: true,
    };
};
export const updatePrices = (state, events, rng) => {
    const era = state.eras[state.currentEraIndex];
    const macro = era?.effects?.global ?? 0;
    const eraVolatility = era?.effects?.volatilityMultiplier ?? 1;
    const eraIntraday = era?.effects?.intradayRangeMultiplier ?? 1;
    for (const company of state.companies) {
        const open = company.price;
        const trend = company.trendBias;
        const eventEffects = events
            .map((event) => event.effects)
            .filter(Boolean);
        const companyTrendDelta = eventEffects.reduce((sum, effects) => sum + (effects?.companyTrendBiasDelta ?? 0), 0);
        const sectorTrendDelta = eventEffects.reduce((sum, effects) => sum + (effects?.sectorTrendBiasDelta ?? 0), 0);
        const volatilityBoost = eventEffects.reduce((product, effects) => product * (effects?.volatilityMultiplier ?? 1), 1);
        const adjustedVolatility = company.volatility *
            state.volatilityMultiplier *
            eraVolatility *
            volatilityBoost;
        const noise = randNormal(rng, 0, adjustedVolatility);
        const randomFactor = randRange(rng, -company.randomness * eraIntraday, company.randomness * eraIntraday);
        const eventShock = calculateEventShock(company, events, {
            negativeImpactMultiplier: state.artifactEffects.negativeEventMultiplier,
        });
        const sectorBonus = company.sector === "Energy" ? state.artifactEffects.energyBonus : 0;
        const sectorEffect = era?.sectorEffects?.[company.sector] ?? 0;
        const pct = trend +
            companyTrendDelta +
            sectorTrendDelta +
            noise +
            randomFactor +
            macro +
            eventShock +
            sectorBonus +
            sectorEffect;
        const updatedPrice = Math.max(0.1, open * (1 + pct));
        const close = Number(updatedPrice.toFixed(2));
        company.todayRange = buildIntradayRange(rng, open, close, adjustedVolatility, eraIntraday);
        company.price = close;
        company.history.push(company.price);
    }
};
