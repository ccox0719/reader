import { executeTrade } from "../systems/portfolioSystem.js";
import { placeLimitBuyWatch, placeLimitSellWatch, placeStopLossWatch, cancelWatchOrder, } from "../systems/watchOrders.js";
import { drawSparkline, drawPieChart } from "../charts/miniChart.js";
import { formatCurrency } from "./ui_helpers.js";
import { refreshHoldingsPanel, populateTickerOptions } from "./ui_portfolio.js";
import { renderEventList } from "./ui_events.js";
import { renderEraList } from "./ui_eras.js";
import { initializeMetaPanel } from "./ui_meta.js";
export const initializeUI = (runner, container, options = {}) => {
    container.classList.add("game-grid");
    container.innerHTML = `
    <section class="panel meta-panel" data-panel="meta">
      <header class="panel-header">
        <h2>Meta Progression</h2>
        <button type="button" class="panel-toggle" aria-expanded="true"><span>Hide</span></button>
      </header>
      <div class="panel-body">
        <div class="meta-heading">
          <h3>Progression</h3>
          <p class="meta-detail" data-role="meta-difficulty"></p>
        </div>
        <p class="meta-note">Artifacts unlock between runs and alter the pace.</p>
        <div class="difficulty-section">
          <p class="meta-note">Select a difficulty to queue for the next run.</p>
          <div class="difficulty-grid" data-role="difficulty-grid"></div>
        </div>
        <div class="artifact-grid" data-role="artifact-grid"></div>
      </div>
    </section>

    <section class="panel summary-panel" data-panel="summary">
      <header class="panel-header">
        <h2>Run Summary</h2>
        <button type="button" class="panel-toggle" aria-expanded="true"><span>Hide</span></button>
      </header>
      <div class="panel-body">
        <div class="summary-graph-row summary-graph-row--primary">
          <div class="summary-graph summary-graph--sparkline">
            <p class="summary-graph-label">Portfolio trajectory</p>
            <canvas width="260" height="220" data-role="summary-chart"></canvas>
          </div>
          <div class="summary-graph summary-graph--timeline">
            <p class="summary-graph-label">Era timeline</p>
            <canvas width="220" height="160" data-role="summary-era-timeline"></canvas>
          </div>
        </div>
        <div class="summary-graph-row summary-graph-row--secondary">
          <div class="summary-graph summary-graph--distribution">
            <p class="summary-graph-label">Sector exposure</p>
            <canvas width="180" height="200" data-role="summary-distribution"></canvas>
          </div>
          <div class="summary-graph summary-graph--pie">
            <div class="summary-graph-label-row">
              <p class="summary-graph-label">Active triggers</p>
              <button type="button" class="summary-trigger-button" data-action="open-watch">Triggers</button>
            </div>
            <canvas width="140" height="160" data-role="summary-watch-pie"></canvas>
          </div>
        </div>
        <div class="summary-strip">
          <span data-role="summary-strip-day"></span>
          <span data-role="summary-strip-era"></span>
          <span data-role="summary-strip-progress"></span>
          <span data-role="summary-strip-cash"></span>
          <span data-role="summary-strip-margin"></span>
          <span data-role="summary-strip-best"></span>
          <span data-role="summary-strip-xp"></span>
          <span data-role="summary-strip-level"></span>
        </div>
      </div>
    </section>

    <section class="panel eras-panel" data-panel="eras">
      <header class="panel-header">
        <h2>Eras</h2>
        <button type="button" class="panel-toggle" aria-expanded="true"><span>Hide</span></button>
      </header>
      <div class="panel-body">
        <ul data-role="era-list"></ul>
      </div>
    </section>

    <div class="choice-modal" data-role="choice-modal" hidden>
      <div class="choice-content">
        <h3>Opportunity</h3>
        <p data-role="choice-description"></p>
        <div class="choice-actions">
          <button type="button" data-action="choice-act">Act</button>
          <button type="button" data-action="choice-ignore">Ignore</button>
        </div>
      </div>
    </div>

    <section class="panel buy-panel" data-panel="buy">
      <header class="panel-header">
        <h2>Buy Window</h2>
        <div class="panel-header-actions">
          <span class="autosave-status" data-role="autosave-status">Autosaved day 42 · 03:01 PM</span>
          <button type="button" class="panel-toggle" aria-expanded="true"><span>Hide</span></button>
        </div>
      </header>
      <div class="panel-body">
        <div class="time-row">
          <button type="button" data-action="advance-1">Advance 1 Day</button>
          <button type="button" data-action="advance-5">Advance 5 Days</button>
        </div>
        <div class="stock-card">
          <div class="stock-card__header">
            <div>
              <p class="stock-card__label" data-role="selected-info"></p>
              <div class="ohlc-row" data-role="ohlc-chips"></div>
            </div>
            <div class="stock-card__price">
              <span class="price" data-role="selected-price"></span>
              <span class="pct" data-role="selected-change">0.00%</span>
            </div>
          </div>
          <div class="stock-card__chart">
            <canvas width="360" height="200" data-role="company-chart"></canvas>
          </div>
        </div>
        <div class="stats-card">
          <h3>Stats</h3>
          <div class="stats-grid" data-role="stats-grid"></div>
        </div>
        <div class="trade-card">
          <h3>Trade</h3>
          <form class="trade-form">
            <label>
              Company
              <select name="trade-ticker"></select>
            </label>
            <div class="shares-group">
              <span>Shares: <strong data-role="slider-value">10</strong></span>
              <input type="range" name="trade-slider" min="1" max="100" value="10" />
            </div>
            <div class="trade-buttons">
              <button type="button" data-action="trade-buy" class="btn-buy">Buy</button>
              <button type="button" data-action="trade-sell" class="btn-sell">Sell</button>
            </div>
          </form>
          <p class="feedback" data-role="trade-feedback"></p>
        </div>
        <div class="trigger-card">
          <div class="trigger-card__header">
            <h3>Triggers</h3>
            <button type="button" data-action="open-watch" class="trigger-new">+ New Trigger</button>
          </div>
          <ul data-role="watch-list"></ul>
        </div>
        <div class="holdings-card">
          <div class="holdings-card__header">
            <h3>Holdings</h3>
          </div>
          <ul data-role="holdings-list"></ul>
        </div>
      </div>
    </section>
    <div class="watch-modal" data-role="watch-modal" hidden>
      <div class="watch-modal-sheet">
        <header class="watch-modal-header">
          <h3>Trigger Order</h3>
          <button type="button" data-action="watch-close">×</button>
        </header>
        <div class="watch-modal-body">
          <p class="watch-company" data-role="watch-company">Select a company to watch</p>
          <label class="watch-field" data-watch="type">
            Order type
            <select name="watch-type">
              <option value="limit-buy">Limit Buy</option>
              <option value="limit-sell">Limit Sell</option>
              <option value="stop-loss">Stop Loss</option>
            </select>
          </label>
          <label class="watch-field" data-watch="price">
            Trigger price
            <input type="number" name="watch-price" min="0.01" step="0.01" />
          </label>
          <label class="watch-field" data-watch="cash">
            Max cash to spend
            <input type="number" name="watch-cash" min="1" step="0.01" />
          </label>
          <label class="watch-field" data-watch="shares">
            Shares
            <input type="number" name="watch-shares" min="1" step="1" />
          </label>
          <label class="watch-field" data-watch="time">
            Time in force
            <select name="watch-tif">
              <option value="good-till-run">Good-till-run</option>
              <option value="day">Today only</option>
            </select>
          </label>
          <div class="watch-actions">
            <button type="button" data-action="watch-save">Save trigger</button>
            <button type="button" data-action="watch-cancel">Cancel</button>
          </div>
          <p class="watch-feedback" data-role="watch-feedback"></p>
        </div>
      </div>
    </div>
  `;
    const summaryStripDay = container.querySelector("[data-role='summary-strip-day']");
    const summaryStripEra = container.querySelector("[data-role='summary-strip-era']");
    const summaryStripProgress = container.querySelector("[data-role='summary-strip-progress']");
    const summaryStripCash = container.querySelector("[data-role='summary-strip-cash']");
    const summaryStripMargin = container.querySelector("[data-role='summary-strip-margin']");
    const summaryStripBest = container.querySelector("[data-role='summary-strip-best']");
    const summaryStripXp = container.querySelector("[data-role='summary-strip-xp']");
    const summaryStripLevel = container.querySelector("[data-role='summary-strip-level']");
    const summaryChart = container.querySelector("[data-role='summary-chart']");
    const summaryDistribution = container.querySelector("[data-role='summary-distribution']");
    const summaryEraTimeline = container.querySelector("[data-role='summary-era-timeline']");
    const summaryWatchPie = container.querySelector("[data-role='summary-watch-pie']");
    const eraList = container.querySelector("[data-role='era-list']");
    const eventList = container.querySelector("[data-role='event-list']");
    const holdingsList = container.querySelector("[data-role='holdings-list']");
    const chartCanvas = container.querySelector("[data-role='company-chart']");
    const selectedInfo = container.querySelector("[data-role='selected-info']");
    const selectedPriceEl = container.querySelector("[data-role='selected-price']");
    const selectedChangeEl = container.querySelector("[data-role='selected-change']");
    const ohlcChipsContainer = container.querySelector("[data-role='ohlc-chips']");
    const statsGrid = container.querySelector("[data-role='stats-grid']");
    const tradeTicker = container.querySelector("[name='trade-ticker']");
    const tradeSlider = container.querySelector("[name='trade-slider']");
    const sliderValueDisplay = container.querySelector("[data-role='slider-value']");
    const choiceModal = container.querySelector("[data-role='choice-modal']");
    const choiceDescription = container.querySelector("[data-role='choice-description']");
    const choiceAct = container.querySelector("[data-action='choice-act']");
    const choiceIgnore = container.querySelector("[data-action='choice-ignore']");
    const tradeFeedback = container.querySelector("[data-role='trade-feedback']");
    const autosaveStatus = container.querySelector("[data-role='autosave-status']");
    const controlButtons = container.querySelectorAll("[data-action='advance-1'], [data-action='advance-5'], [data-action='trade-buy'], [data-action='trade-sell']");
    const watchList = container.querySelector("[data-role='watch-list']");
    const openWatchButton = container.querySelector("[data-action='open-watch']");
    const watchModal = container.querySelector("[data-role='watch-modal']");
    const watchCompanyLabel = container.querySelector("[data-role='watch-company']");
    const watchTypeSelect = container.querySelector("[name='watch-type']");
    const watchPriceInput = container.querySelector("[name='watch-price']");
    const watchCashInput = container.querySelector("[name='watch-cash']");
    const watchSharesInput = container.querySelector("[name='watch-shares']");
    const watchTifSelect = container.querySelector("[name='watch-tif']");
    const watchSaveButton = container.querySelector("[data-action='watch-save']");
    const watchCancelButton = container.querySelector("[data-action='watch-cancel']");
    const watchCloseButton = container.querySelector("[data-action='watch-close']");
    const watchFeedback = container.querySelector("[data-role='watch-feedback']");
    const watchFieldCash = container.querySelector("[data-watch='cash']");
    const watchFieldShares = container.querySelector("[data-watch='shares']");
    const metaPanelContainer = container.querySelector(".meta-panel");
    let currentMeta = options.metaState ?? runner.metaState;
    let selectedTicker = undefined;
    const summaryHistory = [];
    const WATCH_ORDER_COLORS = {
        "limit-buy": "#00C853",
        "limit-sell": "#FF5252",
        "stop-loss": "#4FC3F7",
    };
    const metaPanel = metaPanelContainer
        ? initializeMetaPanel({
            container: metaPanelContainer,
            metaState: currentMeta,
        })
        : null;
    const renderSummaryGraph = () => {
        if (!summaryChart)
            return;
        drawSparkline(summaryChart, summaryHistory.slice(-40));
    };
    const getSectorDistribution = () => {
        const buckets = {};
        let total = 0;
        for (const [ticker, shares] of Object.entries(runner.state.portfolio.holdings)) {
            const company = runner.state.companies.find((item) => item.ticker === ticker);
            if (!company || shares <= 0) {
                continue;
            }
            const value = shares * company.price;
            total += value;
            buckets[company.sector] = (buckets[company.sector] ?? 0) + value;
        }
        const entries = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
        const colors = ["#4FC3F7", "#00C853", "#FF5252", "#2C323B"];
        const segments = [];
        for (let i = 0; i < entries.length; i += 1) {
            if (segments.length >= 4)
                break;
            segments.push({
                value: entries[i][1],
                color: colors[i % colors.length],
            });
        }
        if (entries.length > 4) {
            const rest = entries.slice(4).reduce((sum, [, value]) => sum + value, 0);
            if (rest > 0) {
                segments.push({
                    value: rest,
                    color: "#607D8B",
                });
            }
        }
        return { total, segments };
    };
    const renderSectorDistribution = () => {
        if (!summaryDistribution)
            return;
        const { segments } = getSectorDistribution();
        drawPieChart(summaryDistribution, segments);
    };
    const renderEraTimeline = () => {
        if (!summaryEraTimeline)
            return;
        const ctx = summaryEraTimeline.getContext("2d");
        if (!ctx)
            return;
        const width = summaryEraTimeline.width;
        const height = summaryEraTimeline.height;
        ctx.clearRect(0, 0, width, height);
        const eras = runner.state.eras;
        if (eras.length === 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "#9fb7ff";
            ctx.font = "11px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Era timeline unavailable", width / 2, height / 2 + 4);
            return;
        }
        const totalDuration = Math.max(1, eras.reduce((sum, era) => sum + era.duration, 0));
        const barHeight = Math.floor(height * 0.24);
        const barTop = height / 2 - barHeight / 2;
        const gap = 4;
        let cursor = 0;
        const currentIdx = Math.min(runner.state.currentEraIndex, eras.length - 1);
        // draw base track
        ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
        ctx.fillRect(0, barTop, width, barHeight);
        eras.forEach((era, index) => {
            const widthPortion = ((era.duration / totalDuration) * width) - gap;
            const segmentLeft = cursor + gap / 2;
            const fillStyle = index < currentIdx
                ? "rgba(79, 195, 247, 0.4)"
                : index === currentIdx
                    ? "rgba(0, 200, 83, 0.85)"
                    : "rgba(255, 255, 255, 0.05)";
            ctx.fillStyle = fillStyle;
            ctx.fillRect(segmentLeft, barTop, Math.max(1, widthPortion), barHeight);
            cursor += (era.duration / totalDuration) * width;
        });
        const currentEra = eras[currentIdx];
        if (currentEra) {
            const beforeDuration = eras
                .slice(0, currentIdx)
                .reduce((sum, era) => sum + era.duration, 0);
            const progressDays = Math.min(currentEra.duration, runner.state.currentEraDay + 1);
            const markerX = ((beforeDuration + progressDays) / totalDuration) * width;
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(0, 200, 83, 0.9)";
            ctx.beginPath();
            ctx.moveTo(markerX, barTop);
            ctx.lineTo(markerX, barTop + barHeight);
            ctx.stroke();
            ctx.fillStyle = "#00C853";
            ctx.beginPath();
            ctx.arc(markerX, barTop + barHeight + 6, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    };
    const renderWatchPie = () => {
        if (!summaryWatchPie)
            return;
        const watchBuckets = {
            "limit-buy": 0,
            "limit-sell": 0,
            "stop-loss": 0,
        };
        for (const order of runner.state.watchOrders) {
            watchBuckets[order.type] += 1;
        }
        const segments = Object.entries(watchBuckets)
            .filter(([, value]) => value > 0)
            .map(([type, value]) => ({
            value,
            color: WATCH_ORDER_COLORS[type],
        }));
        drawPieChart(summaryWatchPie, segments, runner.state.watchOrders.length > 0 ? "Trigger mix" : "No triggers");
    };
    const refreshSummary = () => {
        const totalDaysLabel = runner.state.totalDays === Number.MAX_SAFE_INTEGER ? "∞" : runner.state.totalDays;
        if (summaryStripDay) {
            summaryStripDay.textContent = `Day ${runner.state.day}/${totalDaysLabel}`;
        }
        if (summaryStripEra) {
            summaryStripEra.textContent = `Era ${runner.currentEraName()}`;
        }
        const value = runner.getPortfolioValue();
        summaryHistory.push(value);
        if (summaryHistory.length > 60) {
            summaryHistory.shift();
        }
        renderSummaryGraph();
        renderSectorDistribution();
        renderEraTimeline();
        renderWatchPie();
        if (summaryStripProgress) {
            const era = runner.state.eras[runner.state.currentEraIndex];
            const duration = era?.duration ?? 0;
            const progress = Math.min(duration, runner.state.currentEraDay + 1);
            summaryStripProgress.textContent = era
                ? `Progress ${progress}/${duration}`
                : "Progress unknown";
        }
        if (summaryStripCash) {
            summaryStripCash.textContent = `Cash ${formatCurrency(runner.state.portfolio.cash)}`;
        }
        const holdingsValue = Math.max(0, value - runner.state.portfolio.cash);
        const limit = runner.state.portfolio.marginLimit;
        const marginUsage = limit > 0 ? Math.min(100, (holdingsValue / limit) * 100) : 0;
        if (summaryStripMargin) {
            summaryStripMargin.textContent = limit > 0 ? `Margin ${marginUsage.toFixed(0)}%` : "Margin n/a";
        }
        if (summaryStripBest) {
            summaryStripBest.textContent = `Best ${formatCurrency(runner.metaState.bestReturn)}`;
        }
        if (summaryStripXp) {
            summaryStripXp.textContent = `XP ${runner.metaState.xp}`;
        }
        if (summaryStripLevel) {
            summaryStripLevel.textContent = `Level ${runner.metaState.level}`;
        }
    };
    const updateSliderValueDisplay = () => {
        if (tradeSlider && sliderValueDisplay) {
            sliderValueDisplay.textContent = tradeSlider.value;
        }
    };
    const renderCompanyChart = () => {
        if (!chartCanvas)
            return;
        const company = runner.state.companies.find((item) => item.ticker === selectedTicker);
        if (!company) {
            if (selectedInfo) {
                selectedInfo.textContent = "Select a company from the dropdown to view its sparkline.";
            }
            chartCanvas.getContext("2d")?.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
            return;
        }
        drawSparkline(chartCanvas, company.history.slice(-40));
        if (selectedInfo) {
            selectedInfo.textContent = `${company.name} · ${company.ticker}`;
        }
        const previous = company.history[company.history.length - 2] ?? company.price;
        const changePct = previous === 0 ? 0 : (company.price - previous) / previous;
        const changeLabel = changePct >= 0 ? `+${(changePct * 100).toFixed(2)}%` : `${(changePct * 100).toFixed(2)}%`;
        if (selectedPriceEl) {
            selectedPriceEl.textContent = formatCurrency(company.price);
        }
        if (selectedChangeEl) {
            selectedChangeEl.textContent = changeLabel;
            selectedChangeEl.classList.toggle("green", changePct >= 0);
            selectedChangeEl.classList.toggle("red", changePct < 0);
        }
        if (ohlcChipsContainer) {
            ohlcChipsContainer.innerHTML = "";
            const range = company.todayRange;
            if (range) {
                const chips = [
                    `O:${range.open.toFixed(2)}`,
                    `H:${range.high.toFixed(2)}`,
                    `L:${range.low.toFixed(2)}`,
                    `C:${range.close.toFixed(2)}`,
                ];
                for (const chip of chips) {
                    const span = document.createElement("span");
                    span.className = "ohlc-chip";
                    span.textContent = chip;
                    ohlcChipsContainer.appendChild(span);
                }
            }
        }
    };
    const formatPercent = (value) => {
        const sign = value >= 0 ? "+" : "";
        return `${sign}${(value * 100).toFixed(2)}%`;
    };
    const calculateVolatility = (history) => {
        if (history.length < 2)
            return 0;
        const returns = history.slice(1).map((price, index) => {
            const last = history[index];
            return last === 0 ? 0 : (price - last) / last;
        });
        const avg = returns.reduce((sum, value) => sum + value, 0) / returns.length;
        const variance = returns.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / returns.length;
        return Math.sqrt(variance);
    };
    const refreshCompanyStats = () => {
        const company = runner.state.companies.find((item) => item.ticker === selectedTicker);
        if (!company) {
            if (statsGrid) {
                statsGrid.innerHTML = "<div>No company selected.</div>";
            }
            return;
        }
        if (!statsGrid)
            return;
        const recentHistory = company.history.slice(-5);
        const average = recentHistory.reduce((sum, price) => sum + price, 0) / recentHistory.length;
        const previous = company.history[company.history.length - 2] ?? company.history[0];
        const changePct = previous === 0 ? 0 : (company.price - previous) / previous;
        const volatility = calculateVolatility(company.history.slice(-10));
        const entries = [
            { label: "5-day avg", value: formatCurrency(Number(average.toFixed(2))) },
            { label: "Volatility", value: formatPercent(volatility) },
            { label: "Trend impact", value: formatPercent(company.trendBias + volatility * 0.5) },
            { label: "5-day change", value: formatPercent((company.price - recentHistory[0]) / recentHistory[0] || 0) },
            { label: "Δ day", value: formatPercent(changePct) },
        ];
        statsGrid.innerHTML = "";
        for (const entry of entries) {
            const row = document.createElement("div");
            row.className = "stats-row";
            const valueSpan = document.createElement("span");
            valueSpan.className = "stats-value";
            if (entry.label === "Volatility" || entry.label === "Δ day" || entry.label === "5-day change") {
                valueSpan.classList.add(entry.value.startsWith("-") ? "red" : "green");
            }
            valueSpan.textContent = entry.value;
            row.innerHTML = `<span class="stats-label">${entry.label}</span>`;
            row.appendChild(valueSpan);
            statsGrid.appendChild(row);
        }
    };
    const refreshSelectedCompany = () => {
        renderCompanyChart();
        refreshCompanyStats();
    };
    const getCompanyByTicker = (ticker) => runner.state.companies.find((company) => company.ticker === ticker);
    const getMaxBuyQuantity = (company) => Math.floor(runner.state.portfolio.cash / (company?.price ?? 1));
    const getMaxSellQuantity = (company) => company ? runner.state.portfolio.holdings[company.ticker] ?? 0 : 0;
    const updateTradeSliderLimits = () => {
        if (!tradeTicker || !tradeSlider)
            return;
        const company = getCompanyByTicker(tradeTicker.value);
        if (!company)
            return;
        const maxBuy = Math.max(1, getMaxBuyQuantity(company));
        const maxSell = Math.max(1, getMaxSellQuantity(company));
        const limit = Math.max(maxBuy, maxSell, 1);
        tradeSlider.max = limit.toString();
        if (Number(tradeSlider.value) > limit) {
            tradeSlider.value = limit.toString();
            updateSliderValueDisplay();
        }
    };
    const refreshEras = () => {
        renderEraList(eraList, runner.state.eras, runner.state.currentEraIndex);
    };
    const refreshEvents = () => {
        renderEventList(eventList, runner.state.eventsToday);
    };
    const handleHoldingSelect = (ticker) => {
        selectedTicker = ticker;
        if (tradeTicker) {
            tradeTicker.value = ticker;
        }
        refreshSelectedCompany();
        updateTradeSliderLimits();
    };
    const refreshHoldings = () => {
        refreshHoldingsPanel(holdingsList, runner.state.portfolio, runner.state.companies, selectedTicker, handleHoldingSelect);
    };
    const watchTypeLabels = {
        "limit-buy": "Limit Buy",
        "limit-sell": "Limit Sell",
        "stop-loss": "Stop Loss",
    };
    const formatWatchTime = (value) => value === "day" ? "Today only" : "Until filled";
    const renderWatchOrders = () => {
        if (!watchList)
            return;
        watchList.innerHTML = "";
        if (runner.state.watchOrders.length === 0) {
            const scratch = document.createElement("li");
            scratch.textContent = "No triggers yet";
            scratch.className = "trigger-card__empty";
            watchList.appendChild(scratch);
            return;
        }
        for (const order of runner.state.watchOrders) {
            const company = runner.state.companies.find((item) => item.id === order.companyId);
            const entry = document.createElement("li");
            entry.className = "watch-entry";
            const info = document.createElement("div");
            info.className = "watch-entry__info";
            info.innerHTML = `
        <strong>${company?.ticker ?? "Unknown"}</strong>
        ${watchTypeLabels[order.type]} @ ${formatCurrency(order.triggerPrice)}
        <span>${formatWatchTime(order.timeInForce)}</span>
      `;
            info.addEventListener("click", () => {
                if (company) {
                    handleHoldingSelect(company.ticker);
                }
            });
            const meta = document.createElement("p");
            meta.className = "watch-entry__meta";
            const parts = [];
            if (order.maxCashToSpend) {
                parts.push(`Cash ${formatCurrency(order.maxCashToSpend)}`);
            }
            if (order.sharesToSell) {
                parts.push(`${order.sharesToSell} shares`);
            }
            meta.textContent = parts.join(" · ");
            const cancel = document.createElement("button");
            cancel.type = "button";
            cancel.className = "watch-entry__cancel";
            cancel.textContent = "Cancel";
            cancel.addEventListener("click", () => {
                cancelWatchOrder(runner.state, order.id);
                refreshAll();
            });
            entry.appendChild(info);
            if (meta.textContent) {
                entry.appendChild(meta);
            }
            entry.appendChild(cancel);
            watchList.appendChild(entry);
        }
    };
    const updateWatchFieldVisibility = () => {
        const selectedType = watchTypeSelect?.value ?? "";
        if (watchFieldCash) {
            watchFieldCash.toggleAttribute("hidden", selectedType !== "limit-buy");
        }
        if (watchFieldShares) {
            watchFieldShares.toggleAttribute("hidden", selectedType === "limit-buy");
        }
    };
    const closeWatchModal = () => {
        if (!watchModal)
            return;
        watchModal.hidden = true;
        watchModal.classList.remove("open");
        document.body.classList.remove("dialog-open");
    };
    const openWatchModal = (presetType) => {
        if (!watchModal || !watchTypeSelect || !watchPriceInput)
            return;
        const company = runner.state.companies.find((item) => item.ticker === selectedTicker) ??
            runner.state.companies[0];
        if (!company)
            return;
        selectedTicker = company.ticker;
        if (tradeTicker) {
            tradeTicker.value = company.ticker;
        }
        watchCompanyLabel && (watchCompanyLabel.textContent = `${company.name} (${company.ticker})`);
        watchPriceInput.value = company.price.toFixed(2);
        watchTypeSelect.value = presetType ?? "limit-buy";
        if (watchCashInput) {
            watchCashInput.value = Math.max(1, company.price * 2).toFixed(2);
        }
        if (watchSharesInput) {
            watchSharesInput.value = "1";
        }
        if (watchTifSelect) {
            watchTifSelect.value = "good-till-run";
        }
        watchFeedback && (watchFeedback.textContent = "");
        updateWatchFieldVisibility();
        watchModal.hidden = false;
        watchModal.classList.add("open");
        document.body.classList.add("dialog-open");
    };
    const handleWatchSave = () => {
        if (!watchTypeSelect || !watchPriceInput)
            return;
        const company = runner.state.companies.find((item) => item.ticker === selectedTicker) ??
            runner.state.companies[0];
        if (!company) {
            watchFeedback && (watchFeedback.textContent = "Choose a company first.");
            return;
        }
        const triggerPrice = Number(watchPriceInput.value);
        if (!triggerPrice || triggerPrice <= 0) {
            watchFeedback && (watchFeedback.textContent = "Enter a valid trigger price.");
            return;
        }
        const timeInForce = (watchTifSelect?.value ?? "good-till-run");
        if (watchTypeSelect.value === "limit-buy") {
            const cash = Number(watchCashInput?.value ?? "0");
            if (!cash || cash <= 0) {
                watchFeedback && (watchFeedback.textContent = "Set how much cash to spend.");
                return;
            }
            placeLimitBuyWatch(runner.state, company.id, triggerPrice, cash, timeInForce);
        }
        else if (watchTypeSelect.value === "limit-sell") {
            const shares = Number(watchSharesInput?.value ?? "0");
            if (!shares || shares <= 0) {
                watchFeedback && (watchFeedback.textContent = "Enter shares to sell.");
                return;
            }
            placeLimitSellWatch(runner.state, company.id, triggerPrice, shares, timeInForce);
        }
        else {
            const shares = Number(watchSharesInput?.value ?? "0");
            if (!shares || shares <= 0) {
                watchFeedback && (watchFeedback.textContent = "Enter shares for the stop loss.");
                return;
            }
            placeStopLossWatch(runner.state, company.id, triggerPrice, shares, timeInForce);
        }
        closeWatchModal();
        refreshAll();
    };
    const refreshTickers = () => {
        const previousSelection = selectedTicker ?? tradeTicker?.value;
        populateTickerOptions(tradeTicker, runner.state.companies);
        const fallback = runner.state.companies[0]?.ticker;
        const newSelection = runner.state.companies.some((company) => company.ticker === previousSelection)
            ? previousSelection
            : fallback;
        selectedTicker = newSelection;
        if (tradeTicker && newSelection) {
            tradeTicker.value = newSelection;
        }
        refreshSelectedCompany();
    };
    const setControlLock = (locked) => {
        controlButtons.forEach((button) => {
            button.disabled = locked;
        });
        if (tradeSlider) {
            tradeSlider.disabled = locked;
        }
        if (tradeTicker) {
            tradeTicker.disabled = locked;
        }
    };
    const refreshChoicePanel = () => {
        const pending = runner.state.pendingChoice;
        if (choiceModal) {
            choiceModal.hidden = !pending;
            choiceModal.classList.toggle("open", Boolean(pending));
        }
        if (choiceDescription) {
            if (pending) {
                choiceDescription.textContent = `${pending.description} · impact ${(pending.impact * 100).toFixed(2)}%`;
            }
            else {
                choiceDescription.textContent = "";
            }
        }
        setControlLock(Boolean(pending));
    };
    const updateSelectionFromDropdown = () => {
        if (!tradeTicker)
            return;
        selectedTicker = tradeTicker.value;
        refreshSelectedCompany();
        refreshHoldings();
    };
    const togglePanelBody = (button) => {
        const section = button.closest("section");
        if (!section)
            return;
        const body = section.querySelector(".panel-body");
        if (!body)
            return;
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        body.hidden = isExpanded;
        button.setAttribute("aria-expanded", isExpanded ? "false" : "true");
        section.classList.toggle("collapsed", isExpanded);
        const label = button.querySelector("span");
        if (label) {
            label.textContent = isExpanded ? "Show" : "Hide";
        }
    };
    const panelToggles = Array.from(container.querySelectorAll(".panel-toggle"));
    panelToggles.forEach((button) => {
        button.addEventListener("click", () => togglePanelBody(button));
    });
    const refreshMeta = () => {
        currentMeta = runner.metaState;
        metaPanel?.refresh(currentMeta);
    };
    const refreshAll = () => {
        refreshSummary();
        refreshEras();
        refreshEvents();
        refreshChoicePanel();
        refreshTickers();
        refreshHoldings();
        updateTradeSliderLimits();
        renderWatchOrders();
        refreshMeta();
        refreshSelectedCompany();
        updateSliderValueDisplay();
        options.onSummaryUpdate?.(runner.summary());
    };
    const placeTrade = (direction) => {
        if (!tradeTicker || !tradeSlider)
            return;
        const ticker = tradeTicker.value;
        const company = getCompanyByTicker(ticker);
        if (!company) {
            tradeFeedback && (tradeFeedback.textContent = "Choose a valid company.");
            return;
        }
        const sliderValue = Math.max(1, Math.floor(Number(tradeSlider.value)));
        const maxAvailable = direction === "buy" ? getMaxBuyQuantity(company) : getMaxSellQuantity(company);
        if (maxAvailable <= 0) {
            tradeFeedback &&
                (tradeFeedback.textContent =
                    direction === "buy"
                        ? "Not enough cash to buy even a single share."
                        : "You do not hold any shares.");
            return;
        }
        const quantity = Math.min(sliderValue, maxAvailable);
        if (quantity !== sliderValue) {
            tradeSlider.value = quantity.toString();
            updateSliderValueDisplay();
        }
        const clampNote = quantity !== sliderValue ? " (adjusted to max available)" : "";
        const signedQty = direction === "buy" ? quantity : -quantity;
        runner.state.portfolio = executeTrade(runner.state.portfolio, ticker, signedQty, company.price);
        selectedTicker = ticker;
        tradeFeedback &&
            (tradeFeedback.textContent = `${direction === "buy" ? "Bought" : "Sold"} ${quantity} ${ticker} shares${clampNote}.`);
        updateTradeSliderLimits();
        refreshAll();
    };
    const formatAutosave = (state) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        autosaveStatus && (autosaveStatus.textContent = `Autosaved day ${state.day} at ${timestamp}`);
    };
    container.querySelector("[data-action='advance-1']")?.addEventListener("click", () => {
        runner.step(1);
        refreshAll();
    });
    container.querySelector("[data-action='advance-5']")?.addEventListener("click", () => {
        runner.step(5);
        refreshAll();
    });
    container.querySelector("[data-action='trade-buy']")?.addEventListener("click", () => placeTrade("buy"));
    container.querySelector("[data-action='trade-sell']")?.addEventListener("click", () => placeTrade("sell"));
    tradeSlider?.addEventListener("input", updateSliderValueDisplay);
    tradeTicker?.addEventListener("change", updateSelectionFromDropdown);
    choiceAct?.addEventListener("click", () => {
        runner.resolveChoice(true);
        refreshAll();
    });
    choiceIgnore?.addEventListener("click", () => {
        runner.resolveChoice(false);
        refreshAll();
    });
    openWatchButton?.addEventListener("click", () => openWatchModal());
    watchTypeSelect?.addEventListener("change", updateWatchFieldVisibility);
    watchSaveButton?.addEventListener("click", handleWatchSave);
    watchCancelButton?.addEventListener("click", closeWatchModal);
    watchCloseButton?.addEventListener("click", closeWatchModal);
    watchModal?.addEventListener("click", (event) => {
        if (event.target === watchModal) {
            closeWatchModal();
        }
    });
    refreshAll();
    return {
        refresh: refreshAll,
        updateMeta(meta) {
            currentMeta = meta;
            refreshMeta();
        },
        updateAutosave(state) {
            formatAutosave(state);
        },
    };
};
