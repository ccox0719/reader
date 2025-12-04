import { CONFIG } from "../core/config.js";
import eraTemplates from "../content/eraTemplates.json";
const randInt = (rng, min, max) => Math.floor(min + rng.next() * (max - min + 1));
const pickRandomEraTemplate = (rng, templates) => templates[Math.floor(rng.next() * templates.length)];
const normalizeEffects = (template) => ({
    ...template,
    global: template.global ?? template.globalTrendBias ?? 0,
});
export const generateEras = (rng) => {
    const count = randInt(rng, CONFIG.ERA_COUNT_RANGE[0], CONFIG.ERA_COUNT_RANGE[1]);
    const eras = [];
    const templates = eraTemplates;
    for (let i = 0; i < count; i += 1) {
        const template = pickRandomEraTemplate(rng, templates);
        eras.push({
            id: template.id,
            name: template.name,
            description: template.description,
            duration: Math.max(CONFIG.ERA_DURATION_RANGE[0], Math.min(CONFIG.ERA_DURATION_RANGE[1], randInt(rng, CONFIG.ERA_DURATION_RANGE[0], CONFIG.ERA_DURATION_RANGE[1]))),
            effects: normalizeEffects(template.effects),
            sectorEffects: template.sectorEffects ?? {},
            eventWeights: template.eventWeights ?? {},
            difficulty: template.difficulty,
            revealed: false,
        });
    }
    return eras;
};
