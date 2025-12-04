import adjectives from "../content/adjectives.json";
const DEFAULT_NOUNS = [
    "Holdings",
    "Networks",
    "Ventures",
    "Fusion",
    "Collective",
    "Synth",
    "Grid",
    "Pulse"
];
const DEFAULT_TICKER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
 * Utility: pick a random element from the list using the seeded RNG.
 */
const pickRandom = (list, rng) => list[Math.floor(rng.next() * list.length)];
/**
  * Build the adjective pool by combining sector branding and the global adjectives.
  */
const getAdjectivePool = (branding) => [
    ...(branding?.adjectives ?? []),
    ...adjectives,
];
/**
  * Build the noun pool by combining sector branding and the default nouns.
  */
const getNounPool = (branding) => [
    ...(branding?.nouns ?? []),
    ...DEFAULT_NOUNS,
];
/**
  * Generates a company name in the format:
  *   "<Adjective> <Noun> <Number>[-Sector]"
  */
export const generateName = (rng, branding, sectorLabel) => {
    const adjective = pickRandom(getAdjectivePool(branding), rng);
    const noun = pickRandom(getNounPool(branding), rng);
    const suffix = Math.floor(rng.next() * 999);
    const sectorHint = sectorLabel ? `-${sectorLabel}` : "";
    return `${adjective} ${noun} ${suffix}${sectorHint}`;
};
/**
  * Generates a simple 3–4 letter ticker symbol using uppercase letters.
  */
export const generateTicker = (rng) => {
    const len = 3 + Math.floor(rng.next() * 2);
    let ticker = "";
    for (let i = 0; i < len; i += 1) {
        const idx = Math.floor(rng.next() * DEFAULT_TICKER_CHARS.length);
        ticker += DEFAULT_TICKER_CHARS[idx];
    }
    return ticker;
};
