// Project 1: the 17 GoHighLevel workflows behind the vehicle rental CRM,
// grouped in 3 phases. Shown in the project detail view and fed to the
// avatar's system prompt. Text in `backticks` renders as a tag/field chip.

export type WorkflowStep = {
  title: string;
  text: string;
  short?: string; // label in the architecture strip (single-group projects)
  span?: string; // one-line "trigger to result" under that label
};
export type Phase = {
  id: string;
  tab: string;
  short: string;
  title: string;
  pdf?: string; // workflow PDF to view or download
  lead?: string; // "Problem solved" paragraph above the steps
  image?: { src: string; width: number; height: number; alt: string }; // workflow screenshot, opens in the lightbox
  steps: WorkflowStep[];
};

export const FLEET_PHASES: Phase[] = [
  {
    id: 'lifecycle',
    tab: 'Lifecycle entry',
    short: 'Lifecycle',
    title: 'Phase 1: Lifecycle Entry & Booking Pipeline',
    pdf: '/docs/1-Lifecycle-Entry-Workflows.pdf',
    steps: [
      {
        title: 'Ad Lead Form Submission & Conversation AI Intake',
        text: 'Triggered on Meta/Google survey submission; creates/updates the CRM opportunity, assigns the lead, fires Meta Conversion API, alerts the team, sends a welcome email, and launches Conversation AI to qualify replies (Positive, Neutral, Future, Negative, or Timeout) with automatic customer service follow-up tasks.',
      },
      {
        title: 'Waitlist Follow-Up (7-Day & 14-Day Loops)',
        text: 'Triggered when `waitlist-no-vehicle` is tagged; moves the opportunity to Waitlist, sends business-hours (9 AM–6 PM EST) SMS confirmation, and runs automated 7-day and 14-day check-in loops while the lead remains in the Waitlist stage.',
      },
      {
        title: 'Vehicle Offer Dispatch (Class-Based Routing)',
        text: 'Triggered on `reservation-reviewed`; validates that a Vehicle Class Offer exists (alerting staff if blank) and dynamically routes customized SMS offers based on vehicle class (`Midsize`, `Fullsize`, or `SUV`) during business hours.',
      },
      {
        title: 'Offer Acceptance & Security Deposit Invoice',
        text: 'Triggered when the customer replies to accept; updates the opportunity to Approve Security Deposit, sends an SMS acceptance confirmation during business hours, dispatches the Security Deposit invoice, and swaps offer tags for `deposit-invoice-sent`.',
      },
      {
        title: 'Security Deposit Received & Pickup Instructions',
        text: 'Triggered when the security deposit invoice is paid; updates the opportunity stage, alerts staff internally, sends pickup scheduling details via SMS during business hours, and clears deposit/waitlist tags.',
      },
      {
        title: 'Pickup Time Confirmed',
        text: 'Triggered when the pickup appointment status is confirmed; sends an SMS confirmation and applies `pickup-confirmed` and `rental-invoice-sent` tags to initiate billing.',
      },
      {
        title: 'Rental Invoice Dispatch (Daily & Weekly Rate Tiers)',
        text: 'Splits leads by `Rental Type` (`Daily` vs. `Weekly`) and `Vehicle Class` (`Midsize`, `Fullsize`, `SUV`) to dispatch exact rate-tiered rental invoices ($55/$60/$65 daily or weekly rates), moving opportunities to Awaiting Rental Payment and alerting staff if a vehicle class is missing.',
      },
      {
        title: 'Rental Invoice Paid & Vehicle Assigned',
        text: 'Triggered upon rental payment; locates the opportunity, updates status to Vehicle Assigned, sends an SMS payment confirmation receipt, and clears the `rental-invoice-sent` tag.',
      },
    ],
  },
  {
    id: 'billing',
    tab: 'Billing & contracts',
    short: 'Billing',
    title: 'Phase 2: Recurring Billing & Contract Renewal',
    pdf: '/docs/2-Billing-and-Contract-Workflows.pdf',
    steps: [
      {
        title: 'Weekly Recurring Payment',
        text: 'Triggered by the `active-rental` tag for weekly renters; runs a 7-day cycle and branches by vehicle class (`Midsize`, `Fullsize`, `SUV`) to automatically dispatch recurring weekly invoices (with internal fallback alerts if unmapped).',
      },
      {
        title: 'Weekly & Daily Payment Reminders',
        text: 'Monitors sent/viewed invoices at 4:00 PM; sends a 2-hour pre-due SMS reminder if unpaid, re-checks at 7:00 PM, and triggers an overdue payment SMS alert if the status is still Sent or Viewed.',
      },
      {
        title: 'Contract Renewal Tracking (25-Day Active Rental Reminder)',
        text: 'Waits 25 days into an active rental cycle, verifies the `active-rental` tag, sends a return/renewal SMS reminder, creates a `#1 Contract Expiring in 3 Days` task, and escalates to a `#2 Contract Due Today` task and SMS upon timeout.',
      },
      {
        title: 'Contract Renewal Tracking (Customer Replied)',
        text: 'Parses incoming SMS replies for `"Extend"` or `"Return"`. If `"Extend"`, applies `extend-contract`, confirms via SMS, creates a `#2 Send Extension Agreement` task, and checks 3 days after day 28 to flag unsigned contracts; if `"Return"`, sends return confirmation instructions.',
      },
    ],
  },
  {
    id: 'maintenance',
    tab: 'Maintenance',
    short: 'Maintenance',
    title: 'Phase 3: Vehicle Maintenance & Fleet Tracking',
    pdf: '/docs/3-Vehicle-Maintenance-Workflows.pdf',
    steps: [
      {
        title: 'Maintenance 23-Day Reminder & Overdue Escalation',
        text: 'Triggered on active rental; waits 16 days (7 days prior to the 23-day mark), creates a maintenance task, waits 7 days, sends an SMS maintenance reminder, updates the opportunity, and runs a 4-day verification loop that escalates overdue vehicles with `maintenance-due` tags, SMS alerts, and internal tasks.',
      },
      {
        title: 'Maintenance Completed (Fleet-Specific Routing)',
        text: 'Triggered on maintenance completion; verifies active rental status and branches by specific vehicle unit (e.g., `MS3-Corolla Red` vs. standard fleet) to remove completed maintenance workflows and reset tags.',
      },
      {
        title: 'Maintenance Completed (Due Tag Removal & Reset)',
        text: 'Checks assigned vehicle codes upon maintenance completion to cleanly remove lingering due-date workflows and reset vehicle tracking tags.',
      },
      {
        title: 'Maintenance 14-Day Cycle Reminder',
        text: 'Triggered when `maintenance-complete` is applied during an active rental; waits 7 days, schedules a `#1 Maintenance Due in 7 Days` task, waits another 7 days to send the maintenance SMS reminder and `#3 Maintenance Due Today` task, and re-checks after 1 day to flag any uncompleted maintenance as due.',
      },
      {
        title: 'Stop Tracking on Rental End',
        text: 'Triggered when the `active-rental` tag is removed; immediately removes the contact from all active maintenance and renewal workflows so former renters never receive fleet alerts.',
      },
    ],
  },
];

