export const initializeMetaPanel = ({ container, metaState, }) => {
    const difficultyEl = container.querySelector("[data-role='meta-difficulty']");
    const artifactGrid = container.querySelector("[data-role='artifact-grid']");
    const renderArtifacts = (state) => {
        if (!artifactGrid)
            return;
        artifactGrid.innerHTML = "";
        for (const artifact of state.artifacts) {
            const card = document.createElement("div");
            card.className = `artifact-card${artifact.unlocked ? " unlocked" : ""}`;
            card.innerHTML = `
        <strong>${artifact.name}</strong>
        <p>${artifact.effect}</p>
        <small>${artifact.rarity}</small>
      `;
            artifactGrid.appendChild(card);
        }
    };
    const refresh = (state) => {
        difficultyEl && (difficultyEl.textContent = `Difficulty: ${state.difficulty}`);
        renderArtifacts(state);
    };
    refresh(metaState);
    return { refresh };
};
