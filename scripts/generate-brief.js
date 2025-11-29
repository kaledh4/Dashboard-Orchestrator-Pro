const fs = require('fs').promises;
const path = require('path');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Your actual dashboard URLs
const DASHBOARDS = {
  crashDetector: {
    url: 'https://kaledh4.github.io/Crash_Detector/',
    name: 'Crash Detector',
    icon: '🚨',
    description: 'Market Risk Analysis',
    repo: 'https://github.com/kaledh4/Crash_Detector'
  },
  cryptoAnalytics: {
    url: 'https://kaledh4.github.io/hyper-analytical/',
    name: 'Hyper Analytical',
    icon: '₿',
    description: 'Crypto Market Intelligence',
    repo: 'https://github.com/kaledh4/hyper-analytical'
  },
  marketIntel: {
    url: 'https://kaledh4.github.io/Crypto/',
    name: 'Market Intel',
    icon: '📊',
    description: 'Systematic Risk Analysis',
    repo: 'https://github.com/kaledh4/Crypto'
  },
  economicCompass: {
    url: 'https://kaledh4.github.io/EconomicCompass/',
    name: 'Economic Compass',
    icon: '🧭',
    description: 'Macro & TASI Markets',
    repo: 'https://github.com/kaledh4/EconomicCompass'
  },
  aiRace: {
    url: 'https://kaledh4.github.io/AI_RACE_CLEAN/',
    name: 'AI Race',
    icon: '🤖',
    description: 'Scientific Breakthroughs',
    repo: 'https://github.com/kaledh4/AI_RACE_CLEAN'
  },
  intelligencePlatform: {
    url: 'https://kaledh4.github.io/Intelligence_Platform/',
    name: 'Intelligence Platform',
    icon: '🎯',
    description: 'Unified Strategic Intelligence',
    repo: 'https://github.com/kaledh4/Intelligence_Platform'
  }
};

async function fetchDashboardData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Dashboard-Orchestrator/1.0'
      }
    });
    if (!response.ok) return null;
    const html = await response.text();
    return extractRelevantData(html);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }

  // DXY
  const dxyMatch = html.match(/DXY.*?([\d.]+)/i);
  if (dxyMatch) data.dxy = dxyMatch[1];

  // Fear & Greed
  const fearMatch = html.match(/Fear.*?(\d+)/i);
  if (fearMatch) data.fearGreed = fearMatch[1];

  // Composite Risk
  const compositeMatch = html.match(/Composite Risk.*?([\d.]+)/i);
  if (compositeMatch) data.compositeRisk = compositeMatch[1];

  return data;
}

