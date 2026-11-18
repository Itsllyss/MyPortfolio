// Shown as cards when the avatar writes <<certificates>>, and fed to the
// system prompt so the avatar can talk about them.

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  duration?: string;
  highlights: string[];
};

export const CERTIFICATES: Certificate[] = [
  {
    title: 'Advanced AI Course: Mastering ChatGPT, Claude, Gemini, Perplexity and Other Tools for Marketing and Content',
    issuer: 'The University of Sydney, Centre for Continuing Education',
    date: '10 November 2026',
    duration: '8-hour intensive session',
    highlights: ['AI prompting', 'Marketing workflows', 'Content workflows', 'ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
  },
  {
    title: 'No Code Automation with Zapier (Full Training)',
    issuer: 'Tara AI Community',
    date: '26 September 2026',
    highlights: [
      'Zapier Interfaces',
      'Triggers',
      'Formatter',
      'Delay',
      'Filter',
      'Paths',
      'Looping',
      'Sub-Zaps',
      'Webhooks',
      'AI with Human-in-the-Loop',
    ],
  },
];
