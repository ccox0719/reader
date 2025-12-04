import { artifactDefinitions, } from "../content/artifacts.js";
export const artifactLibrary = artifactDefinitions;
export const generateArtifactPool = () => artifactLibrary.map((entry) => ({
    ...entry,
    unlocked: false,
}));
export const findArtifactDefinition = (id) => artifactLibrary.find((artifact) => artifact.id === id);
