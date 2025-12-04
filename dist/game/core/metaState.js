import artifacts from "../content/baseArtifacts.json";
import { CONFIG } from "./config.js";
const DEFAULT_DIFFICULTY = CONFIG.DEFAULT_DIFFICULTY;
const baseArtifacts = artifacts;
const buildArtifactPool = () => baseArtifacts.map((definition) => ({
    ...definition,
    unlocked: false,
}));
const calculateLevelFromXp = (xp) => {
    return Math.max(1, Math.ceil(Math.sqrt(xp / 100)) + 1);
};
export const defaultMetaState = {
    xp: 0,
    level: 1,
    artifacts: buildArtifactPool(),
    sectorsUnlocked: [],
    difficulty: DEFAULT_DIFFICULTY,
    totalRuns: 0,
    bestReturn: 0,
};
export const awardXp = (meta, amount) => {
    const xp = Math.max(0, meta.xp + amount);
    const level = calculateLevelFromXp(xp);
    return { ...meta, xp, level };
};
export const unlockArtifact = (meta, artifactId) => {
    const artifacts = meta.artifacts.map((artifact) => artifact.id === artifactId ? { ...artifact, unlocked: true } : artifact);
    return { ...meta, artifacts };
};
export const recordRunOutcome = (meta, xpGained, portfolioReturn) => {
    const updatedMeta = awardXp(meta, xpGained);
    const bestReturn = Math.max(meta.bestReturn, portfolioReturn);
    return {
        ...updatedMeta,
        bestReturn,
        totalRuns: meta.totalRuns + 1,
    };
};
export const setDifficulty = (meta, difficultyId) => ({
    ...meta,
    difficulty: difficultyId,
});
