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
}

async function fetchYahooFinanceData() {
  const symbols = {
    'BTC-USD': 'btc',
    'ETH-USD': 'eth',
    'DX-Y.NYB': 'dxy',
    'GC=F': 'gold',
    '^GSPC': 'sp500',
    'CL=F': 'oil'
  };

  const data = {};

  for (const [symbol, key] of Object.entries(symbols)) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (response.ok) {
        const json = await response.json();
        const quote = json.chart?.result?.[0]?.meta;
        if (quote?.regularMarketPrice) {
          data[key] = {
            price: quote.regularMarketPrice.toFixed(2),
            change: quote.regularMarketPrice - (quote.previousClose || 0),
            changePercent: ((quote.regularMarketPrice - (quote.previousClose || 0)) / (quote.previousClose || 1) * 100).toFixed(2)
          };
        }
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }

  return data;
}

function extractRelevantData(html) {
  // Extract key metrics from HTML
  const data = {};

  // BTC Price - improved regex to catch $96,000 or 96000
  const btcMatch = html.match(/Bitcoin.*?\$?\s*([\d,]+(?:\.\d{2})?)/i);
  if (btcMatch) data.btc = btcMatch[1];

  // ETH Price - improved regex
  const ethMatch = html.match(/ETH.*?\$?\s*([\d,]+(?:\.\d{2})?)/i);
  if (ethMatch) data.eth = ethMatch[1];

  // Risk metrics
  const riskMatch = html.match(/Risk[:\s]*([\d.]+)/i);
  if (riskMatch) data.risk = riskMatch[1];

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

async function generateAIBrief(dashboardData, yahooData, timestamp) {
  const prompt = `You are a senior quantitative analyst and market intelligence strategist. Analyze the following multi-dashboard data and provide a comprehensive daily intelligence brief for ${timestamp}.

REAL-TIME MARKET DATA (Yahoo Finance):
BTC: $${yahooData.btc?.price || 'N/A'} (${yahooData.btc?.changePercent || '0'}%)
ETH: $${yahooData.eth?.price || 'N/A'} (${yahooData.eth?.changePercent || '0'}%)
DXY: ${yahooData.dxy?.price || 'N/A'} (${yahooData.dxy?.changePercent || '0'}%)
Gold: $${yahooData.gold?.price || 'N/A'} (${yahooData.gold?.changePercent || '0'}%)
S&P 500: ${yahooData.sp500?.price || 'N/A'} (${yahooData.sp500?.changePercent || '0'}%)
Oil (WTI): $${yahooData.oil?.price || 'N/A'} (${yahooData.oil?.changePercent || '0'}%)

DASHBOARD DATA SUMMARY:
${JSON.stringify(dashboardData, null, 2)}

CRITICAL: Use the REAL-TIME MARKET DATA prices above for all analysis. Dashboard data may contain outdated prices.

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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeStr = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  });

  const dashboardCards = Object.entries(DASHBOARDS).map(([key, dash]) => `
    <div class="dashboard-card" onclick="window.open('${dash.url}', '_blank')">
      <div class="card-icon">${dash.icon}</div>
      <h3>${dash.name}</h3>
      <p>${dash.description}</p>
      <a href="${dash.repo}" class="repo-link" onclick="event.stopPropagation()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        View Repo
      </a>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Orchestrator Pro - Daily Intelligence Brief</title>
  <meta name="description" content="AI-powered daily market intelligence aggregating crypto, macro, and AI breakthrough analysis">
  
  <!-- PWA Meta Tags -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#0f172a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="DashOrch">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --primary: #6366f1;
      --primary-dark: #4f46e5;
      --secondary: #ec4899;
      --accent: #8b5cf6;
      --background: #0f172a;
      --surface: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--background);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
      background-attachment: fixed;
      min-height: 100vh;
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    /* Header Styling */
    .header {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 3rem 2rem;
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }

    .header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 3.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      text-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .header p {
      font-size: 1.25rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    .timestamp {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #818cf8;
    }
    
    /* Stats Banner */
    .stats-banner {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: rgba(30, 41, 59, 0.4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 1.5rem;
      text-align: center;
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(99, 102, 241, 0.3);
    }
    
    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .dashboard-card {
      background: rgba(30, 41, 59, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 24px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      group: hover;
    }
    
    .dashboard-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.3);
    }
    
    .card-icon {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      transition: transform 0.3s ease;
    }
    
    .dashboard-card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
    
    .dashboard-card h3 {
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    
    .dashboard-card p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .repo-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.1);
      transition: all 0.2s ease;
    }
    
    .repo-link:hover {
      background: var(--primary);
      color: white;
    }
    
    /* Content Styling */
    .content {
      background: rgba(30, 41, 59, 0.5);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 32px;
      padding: 4rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .content h1 {
      font-family: 'Outfit', sans-serif;
      color: var(--text);
      font-size: 2.25rem;
      margin: 3rem 0 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.3);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .content h1:first-child { margin-top: 0; }
    
    .content h2 {
      font-family: 'Outfit', sans-serif;
      color: #818cf8;
      font-size: 1.75rem;
      margin: 2.5rem 0 1.25rem;
    }
    
    .content h3 {
      color: #c084fc;
      font-size: 1.25rem;
      margin: 2rem 0 1rem;
      font-weight: 600;
    }
    
    .content p {
      color: #cbd5e1;
      margin-bottom: 1.25rem;
      font-size: 1.05rem;
      line-height: 1.8;
    }
    
    .content ul, .content ol {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }
    
    .content li {
      margin-bottom: 0.75rem;
      color: #cbd5e1;
      padding-left: 0.5rem;
    }
    
    .content strong {
      color: #fff;
      font-weight: 600;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    
    .footer a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    .footer a:hover {
      color: var(--accent);
    }
    
    @media (max-width: 768px) {
      .header { padding: 2rem 1rem; }
      .header h1 { font-size: 2.5rem; }
      .content { padding: 2rem; }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Dashboard Orchestrator Pro</h1>
      <p>AI-Powered Market Intelligence Command Center</p>
      <div class="timestamp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        ${dateStr} • ${timeStr}
      </div>
    </div>
    
    <div class="stats-banner">
      <div class="stat-card">
        <div class="stat-value">6</div>
        <div class="stat-label">Dashboards Active</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">24/7</div>
        <div class="stat-label">Real-time Tracking</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">AI</div>
        <div class="stat-label">Deep Analysis</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">100%</div>
        <div class="stat-label">Uptime</div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      ${dashboardCards}
    </div>
    
    <div class="content">
      ${brief.split('\n').map(line => {
    // Convert inline **bold** text first
    let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    if (line.startsWith('# ')) {
      return `<h1>${processedLine.substring(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      return `<h2>${processedLine.substring(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      return `<h3>${processedLine.substring(4)}</h3>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      return `<li>${processedLine.substring(2)}</li>`;
    } else if (line.match(/^\d+\. /)) {
      return `<li>${processedLine.substring(line.indexOf(' ') + 1)}</li>`;
    } else if (line.trim()) {
      return `<p>${processedLine}</p>`;
    }
    return '';
  }).join('\n')}
    </div>
    
    <div class="footer">
      <p>
        <strong>Powered by OpenRouter AI</strong> • 
        <a href="https://openrouter.ai" target="_blank">tngtech/tng-r1t-chimera:free</a>
      </p>
      <p style="margin-top: 0.5rem;">
        Automated via <a href="https://github.com/features/actions" target="_blank">GitHub Actions</a> • 
        Updates Daily at 1:00 PM UTC
      </p>
      <p style="margin-top: 1rem; font-size: 0.8rem; opacity: 0.7;">
        For informational purposes only. Not financial advice. 
        Past performance does not guarantee future results.
      </p>
    </div>
    
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
        });
      }
    </script>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🚀 Starting Dashboard Orchestrator Pro...');
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