async function generateAIBrief(dashboardData, timestamp) {
  const prompt = `You are a senior quantitative analyst and market intelligence strategist. Analyze the following multi-dashboard data and provide a comprehensive daily intelligence brief for ${timestamp}.

DASHBOARD DATA SUMMARY:
${JSON.stringify(dashboardData, null, 2)}

Your analysis must be structured as follows:

# 📊 Executive Summary
Provide 3-4 sentences capturing the most critical market dynamics across crypto, macro, and AI/tech sectors.

# 🎯 Market Risk Assessment
**Composite Risk Score Analysis:**
- Current risk level and trajectory
- Key stress indicators (USD/JPY, MOVE Index, Treasury Yields)
- Cross-market correlation signals

# ₿ Crypto Market Deep Dive
**Bitcoin & Ethereum:**
- Price positioning vs. 20-Week SMA and Bull/Bear Bands
- Risk metrics and momentum indicators
- ETH/BTC ratio implications
- Altcoin market structure (VXV, APT, ADA, NEAR)

**Sentiment & Technical:**
- Fear & Greed Index interpretation
- RSI levels and oversold/overbought conditions
- Support and resistance levels for next 24-48 hours

# 🌍 Macro Environment
**Dollar & Rates:**
- DXY strength/weakness and crypto correlation
- Fed Funds Rate positioning
- 10Y-2Y yield curve implications

**Traditional Markets:**
- S&P 500 momentum and risk-on/risk-off signals
- Gold price action as safe-haven indicator
- Oil and commodity trends
- TASI performance and regional dynamics

# 🤖 AI & Technology Intelligence
**Key Breakthroughs:**
- Vision-Language-Action (VLA) models and robotics
- Quantum computing advances (LDPC, FPGA)
- Materials science innovations (superconductors, twistronics)
- Cross-domain applications

**Investment Implications:**
- Tech stocks with AI exposure
- Semiconductor sector opportunities
- Emerging technology plays

# 🇸🇦 TASI & Regional Opportunities
Analyze TASI positioning relative to:
- Oil price movements
- Global risk appetite
- Regional geopolitical factors
- Sector-specific opportunities (Ma'aden, SABIC, Aramco, ACWA Power, STC)

# 🎯 Actionable Trading Strategies
**Position Recommendations:**
1. **ACCUMULATE / HOLD / DISTRIBUTE** - with specific reasoning
2. Entry points and target levels
3. Stop-loss recommendations
4. Position sizing guidance

**Immediate Actions (Next 24 Hours):**
- Specific trades to consider
- Levels to watch
- Risk management adjustments

# ⚠️ Risk Factors & Watchlist
**Top 5 Risks:**
1. [Risk with probability estimate]
2. [Risk with probability estimate]
3. [Risk with probability estimate]
4. [Risk with probability estimate]
5. [Risk with probability estimate]

**Key Events This Week:**
- Economic data releases
- FOMC meetings or policy decisions
- Geopolitical developments
- Crypto-specific catalysts

# 📈 Probability-Weighted Scenarios
**Bullish Case (X% probability):**
- Triggers and target levels

**Base Case (X% probability):**
- Expected range and dynamics

**Bearish Case (X% probability):**
- Warning signs and downside targets

# 🔮 24-Hour Outlook
Precise predictions for:
- BTC price range
- Major crypto movements
- Macro event impacts
- Key technical levels

---

**CRITICAL REQUIREMENTS:**
1. Use actual numbers and specific levels (not vague terms)
2. Provide actionable insights with clear entry/exit points
3. Include probability estimates for major scenarios
4. Cross-reference signals across dashboards
5. Highlight divergences or confirmations between data sources
6. Be concise but comprehensive - aim for 800-1200 words
7. Use markdown formatting with clear sections
8. Bold key insights and numbers
9. NO generic advice - everything must be specific to TODAY'S data

Begin your analysis now.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/kaledh4/Dashboard-Orchestrator-Pro',
        'X-Title': 'Dashboard Orchestrator Pro'
      },
      body: JSON.stringify({
        model: 'tngtech/tng-r1t-chimera:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Generation Error:', error);
    return generateFallbackBrief(dashboardData);
  }
}

function generateFallbackBrief(dashboardData) {
  return `# 📊 Executive Summary

Market data aggregated from 6 dashboards. AI analysis temporarily unavailable.

## Key Metrics
${JSON.stringify(dashboardData, null, 2)}

Please check individual dashboards for detailed analysis.`;
}

function generateHTML(brief, timestamp) {
  const dateStr = new Date(timestamp).toLocaleDateString('en-US', {
    if('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => console.log('ServiceWorker registration successful'))
          .catch(err => console.log('ServiceWorker registration failed: ', err));
      });
    }
    </script >
  </div >
</body >
</html > `;
}

async function main() {
  console.log('🚀 Starting Dashboard Orchestrator Pro...');
  console.log('⏰ Run time:', new Date().toISOString());

  const timestamp = new Date().toISOString();
  const dateStr = timestamp.split('T')[0];

  // Fetch all dashboard data
  console.log('\n📊 Fetching dashboard data...');
  const dashboardData = {};

  for (const [key, dashboard] of Object.entries(DASHBOARDS)) {
    console.log(`  • Fetching ${ dashboard.name }...`);
    dashboardData[key] = await fetchDashboardData(dashboard.url);
    if (dashboardData[key]) {
      console.log(`    ✓ Success`);
    } else {
      console.log(`    ✗ Failed`);
    }
  }

  // Generate AI brief
  console.log('\n🤖 Generating AI analysis...');
  const brief = await generateAIBrief(dashboardData, timestamp);
  console.log('  ✓ AI analysis complete');

  // Generate HTML page
  console.log('\n📝 Generating HTML page...');
  const html = generateHTML(brief, timestamp);

  // Save to index.html
  await fs.writeFile('index.html', html, 'utf8');
  console.log('  ✓ Saved to index.html');

  // Save brief as markdown for archival
  const briefsDir = path.join(__dirname, '..', 'briefs');
  await fs.mkdir(briefsDir, { recursive: true });
  await fs.writeFile(
    path.join(briefsDir, `brief - ${ dateStr }.md`),
    `# Daily Intelligence Brief - ${ dateStr } \n\n${ brief } `,
    'utf8'
  );
  console.log(`  ✓ Archived to briefs / brief - ${ dateStr }.md`);

  console.log('\n✅ Dashboard Orchestrator Pro completed successfully!');
  console.log(`📍 View your dashboard at: https://kaledh4.github.io/Dashboard-Orchestrator-Pro/`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
