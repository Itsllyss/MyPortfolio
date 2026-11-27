import type { ProjectId } from '@/lib/projects';

// Thumbnails show the work without client names. Fleet is Workflow 1 from the
// GoHighLevel workflow PDFs; listings is live SVG built from the real SOP
// boards (no screenshot supplied); the AI project is a cropped screenshot of
// the real Daily Market Watch report, cut below the team/agency line.
// Client slot: drop real screenshots in public/projects/ and swap them in here.

export default function ProjectThumb({ id }: { id: ProjectId }) {
  if (id === 'ai') {
    return (
      <div className="thumb thumb-shot">
        <img
          src="/projects/market-watch.jpg"
          alt="Daily Market Watch report: 1,097 active listings, 5 sold, 13 price rises, with a suburb selector"
          width={818}
          height={491}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (id === 'invoice') {
    return (
      <div className="thumb thumb-shot">
        <img
          src="/projects/invoice-workflow.jpg"
          alt="n8n workflow: Gemini analyzes the receipt, the JSON is parsed, the file is uploaded to Drive, and a Total Over 500 check routes to Log Pending Approval or Log Auto-Approved in Google Sheets"
          width={980}
          height={612}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (id === 'booking') {
    return (
      <div className="thumb thumb-shot">
        <img
          src="/projects/booking-workflow.jpg"
          alt="GoHighLevel workflow: appointment cancelled, confirmed and no-show triggers feed one router that splits into a no-show or cancelled branch and a confirmed branch"
          width={832}
          height={520}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (id === 'listings') {
    const lanes = [
      { y: 62, label: 'Listings', note: 'Listing card' },
      { y: 150, label: 'Vendor Details', note: 'Property record' },
      { y: 238, label: 'Listing Checklist', note: 'Board per address' },
    ];
    return (
      <div className="thumb thumb-ui">
        <svg
          viewBox="0 0 480 300"
          role="img"
          aria-label="Diagram: a property marked Listed runs a Make.com scenario that builds the Listings card, the Vendor Details record and a Listing Checklist board"
        >
          <rect width="480" height="300" fill="#f6f8fa" />
          {lanes.map((l) => (
            <g key={l.label}>
              <path d={`M232 150 C 268 150, 268 ${l.y}, 304 ${l.y}`} className="flow-line" />
              <path d={`M232 150 C 268 150, 268 ${l.y}, 304 ${l.y}`} className="flow-pulse" />
            </g>
          ))}
          <path d="M120 150 L 168 150" className="flow-line" />
          <path d="M120 150 L 168 150" className="flow-pulse flow-pulse-in" />

          {/* input: the status change */}
          <rect x="18" y="122" width="102" height="56" rx="10" fill="#ffffff" stroke="#d7dde2" />
          <text x="30" y="144" className="ui-label">Leads board</text>
          <rect x="30" y="152" width="58" height="18" rx="9" fill="#00a35c" />
          <text x="59" y="165" className="ui-pill" textAnchor="middle">Listed</text>

          {/* processor */}
          <rect x="168" y="118" width="64" height="64" rx="16" fill="#ffffff" stroke="#d7dde2" />
          <image href="/icons/make.svg" x="182" y="132" width="36" height="36" />

          {/* three lanes */}
          {lanes.map((l) => (
            <g key={l.label}>
              <rect x="304" y={l.y - 26} width="158" height="52" rx="10" fill="#ffffff" stroke="#d7dde2" />
              <rect x="316" y={l.y - 12} width="24" height="24" rx="6" fill="#e3f6fb" />
              <path d={`M322 ${l.y - 2} h12 M322 ${l.y + 3} h8`} stroke="#0a7ea4" strokeWidth="2" strokeLinecap="round" />
              <text x="350" y={l.y - 2} className="ui-title">{l.label}</text>
              <text x="350" y={l.y + 13} className="ui-label">{l.note}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // fleet: Workflow 1, ad lead intake into Conversation AI (no client names on it)
  return (
    <div className="thumb thumb-shot">
      <img
        src="/projects/fleet-workflow.jpg"
        alt="GoHighLevel workflow: survey submitted, opportunity created, Meta Conversion API, alerts, email, then Conversation AI branching on Positive, Neutral, Future, Negative and Timeout replies"
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
