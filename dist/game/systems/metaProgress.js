import { awardXp, unlockArtifact as unlockMetaArtifact, setDifficulty, } from "../core/metaState.js";
export const progressXp = (meta, amount) => awardXp(meta, amount);
export const progressArtifact = (meta, artifactId) => unlockMetaArtifact(meta, artifactId);
export const changeDifficulty = (meta, difficultyId) => setDifficulty(meta, difficultyId);
