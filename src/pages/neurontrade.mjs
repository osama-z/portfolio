import { arrow, coverArt, external } from '../components/site.mjs';
import { projects } from '../content/projects.mjs';

const project = projects.find(p => p.id === 'neurontrade');
const repo = project.repository;
const source = path => `${repo}/blob/main/${path}`;

export const neurontrade = `
<section class="case-intro content-width">
  <a class="back-link" href="work.html">← Back to the work</a>
  <div class="case-meta">
    <p class="eyebrow">NEURONTRADE / PYTHON SYSTEMS</p>
    <span class="pill">${project.status} · ${project.year}</span>
  </div>
  <h1>NeuronTrade.<br><span class="serif">Measure before you trust.</span></h1>
  <div class="case-summary">
    <p>A paper trading and quantitative research system that makes the path from market data to a decision inspectable. It uses public market data, simulated fills and a local account history. Live and testnet exchange execution are disabled in this public demo.</p>
    ${external(repo, 'View the source', 'button button-dark')}
  </div>
  <div class="tags">${project.stack.map(s => `<span>${s}</span>`).join('')}<span>Backtesting</span><span>Risk controls</span></div>
</section>

<div class="case-cover color-blue section-shell">
  <div>
    <span class="eyebrow">MARKET DATA → STRATEGY → RISK → PAPER ACCOUNT</span>
    <h2>Every decision.<br><span class="serif">A traceable path.</span></h2>
    <span class="cover-caption">PUBLIC DEMO / SIMULATED EXECUTION</span>
  </div>
  <div class="neurontrade-art">${coverArt('trading')}</div>
</div>

<section class="metrics neurontrade-facts content-width" aria-label="Project scope">
  <div><strong>Paper only</strong><p>Simulated orders and fills</p><small>No exchange order execution</small></div>
  <div><strong>Shared logic</strong><p>Strategy decision pipeline</p><small>Used by backtests and paper trading</small></div>
  <div><strong>SQLite</strong><p>Local account and trade history</p><small>Supported demo storage</small></div>
</section>

<section class="case-body content-width">
  <aside aria-label="Case study sections">
    <span class="eyebrow">INSIDE THE PROJECT</span>
    <a href="#challenge">The engineering challenge</a>
    <a href="#workflow">How it works</a>
    <a href="#decisions">Engineering decisions</a>
    <a href="#research">What the research found</a>
    <a href="#verification">Verification & limits</a>
    <a href="#resources">Source & documentation</a>
  </aside>
  <div class="case-sections">
    <section id="challenge">
      <p class="eyebrow">01 / THE CHALLENGE</p>
      <h2>Make the reasoning <span class="serif">visible.</span></h2>
      <p>A convincing backtest can hide inconsistent sizing, trading costs or a strategy chosen because it happened to fit the sample. I built NeuronTrade to inspect those assumptions, follow individual decisions and compare historical simulations with paper trading.</p>
      <p>My work connects market-data ingestion, indicators, strategy decisions, position sizing, persistent risk controls, simulated execution and research tools in a modular Python system.</p>
    </section>

    <section id="workflow">
      <p class="eyebrow">02 / THE WORKFLOW</p>
      <h2>From a candle<br>to a <span class="serif">paper trade.</span></h2>
      <ol class="neurontrade-flow">
        <li><span class="eyebrow">01 / OBSERVE</span><h3>Read the market.</h3><p>Fetch public candles and calculate indicators. The default rule-based strategy needs no exchange keys or trained model.</p></li>
        <li><span class="eyebrow">02 / DECIDE</span><h3>Evaluate the signal.</h3><p>Apply shared strategy decisions across backtests and the paper loop, so the two paths can be checked for consistency.</p></li>
        <li><span class="eyebrow">03 / CHECK</span><h3>Put risk first.</h3><p>Size the position and check portfolio heat, drawdown and circuit-breaker state before admitting a paper trade.</p></li>
        <li><span class="eyebrow">04 / RECORD</span><h3>Simulate & inspect.</h3><p>Model fills, fees and slippage, then store trades and account history in SQLite for review with the status tools.</p></li>
      </ol>
    </section>

    <section id="decisions">
      <p class="eyebrow">03 / ENGINEERING DECISIONS</p>
      <h2>Small choices.<br><span class="serif">Visible consequences.</span></h2>
      <div class="results-table">
        <div><strong>Shared decisions</strong><p>A common strategy pipeline reduces drift between historical and paper paths. Matching decisions does not imply identical fills.</p></div>
        <div><strong>Persistent breakers</strong><p>A halted risk breaker survives a restart and requires an operator reset. Restarting the process does not silently clear the halt.</p></div>
        <div><strong>Decimal sizing</strong><p>Decimal-based position calculations make sizing rules explicit. Some execution, reporting and SQLite storage paths still use floats.</p></div>
        <div><strong>Enforced demo scope</strong><p>Configuration rejects <code>PAPER_TRADING=false</code>. Live and testnet executors refuse construction, and disabled command stubs exit with a failure status.</p></div>
      </div>
    </section>

    <section id="research">
      <p class="eyebrow">04 / THE RESEARCH</p>
      <h2>A promising result.<br><span class="serif">A reason to question it.</span></h2>
      <p>The recorded July 2026 time-split experiment found that a trend-following candidate’s positive older-half returns became negative in the newer half across all four pairs.</p>
      <div class="neurontrade-table-wrap" tabindex="0" role="region" aria-label="Recorded time-split results, scroll horizontally if needed">
        <table class="neurontrade-table">
          <caption>Recorded simulated returns · July 2026 experiment</caption>
          <thead><tr><th scope="col">Pair</th><th scope="col">Older half</th><th scope="col">Newer half</th></tr></thead>
          <tbody>
            <tr><th scope="row">ADA</th><td>+20.1%</td><td>−12.1%</td></tr>
            <tr><th scope="row">BTC</th><td>+11.9%</td><td>−0.9%</td></tr>
            <tr><th scope="row">XRP</th><td>+15.2%</td><td>−12.4%</td></tr>
            <tr><th scope="row">LINK</th><td>+32.3%</td><td>−12.5%</td></tr>
          </tbody>
        </table>
      </div>
      <p>The strategy was selected using the full window before the split, so this is a robustness diagnostic, not an untouched holdout. These documented results were not rerun for this page and establish no proven trading edge.</p>
      ${external(source('docs/STRATEGY_NOTES.md'), 'Read the experiment notes', 'text-link')}
    </section>

    <section id="verification">
      <p class="eyebrow">05 / VERIFICATION & LIMITS</p>
      <h2>Evidence you can <span class="serif">follow.</span></h2>
      <p>The documented local review recorded 709 passing tests with four ZeroMQ TCP tests excluded in a restricted environment. Checks cover paper-only guards, fresh example configuration, command startup, strategy consistency and risk persistence. Lint also passed.</p>
      <div class="note-box">
        <strong>What remains open</strong>
        <p>Trade updates and cash updates commit separately. A failure between them can leave inconsistent account state after a restart. Simulated fills also omit market constraints, and float storage is not exact-decimal accounting.</p>
        <p>A fresh dependency installation, external provider connectivity and a long unattended run were not verified in that review. The public project is an engineering and research demo.</p>
      </div>
      ${external(source('docs/PUBLIC_DEMO_REVIEW.md'), 'Read the review & remaining issues', 'text-link')}
    </section>

    <section id="resources">
      <p class="eyebrow">06 / EXPLORE FURTHER</p>
      <h2>Follow the <span class="serif">details.</span></h2>
      <div class="resource-links">
        ${external(repo, 'Public source & quickstart')}
        ${external(source('docs/PROJECT_GUIDE.md'), 'Project map & command guide')}
        ${external(source('docs/ARCHITECTURE.md'), 'Architecture & data flow')}
        ${external(source('docs/backtest_live_parity_design.md'), 'Backtest & paper decision parity')}
      </div>
    </section>
  </div>
</section>
<a class="next-project section-shell" href="work.html">
  <span><span class="eyebrow">MORE / FROM THE PORTFOLIO</span><h2>Keep <span class="serif">exploring.</span></h2></span>
  <span class="large-arrow">${arrow}</span>
</a>`;
