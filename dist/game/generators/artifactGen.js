import artifacts from "../content/baseArtifacts.json";
const baseArtifacts = artifacts;
export const generateArtifactPool = () => baseArtifacts.map((entry) => ({
    ...entry,
    unlocked: false,
}));
