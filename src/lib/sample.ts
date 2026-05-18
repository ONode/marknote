

// Sample markdown with Mermaid diagram for demonstration
const SAMPLE_MARKDOWN = `# Markdown VIEWER AND TESTER
A simple markdown viewer and tester with Mermaid diagram support.
## Features
- **Markdown Editing**: Write and edit Markdown content.
- **Mermaid Diagrams**: Render Mermaid diagrams directly within the Markdown.
- **Real-time Preview**: See the rendered Markdown and diagrams as you type.
- **Import/Export**: Load and save your Markdown files.
## Usage    
To use this markdown viewer and tester, simply type your Markdown content in the editor on the left. The rendered output will appear on the right, including any Mermaid diagrams you include.

### TESTING SYMBOL:
- **Consensus Layer**: Validates and orders transactions in the DAG via proof-of-stake or similar, ensuring acyclic integrity.
- **CLOB**: Off-chain or in-memory order book for matching buy/sell orders; outputs matched trades to the risk engine.
- **Risk Engine**: Processes post-match data:
  - Update user positions and compute PNL (e.g., \\( \\text{PNL} = (\\text{current_price} - \\text{entry_price}) \\times \\text{position_size} \\)).
  - Check liquidation thresholds (e.g., if margin ratio < 1.1, trigger liquidation).
  - Portfolio management: Aggregate assets, risks, and bucket IDs (e.g., low/medium/high risk buckets).
  - Bucket ID: A categorization (e.g., hash-based or exposure-based ID) for grouping similar risk profiles.
- **DAG Network**: Transactions as vertices, dependencies as edges. Shards form sub-DAGs with cross-shard links.
- **Nodes**: Heterogeneous with sizes \\( s_i \\) (normalized, \\( \\sum s_i = 1 \\)), representing capacity.



The well known Pythagorean theorem \\(x^2 + y^2 = z^2\\) was 
proved to be invalid for other exponents. 
Meaning the next equation has no integer solutions:

\\( x^n + y^n = z^n \\)

\\[
\\text{Spread} = \\text{Ask1} - \\text{Bid1}, \\quad \\text{% Spread} = \\frac{\\text{Ask1} - \\text{Bid1}}{(\\text{Ask1} + \\text{Bid1}) / 2} \\times 100
\\]

#### Formula
- **Standard Spread**:  
  \\[
  \\text{Spread} = \\text{Ask1} - \\text{Bid1}, \\quad \\text{% Spread} = \\frac{\\text{Ask1} - \\text{Bid1}}{(\\text{Ask1} + \\text{Bid1}) / 2} \\times 100
  \\]


    
\`\`\`javascript
const highlight = "code";
\`\`\`

- Write and edit Markdown content
- Render Mermaid diagrams inside your Markdown
- Preview the rendered content in real-time
- Import and export your Markdown files

## Example Mermaid Diagram

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[Continue]
\`\`\`


## Sequence Diagram Example

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\`\`\`
### Primitives to Prevent Oracle Manipulation and Liquidation Cascades in DeFi Perps

The XPL incident on Hyperliquid (August 2025) exemplifies a classic oracle manipulation attack: Whales exploited a low-liquidity spot market (Zebra DEX on Arbitrum) to inflate XPL's price ~8x with just $184K in WETH, polluting Hyperliquid's oracle feed and triggering a 200% perp price spike. This wiped $130M+ in open interest (OI), netting attackers ~$47.5M while liquidating even low-leverage hedgers (e.g., one user lost $2.5M at 1x). Similar to the JELLY event (March 2025), where whales pumped spot prices via CEXs like Bybit, leading to $12M+ HLP losses and a forced delisting, it highlights DeFi perps' vulnerability to "sunlight attacks"—transparent, rule-compliant manipulations enabled by shallow liquidity, single-source oracles, and high leverage.

Yes, there are established **on-chain** and **off-chain primitives** to mitigate this. These aren't foolproof (e.g., TWAP can still lag in flash events), but they raise manipulation costs exponentially, reduce cascade risks, and align with your DEX's ADL focus (e.g., by stabilizing OI before triggers). Below, I categorize them, with examples from post-2025 implementations. Hyperliquid itself announced upgrades post-XPL: capping mark prices at 10x the 8-hour EMA, integrating external perp data (e.g., from Binance/Bybit), and liquidity incentives—directly addressing the incident.

#### On-Chain Primitives
These embed defenses in smart contracts or protocol logic, leveraging transparency for verifiability but adding gas costs.

| Primitive | Description & How It Prevents Incidents | Examples & Effectiveness |
|-----------|-----------------------------------------|--------------------------|
| **TWAP (Time-Weighted Average Price)** | Averages prices over a window (e.g., 30min-8hr) from DEX pools/AMMs, smoothing spikes from flash buys. Raises manipulation cost by requiring sustained pumps. | Uniswap v3/v4 oracles; Ormer (2025 arXiv paper) uses TWAP + median for gas-efficient feeds from multiple DEXs. Post-XPL, Hyperliquid added 8hr EMA caps. Reduced Mango Markets (2022) exploits by 70% in similar setups. |
| **Truncated/Resistance Oracles** | Hooks limit price impact of large trades (e.g., ignore >10% moves in a block), using statistical fences (e.g., 90-110% bounds). Pauses markets if breached. | Uniswap v4 Truncated Oracle Hook (2023, enhanced 2025); dYdX v4 uses TWAP + Uniswap/MakerDAO medians with fences. Prevents "pollution" like XPL's spot pump. |
| **Multi-Oracle Aggregation & Medianizers** | Combines feeds from 5+ sources (e.g., DEXs, CEX APIs via relayers), taking weighted medians to outlier-reject manipulated data. | Chainlink Data Streams (2025 updates aggregate CEX/DEX); Paradex (Starknet) uses Pyth + Chainlink medians. Hyperliquid's post-JELLY weights: Binance (3x), Bybit/OKX (2x each). Cut oracle attacks by 80% in 2024-2025 audits. |
| **Dynamic Circuit Breakers** | Auto-pauses trading/liquidations if volatility > threshold (e.g., 20% in 5min), with on-chain voting to resume. | Aster DEX's Hidden Orders + breakers (2025); GMX v2 uses OI-based pauses. Stopped JELLY-style cascades; integrates with ADL to delay deleveraging. |
| **ZK-Proof Privacy Layers** | Hides order books/positions via zero-knowledge (e.g., dark pools) until execution, preventing "liquidation maps." | QuBitDEX's ZK-compatible L1 (as in your articles); Paradex's order cancellation in ADL. Reduces sniper attacks like XPL's transparent queue. |

#### Off-Chain Primitives
These use external computation/monitoring for speed, often fed on-chain via oracles, but introduce centralization risks (e.g., relayer trust).

| Primitive | Description & How It Prevents Incidents | Examples & Effectiveness |
|-----------|-----------------------------------------|--------------------------|
| **Funding Rates (Dynamic)** | Periodic payments between longs/shorts to anchor perps to spot (e.g., 0.01% every 8hr). Penalizes skewed OI, discouraging pumps that trigger cascades. | Hyperliquid/Bybit: Rates spike during imbalances (e.g., +0.1%/hr post-XPL). dYdX v4 adjusts dynamically. Balanced OI in 60% of 2025 perp events, reducing manipulation incentives. |
| **ADL Enhancements (Proactive)** | Early/socialized deleveraging at OI skews (e.g., 15%) or oracle deviations, before full cascades. LP-favoring variants (your design) shield liquidity. | Hyperliquid's post-incident ADL: Matches at capped prices; Bluefin (SUI) uses quantile ranking + insurance vaults. Prevented $20M in Hyperliquid's HLP losses. |
| **Liquidity Incentives & OI Caps** | Rewards MMs/LPs for depth (e.g., rebates for >1% book); caps per-user OI (e.g., 5%) to block whale dominance. | Hyperliquid's 2025 rewards (post-XPL: external perp integration); Aster's maker rebates. Raised manipulation costs 5-10x in low-liq markets. |
| **AI/Real-Time Risk Engines** | Off-chain ML monitors anomalies (e.g., volume spikes), triggering on-chain pauses or oracle overrides. | QuBitDEX's native AI layer (article mention); Chainlink's 2025 Automation for alerts. Detected 75% of 2025 oracle attempts pre-execution. |
| **Hybrid CEX Feeds** | Off-chain aggregation from high-liq CEXs (e.g., Binance depth) as oracle baselines, with on-chain verification. | Hyperliquid's post-XPL: Incorporates Binance/Bybit perps if available; OKX's TRON DEX uses CEX TWAP. Bypassed XPL's spot-only pollution. |

### Key Insights & Recommendations for Your DEX
- **ADL Synergy**: Your LP-favoring ADL (with OI imbalance triggers) pairs perfectly with TWAP/multi-oracles—e.g., delay ranking until post-TWAP confirmation, sparing LPs in cascades. Add dynamic funding to preempt skews.
- **Trade-Offs**: On-chain (e.g., TWAP) ensures decentralization but lags (~30s); off-chain (e.g., AI) is faster but needs trust-minimized relayers (your gasless DAG fits).
- **Post-2025 Trends**: Incidents like XPL/JELLY drove 40% adoption of hybrid oracles (Chainlink reports). For low-liq assets, enforce min-liquidity checks before listing perps.
- **Limitations**: No primitive is absolute—e.g., sustained attacks (multi-hour pumps) can still breach TWAP. Combine 3-4 (e.g., TWAP + caps + ADL) for layered defense.

For your DAG-blockless setup, integrate TWAP via engine-side aggregation (low gas) and test against XPL sims. If you want code sketches (e.g., Python TWAP sim) or deeper on one primitive, let me know!
`;

export { SAMPLE_MARKDOWN };