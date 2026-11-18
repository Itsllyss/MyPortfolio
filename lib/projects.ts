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
      'Ad lead to returned car in one GoHighLevel system: Conversation AI qualifies leads, then offers, deposits, rate-tiered invoices, renewals and maintenance run across 17 workflows.',
    stack: ['GoHighLevel', 'Conversation AI', 'SMS', 'Email', 'Payments'],
    metrics: ['17 automated workflows', '3 system phases', 'Daily & weekly rate tiers'],
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
