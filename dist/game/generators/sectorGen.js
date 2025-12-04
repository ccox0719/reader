import sectorsJson from "../content/baseSectors.json";
const weightedPick = (rng, items) => {
    const totalWeight = items.reduce((sum, candidate) => sum + candidate.weight, 0);
    let threshold = rng.next() * totalWeight;
    for (const candidate of items) {
        threshold -= candidate.weight;
        if (threshold <= 0) {
            return candidate;
        }
    }
    return items[items.length - 1];
};
export const generateSectors = () => [...sectorsJson];
export const pickSector = (rng, sectors) => weightedPick(rng, sectors);
