// The three case studies shown as cards when the avatar writes <<projects>>.
// Every badge is a fact taken from the SOPs or the screenshot in the source
// documents. Add time-saved figures (e.g. "25–30 hrs saved/week") only once
// you have the numbers to back them.

export type ProjectId = 'fleet' | 'listings' | 'ai';

export type Project = {
  id: ProjectId;
  title: string;
  summary: string;
  stack: string[];
  metrics: string[];
  ask: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'fleet',
    title: 'Automated Vehicle Rental & Fleet Lifecycle CRM System',
    summary:
      'Reservation to return in one GoHighLevel system: vehicle offers by SMS, deposits, weekly invoices by rate tier, maintenance checks and contract renewals run on their own.',
    stack: ['GoHighLevel', 'SMS', 'Email', 'Payments'],
    metrics: ['9-stage rental lifecycle', 'Weekly invoices by rate tier', '25-day renewal loop'],
    ask: 'Walk me through the vehicle rental and fleet CRM system',
  },
  {
    id: 'listings',
    title: 'Automated Real Estate Listing & Transaction Pipeline',
    summary:
      'Marking a property "Listed" in monday.com builds its listing card, vendor record and checklist board, and checklist tasks send emails and WhatsApp messages from the vendor details.',
    stack: ['monday.com', 'Make.com', 'Email', 'WhatsApp'],
    metrics: ['1 status change, 3 boards built', 'Email + WhatsApp on one status', 'No credits spent on manual tasks'],
    ask: 'Walk me through the real estate listing pipeline',
  },
  {
    id: 'ai',
    title: 'Applied AI & Content Automation',
    summary:
      'Custom AI interfaces built with Claude: a daily market watch over 1,000+ active listings, plus campaign update emails drafted automatically through Make.',
    stack: ['Claude', 'Homer', 'Make.com'],
    metrics: ['1,000+ listings tracked daily', 'Daily market report', 'Campaign emails auto-drafted'],
    ask: 'Walk me through the applied AI and content automation work',
  },
];

export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);
