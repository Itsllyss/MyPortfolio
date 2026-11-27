// "Me": who Allyssa is and what she offers. Shown as the About card
// (<<about>>) and fed to the avatar's system prompt.

export const ABOUT = {
  headline: 'AI Automation & Technical Workflow Specialist',
  location: 'Philippines',
  experience: '3+ years in real estate operations',
  pitch:
    'I architect custom, end-to-end systems from scratch in GoHighLevel (GHL), Make.com, monday.com and AI agents (Claude, OpenAI), so your leads, deals and client updates run on their own.',
  stack: [
    { name: 'GoHighLevel' },
    { name: 'Make.com', icon: '/icons/make.svg' },
    { name: 'n8n', icon: '/icons/n8n.svg' },
    { name: 'monday.com' },
    { name: 'Claude', icon: '/icons/claude.svg' },
    { name: 'OpenAI' },
  ],
  services: [
    {
      title: 'Custom systems, built from scratch',
      text: 'I design and build your CRM pipelines, workflows, integrations and AI agents end to end.',
    },
    {
      title: 'Ongoing support on a monthly retainer',
      text: 'CRM administration, workflow maintenance and client communication, so your systems keep running as your business changes.',
    },
    {
      title: 'Done-for-you operations with my team',
      text: 'Once your workflows and pipelines are built and streamlined, my dedicated team handles day-to-day CRM management, inbox and inquiry follow-ups, and outbound client communication.',
    },
  ],
} as const;

export const ABOUT_TEXT = `ABOUT ME
I'm an ${ABOUT.headline} based in the ${ABOUT.location}, with ${ABOUT.experience}. ${ABOUT.pitch}

HOW I WORK WITH CLIENTS (services)
${ABOUT.services.map((s, i) => `${i + 1}) ${s.title}: ${s.text}`).join('\n')}
Together this gives business owners a complete "done-for-you" operation: I build the system, keep it running, and my team runs the day-to-day communication on top of it.
Retainer pricing and team capacity depend on the scope; I share them on a call (never quote a price).`;
