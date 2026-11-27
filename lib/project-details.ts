// Which projects open a detail view, and what it shows.

import { BOOKING_WORKFLOWS } from './booking-workflows';
import { FLEET_PHASES, FLEET_WORKFLOW_COUNT, type Phase } from './fleet-workflows';
import { INVOICE_WORKFLOW } from './invoice-workflow';
import { LISTING_SCENARIOS } from './listing-workflows';
import { MARKET_WATCH } from './market-watch-workflows';
import type { ProjectId } from './projects';

export type DetailConfig = {
  cta: string; // the card button that opens the view
  archTitle: string;
  groups: Phase[]; // more than one = tabs
  stepLabel: 'Step' | 'Scenario';
  extraStack: string[];
  report?: boolean; // Project 1's Make.com reporting module as a last tab
  engine?: 'booking'; // Project 4: its own tabbed view (node flow, inspector, SMS preview)
};

export const DETAILS: Partial<Record<ProjectId, DetailConfig>> = {
  fleet: {
    cta: `View all ${FLEET_WORKFLOW_COUNT} workflows`,
    archTitle: `Architecture: ${FLEET_WORKFLOW_COUNT} GoHighLevel workflows in 3 phases, plus a Make.com reporting bot`,
    groups: FLEET_PHASES,
    stepLabel: 'Step',
    extraStack: ['Make.com', 'Google Sheets', 'Telegram'],
    report: true,
  },
  listings: {
    cta: 'See how it works',
    archTitle: 'Architecture: monday.com boards connected by 4 Make.com scenarios',
    groups: [LISTING_SCENARIOS],
    stepLabel: 'Scenario',
    extraStack: ['360Messenger', 'Microsoft 365 (Outlook)', 'monday.com GraphQL API'],
  },
  ai: {
    cta: 'See how it works',
    archTitle: 'Architecture: a scheduled Claude task, connected to Homer, Domain and Make.com through MCP, in 3 steps',
    groups: [MARKET_WATCH],
    stepLabel: 'Step',
    extraStack: ['Claude Scheduled Tasks', 'MCP connectors', 'Microsoft Outlook'],
  },
  booking: {
    cta: `View all ${BOOKING_WORKFLOWS.length} workflows`,
    archTitle: `Architecture: ${BOOKING_WORKFLOWS.length} GoHighLevel workflows that hand contacts to each other through one set of status tags`,
    groups: [],
    stepLabel: 'Step',
    extraStack: [],
    engine: 'booking',
  },
  invoice: {
    cta: 'See how it works',
    archTitle: `Architecture: a ${INVOICE_WORKFLOW.steps.length}-node n8n workflow, from upload form to expense ledger`,
    groups: [INVOICE_WORKFLOW],
    stepLabel: 'Step',
    extraStack: [],
  },
};
