// Project 3: the Daily Market Watch pipeline (Claude scheduled task + Homer +
// Make.com). Shown in the project detail view and fed to the system prompt.

import type { Phase } from './fleet-workflows';

export const MARKET_WATCH: Phase = {
  id: 'market-watch',
  tab: 'Pipeline',
  short: 'Pipeline',
  title: 'Daily Market Watch Autonomous Pipeline: 2-page execution & scenario proof',
  pdf: '/docs/Project-3-Daily-Market-Watch-Workflows.pdf',
  steps: [
    {
      title: 'Autonomous Daily Schedule & MCP Connectors',
      short: 'Scheduled Claude task',
      span: 'Every morning at 3:43 AM, Homer and Make.com via MCP',
      text: 'A Claude Scheduled Task runs automatically every morning at 3:43 AM without manual prompting, authenticating directly with Homer (real estate market data) and Make.com via MCP connectors.',
    },
    {
      title: 'Live Market Intelligence & Interactive Artifact Generation',
      short: 'Daily Market Watch report',
      span: 'Homer market data to an interactive report',
      text: 'Queries active listings, recent sales, price guide movements, and withdrawn properties across target suburbs in Homer, then compiles and publishes a structured, filterable Daily Market Watch interactive report artifact.',
    },
    {
      title: 'Automated Outlook Campaign Draft via Make.com',
      short: 'Outlook campaign draft',
      span: 'Make.com scenario to a draft for human review',
      text: 'Automatically triggers the Make.com scenario (`Daily Campaign Update -> Outlook Draft (Claude)`), formatting the daily market insights into a ready-to-review draft email inside Microsoft Outlook (Human-in-the-Loop approval before sending).',
    },
  ],
};

export const MARKET_WATCH_TEXT =
  `${MARKET_WATCH.steps.length}-step pipeline (PDF: ${MARKET_WATCH.pdf}, a 2-page proof of a real scheduled run and the executed Make.com scenario)\n` +
  MARKET_WATCH.steps.map((s, i) => `  Step ${i + 1}. ${s.title}: ${s.text.replace(/`/g, '')}`).join('\n');
