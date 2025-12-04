export const createSeededRng = (seed = Date.now()) => {
    let value = seed >>> 0;
    const next = () => {
        value ^= value << 13;
        value ^= value >>> 17;
        value ^= value << 5;
        return (value >>> 0) / 0xffffffff;
    };
    return { next };
};