export const FLEET_WORKFLOW_COUNT = FLEET_PHASES.reduce((n, p) => n + p.steps.length, 0);

// Plain-text version for the system prompt.
export const FLEET_WORKFLOWS_TEXT = FLEET_PHASES.map(
  (p) =>
    `${p.title} (${p.steps.length} workflows; PDF: ${p.pdf})\n` +
    p.steps.map((s, i) => `  Step ${i + 1}. ${s.title}: ${s.text.replace(/`/g, '')}`).join('\n'),
).join('\n\n');

// Module 4: outside GoHighLevel, a scheduled Make.com scenario posts a daily
// fleet summary from the Google Sheets tracker to the team's Telegram channel.
export const FLEET_REPORTING = {
  id: 'report',
  tab: 'Daily report',
  short: 'Report',
  title: 'Daily Executive Reporting Bot (Make.com + Google Sheets + Telegram)',
  summary:
    'Outside of GoHighLevel, I built a scheduled Make.com automation that runs automatically every morning (US Eastern), pulls live fleet data from the Google Sheets tracker and posts a structured Daily Summary to the team’s Telegram channel.',
  // The scenario is set to "Daily at 8:00 PM" in Make, which is morning US Eastern
  // when the account runs on Philippine time.
  schedule: 'Daily, every morning US Eastern (scheduled in Make as Daily at 8:00 PM)',
  pipeline: [
    { app: 'Google Sheets', action: 'Get a Cell', icon: '/icons/googlesheets.svg' },
    { app: 'Tools', action: 'Text aggregator', icon: '/icons/make.svg' },
    { app: 'Telegram Bot', action: 'Send a Text Message or a Reply', icon: '/icons/telegram.svg' },
  ],
  alerts: [
    'Vehicle maintenance due within 7 days',
    'Overdue vehicle maintenance',
    'Rental contracts due within 7 days',
    'Overdue rental contracts',
  ],
  diagram: '/docs/send-report-to-telegram.png',
  // Client slot: the Telegram Daily Summary screenshot. Until the file exists,
  // the detail view shows a stand-in with the summary's structure.
  sample: '/docs/telegram-summary-sample.png',
} as const;

export const FLEET_REPORTING_TEXT =
  `Module 4 — ${FLEET_REPORTING.title}\n` +
  `  ${FLEET_REPORTING.summary}\n` +
  `  Schedule: ${FLEET_REPORTING.schedule}.\n` +
  `  Make.com scenario: ${FLEET_REPORTING.pipeline.map((p) => `${p.app} (${p.action})`).join(' -> ')}.\n` +
  `  The Daily Summary flags 4 alerts every day: ${FLEET_REPORTING.alerts.map((a, i) => `${i + 1}) ${a}`).join('; ')}.`;
