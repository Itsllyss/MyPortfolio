// Project 2: the 4 Make.com scenarios behind the real estate listing pipeline.
// Shown in the project detail view and fed to the avatar's system prompt.
// Text in `backticks` renders as a module/field chip.

import type { Phase } from './fleet-workflows';

export const LISTING_SCENARIOS: Phase = {
  id: 'scenarios',
  tab: 'Scenarios',
  short: 'Scenarios',
  title: 'Automated Real Estate Listing & Transaction Pipeline: 4 Make.com scenarios',
  pdf: '/docs/Project-2-Real-Estate-Pipeline-Workflows.pdf',
  steps: [
    {
      title: 'Match & Create WhatsApp Group ID',
      shot: { src: '/images/make-re-1.jpg', width: 2400, height: 923 },
      short: 'WhatsApp group match',
      span: 'New property item to matched WhatsApp Group ID',
      text: 'Watches for newly created property items in monday.com (`Watch Board\'s Items`), queries `360Messenger for WhatsApp` to list active WhatsApp groups, filters and aggregates matching group names (`Match ID Name` via Array Aggregator), and writes the matched WhatsApp Group ID directly back into the monday.com item column (`Update Column Values of a Specific Item`) so downstream communications route automatically to the right property chat.',
    },
    {
      title: 'Dynamic Listing Checklist Board Provisioning',
      shot: { src: '/images/make-re-2.jpg', width: 2400, height: 969 },
      short: 'Checklist board builder',
      span: 'Stage event to a new Listing Checklist board',
      text: 'Listens for status/stage events in monday.com (`Watch Events`) and executes a custom monday.com GraphQL API mutation (`POST Execute a GraphQL Query`) to dynamically provision a dedicated, standardized Listing Checklist board for each new property address.',
    },
    {
      title: 'Multi-Channel Listing Task Checklist & Stakeholder Alerts',
      shot: { src: '/images/make-re-3.jpg', width: 760, height: 1150 },
      short: 'Stakeholder alerts',
      span: 'Checklist update to Outlook email and WhatsApp',
      text: 'Watches checklist item updates across property boards in monday.com, retrieves property and vendor context, and branches through multi-tier Make.com Routers to automatically dispatch stage-specific Microsoft 365 (Outlook) emails and 360Messenger WhatsApp group messages to agents, vendors, and team members—logging each sent communication back onto the monday.com item.',
    },
    {
      title: 'Master Property Deals Multi-Board Sync',
      shot: { src: '/images/make-re-4.jpg', width: 2400, height: 1168 },
      short: 'Master deals sync',
      span: 'Deal stage change to Listing, Sold or Withdrawn boards',
      text: 'Monitors column updates on the master deals board (`Watch Board\'s Column Values`) and routes properties across lifecycle stages (`Listing Board`, `Sold Board`, and `Withdrawn`). Searches target boards by property ID to update existing records or create new items, and on `Withdrawn` deals, archives/deletes obsolete entries and executes a GraphQL query to clean up or archive the property\'s dedicated checklist board.',
    },
  ],
};

export const LISTING_SCENARIOS_TEXT =
  `${LISTING_SCENARIOS.steps.length} Make.com scenarios (PDF: ${LISTING_SCENARIOS.pdf})\n` +
  LISTING_SCENARIOS.steps.map((s, i) => `  Scenario ${i + 1}. ${s.title}: ${s.text.replace(/`/g, '')}`).join('\n');
