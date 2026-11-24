// Project 4: the 4 GoHighLevel workflows behind the booking, no-show and lead
// recovery engine. Shown in the project detail view (tabs) and fed to the
// avatar's system prompt. Text in `backticks` renders as a tag chip; SMS text
// keeps the real {{merge.fields}}, which render as chips in the phone preview.
// Timings follow the workflow screenshots in public/workflows/.

export type NodeKind = 'trigger' | 'condition' | 'message' | 'exit';

export type FlowNode = {
  kind: NodeKind;
  label: string; // node name in the flow
  role: string; // small line under it
  logic: string;
  timing: string;
  safeguards: string[];
};

export type Breakdown = {
  trigger: string;
  hygiene: string;
  timing: string;
  branches: string;
  exit: string;
};

export type Sms = { when: string; label: string; text: string };

export type BookingWorkflow = {
  id: string;
  tab: string;
  short: string;
  title: string;
  summary: string;
  image: { src: string; width: number; height: number; alt: string };
  nodes: FlowNode[];
  breakdown: Breakdown;
  sms: Sms[];
};

export const BOOKING_WORKFLOWS: BookingWorkflow[] = [
  {
    id: 'appointments',
    tab: 'Appointment & no-show',
    short: 'No-show',
    title: 'Appointment Confirmation, Pre-Arrival & No-Show Recovery',
    summary:
      'One workflow listens for three appointment events (confirmed, no-show and cancelled) and routes each down its own If/Else branch. Confirmed contacts get a clean tag set and three reminders. No-shows and cancellations get a reschedule link by text, then email, then a call from a rep.',
    image: {
      src: '/workflows/1-appointment-no-show.png',
      width: 2058,
      height: 521,
      alt: 'GoHighLevel workflow: appointment cancelled, confirmed and no-show triggers feed a router. The no-show or cancelled branch removes the booked tag, tags the missed appointment, waits 15 minutes, sends a reschedule SMS, waits 24 hours, checks whether the contact rebooked, then sends a follow-up email and creates a call task. The confirmed branch tags the booking, removes old lead tags, sends a confirmation SMS and email, a 24-hour reminder, a final arrival reminder 2 hours before, and notifies the assigned user.',
    },
    nodes: [
      {
        kind: 'trigger',
        label: 'Appointment status changed',
        role: 'Trigger',
        logic:
          'Three triggers feed one router: Appointment confirmed, Appointment no-show and Appointment cancelled. The router sends each event down its own branch.',
        timing: 'Instant',
        safeguards: ['Allow Re-entry is on, so a rescheduled appointment runs through the workflow again cleanly.'],
      },
      {
        kind: 'condition',
        label: 'Confirmed path',
        role: 'If/Else branch',
        logic:
          'Applies `appointment-booked` and strips the old recovery tags `awaiting-reply`, `missed-call-lead`, `missed-appointment` and `cold-no-reply`. Then it sends the confirmation SMS and email, a reminder 24 hours before, a final arrival reminder 2 hours before, and notifies the assigned user.',
        timing: 'Confirmation at once, then 24 hours and 2 hours before the start time',
        safeguards: [
          'Stripping every recovery tag stops the speed-to-lead, missed-call and no-reply loops for this contact.',
          'Reminder waits count back from the appointment start time, not from the moment it was booked.',
        ],
      },
      {
        kind: 'condition',
        label: 'No-show or cancelled path',
        role: 'If/Else branch',
        logic:
          'One OR condition catches both no-shows and cancellations. It strips `appointment-booked`, applies `missed-appointment`, and waits 15 minutes before any outreach.',
        timing: '15-minute buffer',
        safeguards: [
          'Removing `appointment-booked` lets the other workflows see the contact as unbooked again.',
          'The 15-minute pause keeps the first text from landing the second the slot is missed.',
        ],
      },
      {
        kind: 'exit',
        label: 'Recovery & escalation',
        role: 'Exit',
        logic:
          'Sends the reschedule SMS with the booking link. After 24 hours it checks whether the contact rebooked; if not, a reschedule follow-up email goes out, and 24 hours later a `#1 Call to reschedule` task is created for the rep.',
        timing: 'SMS at +15 min, email at +24 h, call task at +48 h',
        safeguards: [
          'The rebook check runs before the email, so a contact who already rebooked hears nothing more.',
          'At 48 hours a person takes over instead of another automated message.',
        ],
      },
    ],
    breakdown: {
      trigger:
        'Three appointment events (confirmed, no-show, cancelled) start one workflow. Allow Re-entry is on, so every reschedule runs through again.',
      hygiene:
        'Confirmed strips `awaiting-reply`, `missed-call-lead`, `missed-appointment` and `cold-no-reply`, then applies `appointment-booked`. No-show or cancelled strips `appointment-booked` and applies `missed-appointment`.',
      timing:
        'Reminders wait until 24 hours and 2 hours before the start time. Recovery waits 15 minutes before the first text, then 24 hours between each step.',
      branches:
        'A router splits confirmed from no-show or cancelled. On the recovery side, a second check asks whether the contact has rebooked.',
      exit: 'Confirmed ends with an alert to the assigned user. Unbooked no-shows end with a `#1 Call to reschedule` task at 48 hours.',
    },
    sms: [
      {
        when: 'Just now',
        label: 'Confirmed',
        text: 'Hi {{contact.first_name}}! Your appointment is confirmed for {{appointment.start_time}}. Reply R if you need to reschedule.',
      },
      {
        when: '2 hours before',
        label: 'Arrival reminder',
        text: "Quick reminder—we're looking forward to speaking with you in 2 hours at {{appointment.only_start_time}}!",
      },
      {
        when: '+15 min',
        label: 'After a no-show',
        text: 'Hey {{contact.first_name}}, looks like we missed you earlier! No worries at all—grab a new time that works best for you here: {{custom_values.booking_link}}',
      },
    ],
  },
  {
    id: 'speed-to-lead',
    tab: 'Speed-to-lead',
    short: 'New lead',
    title: 'Speed-to-Lead & Unbooked Follow-Up Nudge',
    summary:
      'Every new inquiry gets a text and an email with the booking link the moment it arrives. Two timed booking checks send a nudge only while the lead is still unbooked, and on day 3 a silent lead moves out of active follow-up.',
    image: {
      src: '/workflows/2-speed-to-lead.png',
      width: 2024,
      height: 320,
      alt: 'GoHighLevel workflow: form submitted or lead tag added, add awaiting-reply tag, create a New Lead opportunity, welcome SMS, welcome email, wait 4 hours, a not-booked check, booking link follow-up, wait 24 hours, a still-not-booked check, final booking reminder, wait 24 hours, remove the awaiting-reply tag and add the cold-no-reply tag.',
    },
    nodes: [
      {
        kind: 'trigger',
        label: 'Form submitted or lead tag added',
        role: 'Trigger',
        logic:
          'A new inquiry starts the workflow either way: a submitted form, or the `lead-new` tag added by hand or by another automation.',
        timing: 'Instant',
        safeguards: ['Stop on Response is on: the first reply ends every follow-up at once.'],
      },
      {
        kind: 'condition',
        label: 'Tag & instant outreach',
        role: 'Tag hygiene',
        logic:
          'Applies `awaiting-reply`, creates a New Lead opportunity, then sends the welcome SMS and the welcome email, both with the booking link.',
        timing: 'Instant',
        safeguards: [
          '`awaiting-reply` marks the contact as waiting on them, a state the other workflows read.',
          'The opportunity exists before the first message, so the pipeline is right from minute one.',
        ],
      },
      {
        kind: 'message',
        label: 'Booking checks & nudges',
        role: 'If/Else checks',
        logic:
          'After 4 hours an If/Else checks whether the opportunity has reached the Reservation Request stage. If not, a booking-link follow-up goes out. 24 hours later the same check runs again before a final booking reminder.',
        timing: 'Nudge at +4 h, final reminder at +28 h',
        safeguards: [
          'Every message sits behind a booking check, so a lead who booked is never chased.',
          'Booked leads leave through the None branch with no further steps.',
        ],
      },
      {
        kind: 'exit',
        label: 'Day 3 tag swap',
        role: 'Exit',
        logic:
          '24 hours after the final reminder, a lead who is still unbooked loses `awaiting-reply` and gains `cold-no-reply`, which moves them out of active speed-to-lead.',
        timing: '+52 h (day 3)',
        safeguards: ['`awaiting-reply` comes off before `cold-no-reply` goes on, so the contact carries one status tag at a time.'],
      },
    ],
    breakdown: {
      trigger: 'A form submission or the `lead-new` tag starts it. Stop on Response is on, so the first reply ends every follow-up.',
      hygiene: 'Applies `awaiting-reply` on entry. On exit, strips `awaiting-reply` and applies `cold-no-reply`.',
      timing:
        'Welcome SMS and email at once, a nudge at 4 hours, a final reminder 24 hours later, and the tag swap 24 hours after that.',
      branches:
        'Two If/Else checks ask whether the lead has reached the Reservation Request stage. Booked leads leave through the None branch.',
      exit: 'Still unbooked on day 3: the lead moves to `cold-no-reply` and out of active speed-to-lead.',
    },
    sms: [
      {
        when: 'Just now',
        label: 'Welcome',
        text: 'Hi {{contact.first_name}}, thanks for reaching out! You can pick a time directly on our calendar here: {{custom_values.booking_link}}',
      },
      {
        when: '+4 h',
        label: 'Still unbooked',
        text: 'Hey {{contact.first_name}}, just making sure the booking link came through okay! Let me know if you have any questions or grab a slot here: {{custom_values.booking_link}}',
      },
      {
        when: '+28 h',
        label: 'Final reminder',
        text: "Hi {{contact.first_name}}, still happy to help you get scheduled this week—here's the link whenever you're ready: {{custom_values.booking_link}}",
      },
    ],
  },
  {
    id: 'missed-call',
    tab: 'Missed call text-back',
    short: 'Missed call',
    title: 'Missed Call Text-Back & Callback Loop',
    summary:
      'A missed inbound call gets a text back within a minute, and the assigned rep hears about it first. If the caller still has not booked, a follow-up text goes out and the rep gets a callback task.',
    image: {
      src: '/workflows/3-missed-call-text-back.png',
      width: 2021,
      height: 406,
      alt: 'GoHighLevel workflow: inbound missed calls, an excluded-contacts check for do-not-rent and disqualified tags, then add missed-call-lead tag, notify assigned user, wait 1 minute, missed call text-back, wait 4 hours, a not-booked check, follow-up SMS, wait 24 hours, create a callback task and remove the missed-call-lead tag.',
    },
    nodes: [
      {
        kind: 'trigger',
        label: 'Inbound missed call',
        role: 'Trigger',
        logic: 'Fires when an inbound call ends busy, in voicemail, unanswered or missed.',
        timing: 'Instant',
        safeguards: ['Nothing is sent from the trigger itself: every call passes the exclusion filter first.'],
      },
      {
        kind: 'condition',
        label: 'Exclusion filter',
        role: 'If/Else filter',
        logic:
          'An If/Else removes contacts who should never get an automated text: anyone tagged `do-not-rent` or as a disqualified lead, and contacts with DND on.',
        timing: 'Instant',
        safeguards: ['Excluded contacts exit on the spot, with no tag, alert or message.'],
      },
      {
        kind: 'message',
        label: 'Tag, alert & text-back',
        role: 'SMS',
        logic:
          'Applies `missed-call-lead`, notifies the assigned rep, waits 1 minute, then sends the missed-call text-back with the booking link.',
        timing: '1-minute buffer',
        safeguards: [
          'The 1-minute wait makes the text read like a person, not a bot.',
          'The rep knows about the call before the caller gets the text.',
        ],
      },
      {
        kind: 'exit',
        label: 'Booking check & callback task',
        role: 'Exit',
        logic:
          'After 4 hours it checks for the `appointment-booked` tag. If it is missing, a follow-up SMS goes out; 24 hours later a `#1` callback task lands with the rep and `missed-call-lead` is removed.',
        timing: 'Follow-up at +4 h, callback task at +28 h',
        safeguards: [
          'Callers who booked leave through the None branch.',
          '`missed-call-lead` comes off once the task exists, so no stale tag is left behind.',
        ],
      },
    ],
    breakdown: {
      trigger: 'Any inbound call that ends busy, in voicemail, unanswered or missed.',
      hygiene:
        'Contacts tagged `do-not-rent` or disqualified, and DND contacts, are filtered out first. Applies `missed-call-lead` on entry and removes it once the callback task exists.',
      timing: '1 minute before the text-back, 4 hours before the booking check, 24 hours before the callback task.',
      branches: 'The first If/Else excludes do-not-contact records. The second checks for `appointment-booked` before following up.',
      exit: 'Callers who booked drop out. Everyone else ends with a callback task for the assigned rep.',
    },
    sms: [
      {
        when: '+1 min',
        label: 'Text-back',
        text: "Hey {{contact.first_name}}, sorry we just missed your call! How can we help? If you'd like to book a quick call, grab a time here: {{custom_values.booking_link}}",
      },
      {
        when: '+4 h',
        label: 'Still unbooked',
        text: 'Hi {{contact.first_name}}, following up on your call earlier—happy to chat whenever works best. You can book a slot here: {{custom_values.booking_link}}',
      },
    ],
  },
  {
    id: 'no-reply',
    tab: 'No-reply reactivation',
    short: 'No reply',
    title: 'Unanswered Message (No Reply) Reactivation',
    summary:
      'Leads tagged `awaiting-reply` who go quiet get two short check-ins over three days. If they stay silent, a clean tag swap moves them to long-term nurture without colliding with any other outreach loop.',
    image: {
      src: '/workflows/4-no-reply-reactivation.png',
      width: 2044,
      height: 445,
      alt: 'GoHighLevel workflow: awaiting reply tag added, wait 24 hours, an eligible-for-follow-up check, follow-up SMS, wait 48 hours, close-the-loop SMS, wait 24 hours before tagging, remove the awaiting-reply tag and add the cold-no-reply tag.',
    },
    nodes: [
      {
        kind: 'trigger',
        label: 'Awaiting-reply tag added',
        role: 'Trigger',
        logic: 'Starts when `awaiting-reply` is added to a contact.',
        timing: 'Instant',
        safeguards: ['Stop on Response is on: any reply ends the loop.'],
      },
      {
        kind: 'condition',
        label: '24-hour check & bump',
        role: 'If/Else check',
        logic:
          'Waits 24 hours, then an AND condition confirms the contact still has `awaiting-reply` and no `appointment-booked` tag before sending a short bump SMS.',
        timing: '+24 h',
        safeguards: ['Contacts who no longer match leave through the None branch.'],
      },
      {
        kind: 'message',
        label: 'Close-the-loop SMS',
        role: 'SMS',
        logic: 'Waits 48 hours, then sends a low-pressure close-the-loop message with the booking link.',
        timing: '+72 h',
        safeguards: ['Stop on Response covers the 48-hour wait: anyone who replied is already out.'],
      },
      {
        kind: 'exit',
        label: 'Tag swap exit',
        role: 'Exit',
        logic: '24 hours after the last message, strips `awaiting-reply` and applies `cold-no-reply`.',
        timing: '+96 h',
        safeguards: ['`awaiting-reply` comes off first, so no two outreach loops run on one contact.'],
      },
    ],
    breakdown: {
      trigger: 'The `awaiting-reply` tag being added. Stop on Response is on.',
      hygiene: 'Exits by swapping `awaiting-reply` for `cold-no-reply`, so the contact sits in one state at a time.',
      timing: '24 hours to the bump, 48 more to the close-the-loop text, 24 more to the tag swap: 4 days end to end.',
      branches: 'One AND check after the first wait: still `awaiting-reply` and not `appointment-booked`.',
      exit: 'Silent leads land in `cold-no-reply` for long-term nurture.',
    },
    sms: [
      {
        when: '+24 h',
        label: 'Bump',
        text: 'Hey {{contact.first_name}}, just bumping this up in case my last message got buried! Still want to get this sorted?',
      },
      {
        when: '+72 h',
        label: 'Close the loop',
        text: "Hi {{contact.first_name}}, I haven't heard back so I'll close this out for now—feel free to reply anytime or book here if you still need help: {{custom_values.booking_link}}",
      },
    ],
  },
];

