import {
  artifactDefinitions,
  ArtifactDefinition,
  ArtifactEffectDescriptor,
  Rarity,
} from "../content/artifacts.js";

export type { ArtifactDefinition, ArtifactEffectDescriptor, Rarity };

export interface Artifact extends ArtifactDefinition {
  unlocked: boolean;
}

export const artifactLibrary = artifactDefinitions as ArtifactDefinition[];

export const generateArtifactPool = (): Artifact[] =>
  artifactLibrary.map((entry) => ({
    ...entry,
    unlocked: false,
  }));

export const findArtifactDefinition = (id: string): ArtifactDefinition | undefined =>
  artifactLibrary.find((artifact) => artifact.id === id);
