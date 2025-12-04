export const artifactDefinitions = [
    {
        id: "neon_compass",
        name: "Neon Compass",
        description: "Era reveals shave off a day and feel more focused.",
        rarity: "common",
        tags: ["era", "exploration"],
        effects: {
            eraDurationReduction: 1,
        },
    },
    {
        id: "rumor_network",
        name: "Rumor Network",
        description: "Market chatter pumps event frequency slightly higher.",
        rarity: "rare",
        tags: ["events", "intel"],
        effects: {
            eventChanceBonus: 0.08,
        },
    },
    {
        id: "signal_calibrator",
        name: "Signal Calibrator",
        description: "Fine-tunes your execution, padding starting capital by a sliver.",
        rarity: "common",
        tags: ["portfolio", "cash"],
        effects: {
            startingCashBonus: 0.02,
        },
    },
    {
        id: "sector_scout",
        name: "Sector Scout",
        description: "Tells you which industries are worth paying attention to.",
        rarity: "common",
        tags: ["analysis"],
        effects: {
            predictionBonus: 0.03,
        },
    },
    {
        id: "margin_truss",
        name: "Margin Truss",
        description: "Extra breathing room on margin gives you more muscle.",
        rarity: "common",
        tags: ["portfolio"],
        effects: {
            marginLimitBonus: 0.08,
        },
    },
    {
        id: "calm_reserve",
        name: "Calm Reserve",
        description: "Small safety net that buffers negative events slightly.",
        rarity: "common",
        tags: ["events"],
        effects: {
            negativeEventMultiplier: 0.95,
        },
    },
    {
        id: "echo_scheduler",
        name: "Echo Scheduler",
        description: "Regulates the chaos so volatility feels slightly smoother.",
        rarity: "common",
        tags: ["stability"],
        effects: {
            volatilityMultiplier: 0.97,
        },
    },
    {
        id: "trading_journal",
        name: "Trading Journal",
        description: "Keeps your trigger slots tidy, freeing up a fraction of a slot.",
        rarity: "common",
        tags: ["triggers"],
        effects: {
            triggerSlotBonus: 0.3,
        },
    },
    {
        id: "solar_mirrors",
        name: "Solar Mirrors",
        description: "Energy stocks bend brighter than before.",
        rarity: "rare",
        tags: ["sector", "energy"],
        effects: {
            energyBonus: 0.12,
        },
    },
    {
        id: "pulse_calculator",
        name: "Pulse Calculator",
        description: "Tames volatility with a precise dampener.",
        rarity: "rare",
        tags: ["stability"],
        effects: {
            volatilityMultiplier: 0.92,
        },
    },
    {
        id: "insider_gloves",
        name: "Insider Gloves",
        description: "Negative shocks land softer on the portfolio.",
        rarity: "rare",
        tags: ["events"],
        effects: {
            negativeEventMultiplier: 0.85,
        },
    },
    {
        id: "quantum_drone",
        name: "Quantum Drone",
        description: "Keeps volatility ranges lit for freshly minted companies.",
        rarity: "rare",
        tags: ["analysis", "volatility"],
        effects: {
            revealVolatility: true,
        },
    },
    {
        id: "margin_sinew",
        name: "Margin Sinew",
        description: "Muscles up the collateral so you get more leverage.",
        rarity: "rare",
        tags: ["portfolio"],
        effects: {
            marginLimitBonus: 0.18,
        },
    },
    {
        id: "echo_harvesters",
        name: "Echo Harvesters",
        description: "Signals bring more events to trade around.",
        rarity: "rare",
        tags: ["events"],
        effects: {
            eventChanceBonus: 0.09,
        },
    },
    {
        id: "circuit_forge",
        name: "Circuit Forge",
        description: "Shortens the odds of correct predictions by tuning your models.",
        rarity: "rare",
        tags: ["analysis"],
        effects: {
            predictionBonus: 0.05,
        },
    },
    {
        id: "timber_index",
        name: "Timber Index",
        description: "A portfolio hack that stretches starting cash a little further.",
        rarity: "rare",
        tags: ["portfolio"],
        effects: {
            startingCashBonus: 0.05,
        },
    },
    {
        id: "vaulted_ledger",
        name: "Vaulted Ledger",
        description: "Start each run with a heftier balance.",
        rarity: "epic",
        tags: ["portfolio"],
        effects: {
            startingCashBonus: 0.15,
        },
    },
    {
        id: "solar_flare",
        name: "Solar Flare",
        description: "Energy surges are boosted even further.",
        rarity: "epic",
        tags: ["sector", "energy"],
        effects: {
            energyBonus: 0.18,
        },
    },
    {
        id: "momentum_braid",
        name: "Momentum Braid",
        description: "Rewrites your risk profile so volatility behaves differently.",
        rarity: "epic",
        tags: ["stability"],
        effects: {
            volatilityMultiplier: 0.82,
        },
    },
    {
        id: "risk_diverter",
        name: "Risk Diverter",
        description: "Strong defense lowers the impact of catastrophic news.",
        rarity: "epic",
        tags: ["events"],
        effects: {
            negativeEventMultiplier: 0.75,
        },
    },
    {
        id: "market_oracle",
        name: "Market Oracle",
        description: "Predictions are sharper and volatility peeks are visible.",
        rarity: "legendary",
        tags: ["analysis", "volatility"],
        effects: {
            predictionBonus: 0.15,
            revealVolatility: true,
        },
    },
    {
        id: "credit_phalanx",
        name: "Credit Phalanx",
        description: "Layers of credit strength beef up leverage and cash.",
        rarity: "legendary",
        tags: ["portfolio"],
        effects: {
            marginLimitBonus: 0.35,
            startingCashBonus: 0.1,
        },
    },
];
