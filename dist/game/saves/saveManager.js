const RUN_SAVE_KEY = "rogue-market-run";
export const saveRun = (state) => {
    const payload = { state, updatedAt: Date.now() };
    localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(payload));
};
export const loadRun = () => {
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    if (!raw)
        return null;
    try {
        const payload = JSON.parse(raw);
        return payload.state;
    }
    catch {
        localStorage.removeItem(RUN_SAVE_KEY);
        return null;
    }
};
export const clearRun = () => {
    localStorage.removeItem(RUN_SAVE_KEY);
};