export const BREAKDOWN_LABELS: [keyof Breakdown, string][] = [
  ['trigger', 'Trigger'],
  ['hygiene', 'Tag cleanup'],
  ['timing', 'Timing buffers'],
  ['branches', 'If/Else branches'],
  ['exit', 'Exit & escalation'],
];

// The tags the four workflows share, for the system prompt.
const TAGS =
  'Shared tags (the state machine): appointment-booked (set when confirmed; the missed-call and no-reply workflows check it), ' +
  'awaiting-reply (set by speed-to-lead; starts the no-reply workflow), missed-call-lead (missed-call workflow), ' +
  'missed-appointment (no-show or cancelled), cold-no-reply (end state for silent leads). ' +
  'A confirmed appointment strips every recovery tag, and every exit removes the active tag before adding the next, ' +
  'so a contact never sits in two outreach loops at once ("zero-collision tag hygiene").';

const plain = (s: string) => s.replace(/`/g, '');

// Plain-text version for the system prompt.
export const BOOKING_WORKFLOWS_TEXT =
  BOOKING_WORKFLOWS.map(
    (w, i) =>
      `Workflow ${i + 1}. ${w.title} (screenshot: ${w.image.src})\n` +
      `  ${plain(w.summary)}\n` +
      w.nodes
        .map(
          (n) =>
            `  - ${n.label} (${n.role}; timing: ${n.timing}): ${plain(n.logic)} Safeguards: ${n.safeguards.map(plain).join(' ')}`,
        )
        .join('\n') +
      `\n  Texts the lead receives: ${w.sms.map((m) => `[${m.when}, ${m.label}] "${m.text}"`).join(' ')}`,
  ).join('\n\n') + `\n\n${TAGS}`;
