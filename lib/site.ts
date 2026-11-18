// One place for the facts the page and the avatar share.
// NEXT_PUBLIC_* values are read at build time, so rebuild after changing them.

export const SITE = {
  name: 'Allyssa Bulo',
  firstName: 'Allyssa',
  role: 'AI Automation Specialist',
  location: 'Philippines',
    // Google Calendar appointment schedule; calls run on Google Meet.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://calendar.app.google/3czX9RJBpxAWNuPa6',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'lysabulo@outlook.com',
  // Share-preview base URL: set it, or on Vercel it comes from the production domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
} as const;

// "Book a call": the Google Calendar booking page (opens in a new tab). If the
// booking URL is ever emptied, it falls back to a pre-filled email.
const CALL_SUBJECT = 'Free strategy call request';
const CALL_BODY = [
  `Hi ${SITE.firstName},`,
  '',
  "I'd like to book a free strategy call.",
  '',
  'What I want to automate:',
  'Tools we use now:',
  'Times that suit me (with time zone):',
  '',
  'Thanks!',
].join('\n');

export const CALL = SITE.bookingUrl
  ? { href: SITE.bookingUrl, external: true }
  : {
      href: `mailto:${SITE.email}?subject=${encodeURIComponent(CALL_SUBJECT)}&body=${encodeURIComponent(CALL_BODY)}`,
      external: false,
    };

// Shorter prompts for the row above the composer once the chat has started.
export const FOLLOW_UPS = [
  { label: 'Projects', prompt: 'Show me your best projects' },
  { label: 'Tools', prompt: 'What tools do you use?' },
  { label: 'Certificates', prompt: 'What certifications do you have?' },
  { label: 'Work together', prompt: 'How can we collaborate?' },
] as const;
