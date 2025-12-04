import { defaultMetaState } from "../core/metaState.js";
const META_SAVE_KEY = "rogue-market-meta";
export const saveMeta = (meta) => {
    localStorage.setItem(META_SAVE_KEY, JSON.stringify(meta));
};
export const loadMeta = () => {
    const raw = localStorage.getItem(META_SAVE_KEY);
    if (!raw) {
        saveMeta(defaultMetaState);
        return defaultMetaState;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        saveMeta(defaultMetaState);
        return defaultMetaState;
    }
};
export const resetMeta = () => {
    saveMeta(defaultMetaState);
};
