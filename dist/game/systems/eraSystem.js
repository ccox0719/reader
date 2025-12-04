export const getCurrentEra = (state) => state.eras[state.currentEraIndex];
export const advanceEraProgress = (state) => {
    if (state.runOver)
        return;
    state.currentEraDay += 1;
    const currentEra = getCurrentEra(state);
    if (state.currentEraDay >= currentEra.duration) {
        if (state.currentEraIndex < state.eras.length - 1) {
            state.currentEraIndex += 1;
            state.currentEraDay = 0;
            state.eras[state.currentEraIndex].revealed = true;
        }
    }
};
