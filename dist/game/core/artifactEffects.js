const hasArtifact = (artifacts, id) => artifacts.some((item) => item.id === id && item.unlocked);
export const computeArtifactEffects = (artifacts) => ({
    energyBonus: hasArtifact(artifacts, "solar_mirrors") ? 0.12 : 0,
    eventChanceBonus: hasArtifact(artifacts, "rumor_network") ? 0.1 : 0,
    negativeEventMultiplier: hasArtifact(artifacts, "insider_gloves") ? 0.8 : 1,
    eraDurationReduction: hasArtifact(artifacts, "neon_compass") ? 1 : 0,
    startingCashBonus: hasArtifact(artifacts, "vaulted_ledger") ? 0.15 : 0,
    revealsVolatility: hasArtifact(artifacts, "quantum_drone"),
});
