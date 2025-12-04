import { createInitialState } from "./state.js";
import { createSeededRng } from "./rng.js";
import { runDailyEvents } from "../systems/eventSystem.js";
import { updatePrices } from "../systems/priceSystem.js";
import { checkUnlocks } from "../systems/progression.js";
import { advanceEraProgress, getCurrentEra } from "../systems/eraSystem.js";
import { portfolioValue } from "../systems/portfolioSystem.js";
import { saveRun } from "../saves/saveManager.js";
import { saveMeta } from "../saves/metaSave.js";
import { defaultMetaState, recordRunOutcome, setDifficulty, } from "./metaState.js";
import { progressArtifact } from "../systems/metaProgress.js";
import { computeArtifactEffects } from "./artifactEffects.js";
import { getDifficultyMode } from "./config.js";
import { processWatchOrdersForDay } from "../systems/watchOrders.js";
const ARTIFACT_UNLOCK_TIERS = [
    { value: 5000, artifactId: "neon_compass" },
    { value: 15000, artifactId: "rumor_network" },
    { value: 40000, artifactId: "solar_mirrors" },
];
export class GameRunner {
    constructor(options = {}) {
        this.finalised = false;
        this.rng = createSeededRng(options.seed);
        this.metaState = options.metaState ?? defaultMetaState;
        if (options.difficultyOverride) {
            this.metaState = setDifficulty(this.metaState, options.difficultyOverride);
        }
        this.difficulty = getDifficultyMode(this.metaState.difficulty);
        this.onMetaUpdate = options.onMetaUpdate;
        this.onSave = options.onSave;
        const artifactEffects = computeArtifactEffects(this.metaState.artifacts);
        this.state = createInitialState(options.seed, this.rng, {
            difficulty: this.difficulty,
            artifactEffects,
        });
        this.state.artifacts = this.metaState.artifacts;
        this.state.artifactEffects = artifactEffects;
        if (this.state.eras.length > 0) {
            this.state.eras[0].revealed = true;
        }
        saveRun(this.state);
        saveMeta(this.metaState);
    }
    step(days = 1) {
        for (let i = 0; i < days; i += 1) {
            if (this.state.runOver && this.finalised)
                break;
            this.runDay();
            if (this.state.pendingChoice) {
                break;
            }
            if (this.state.runOver) {
                break;
            }
        }
    }
    runDay() {
        if (this.state.runOver)
            return;
        const era = this.state.eras[this.state.currentEraIndex];
        const eventMultiplier = era?.effects?.eventFrequencyMultiplier ?? 1;
        const weightedChance = this.state.eventChance * eventMultiplier;
        const events = runDailyEvents(this.state, this.rng, weightedChance, era?.eventWeights);
        if (this.state.pendingChoice) {
            return;
        }
        this.completeDay(events);
    }
    resolveChoice(accept) {
        if (!this.state.pendingChoice)
            return;
        this.state.pendingChoice.choiceAccepted = accept;
        this.state.pendingChoice = null;
        this.completeDay(this.state.eventsToday);
    }
    completeDay(events) {
        updatePrices(this.state, events, this.rng);
        processWatchOrdersForDay(this.state);
        checkUnlocks(this.state);
        advanceEraProgress(this.state);
        this.state.day += 1;
        saveRun(this.state);
        this.onSave?.(this.state);
        this.checkArtifactUnlocks();
        if (!this.difficulty.special?.noRunOver &&
            this.state.day > this.state.totalDays) {
            this.state.runOver = true;
        }
        if (this.state.runOver && !this.finalised) {
            this.finalizeRun();
        }
    }
    checkArtifactUnlocks() {
        const value = this.getPortfolioValue();
        for (const tier of ARTIFACT_UNLOCK_TIERS) {
            if (value < tier.value)
                continue;
            const alreadyUnlocked = this.metaState.artifacts.some((artifact) => artifact.id === tier.artifactId && artifact.unlocked);
            if (alreadyUnlocked)
                continue;
            this.metaState = progressArtifact(this.metaState, tier.artifactId);
            saveMeta(this.metaState);
            this.notifyMetaChange();
        }
    }
    finalizeRun() {
        this.finalised = true;
        const value = this.getPortfolioValue();
        const xpGain = Math.floor(value / 100);
        this.metaState = recordRunOutcome(this.metaState, xpGain, value);
        saveMeta(this.metaState);
        this.notifyMetaChange();
    }
    notifyMetaChange() {
        if (this.onMetaUpdate) {
            this.onMetaUpdate(this.metaState);
        }
    }
    currentEraName() {
        return getCurrentEra(this.state)?.name ?? "Unknown";
    }
    getPortfolioValue() {
        return portfolioValue(this.state);
    }
    summary() {
        const totalDays = this.state.totalDays === Number.MAX_SAFE_INTEGER ? "∞" : this.state.totalDays;
        return `${this.state.day}/${totalDays} · ${this.currentEraName()} · ${this.getPortfolioValue().toFixed(2)} cash`;
    }
}
