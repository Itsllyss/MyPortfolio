// Project 3: the Daily Market Watch v2 pipeline (Claude scheduled task + Homer +
// Domain + Make.com). Shown in the project detail view and fed to the system
// prompt. Each step shows its screenshot under the explanation.

import type { Phase } from './fleet-workflows';

export const MARKET_WATCH: Phase = {
  id: 'market-watch',
  tab: 'Pipeline',
  short: 'Pipeline',
  title: 'Daily Market Watch v2: an autonomous pipeline in 3 steps',
  pdf: '/docs/Project-3-Daily-Market-Watch-Workflows.pdf',
  steps: [
    {
      title: 'Autonomous Daily Schedule & Multi-Source Connectors',
      short: 'Scheduled Claude task',
      span: 'Every morning: Homer, Domain and Make.com via MCP',
      shot: {
        src: '/images/market_watch_execution_clean.jpg',
        width: 1176,
        height: 878,
        alt: 'Claude scheduled task run of Daily Market Watch: used Homer, published the Daily Market Watch artifact, then ran the Make scenario Daily Campaign Update to Outlook Draft in 866 ms',
      },
      text: 'A Claude Scheduled Task runs automatically every morning without manual prompting, authenticating with Homer (live property database), Domain (Sydney auction clearance rates) and Make.com through MCP connectors.',
    },
    {
      title: 'Interactive Market Intelligence Dashboard (Daily Market Watch v2)',
      short: 'Daily Market Watch v2',
      span: '1,197 listings across 22 suburbs, one filterable report',
      shot: {
        src: '/images/daily-market-watch-v2-clean.png',
        width: 1964,
        height: 1844,
        alt: 'Daily Market Watch for 27 November 2026: 47% Sydney clearance rate from Domain, 1,197 active listings, 9 listed, 5 sold, 2 passed in, 7 price rises, 23 price drops, 16 withdrawn, 467 at 90+ days, 4 auction changes, suburb filters and a suburb snapshot table',
      },
      text: 'Processes 1,197 active listings across 22 suburbs into an interactive, filterable report (`All`, `Apartment List`, `House & Townhouse`). It shows the Sydney clearance rate from Domain (47% on this run), 9 KPI cards (active listings, listed, sold, passed in, price up, price down, withdrawn, 90+ days on market and auction changes) and a suburb-by-suburb breakdown table.',
    },
    {
      title: 'Human-in-the-Loop Outlook Campaign Draft (Make.com)',
      short: 'Outlook campaign draft',
      span: 'Make.com scenario to a draft for human review',
      shot: {
        src: '/images/market-watch-make-run.jpg',
        width: 792,
        height: 357,
        alt: 'Executed Make scenario Daily Campaign Update to Outlook Draft (Claude): completed, 1 credit, 866 ms, 5.8 KB',
      },
      text: 'Triggers the Make.com scenario (`Daily Campaign Update -> Outlook Draft`), which runs in under a second (866 ms on this run) and turns the day\'s market insights into a ready-to-review draft email in Microsoft Outlook. A person reviews and approves it before it is sent.',
    },
  ],
};

export const MARKET_WATCH_TEXT =
  `${MARKET_WATCH.steps.length}-step pipeline (PDF: ${MARKET_WATCH.pdf}, a 2-page proof of a real scheduled run and the executed Make.com scenario)\n` +
  MARKET_WATCH.steps.map((s, i) => `  Step ${i + 1}. ${s.title}: ${s.text.replace(/`/g, '')}`).join('\n');
