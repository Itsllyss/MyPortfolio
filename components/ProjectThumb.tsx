import type { ProjectId } from '@/lib/projects';

// Thumbnails show the work without client names. Fleet and listings are live
// HTML/SVG built from the real SOP stages, tags and boards (no screenshots of
// those systems were supplied); the AI project is a cropped screenshot of the
// real Daily Market Watch report, cut below the team/agency line.
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

  // fleet
  const cols = [
    { name: 'Reserved', cards: [{ code: 'MS01', cls: 'Midsize', tag: 'reservation-reviewed' }] },
    {
      name: 'Rented',
      cards: [
        { code: 'FS01', cls: 'Fullsize', tag: 'active-rental' },
        { code: 'SV01', cls: 'SUV', tag: 'active-rental' },
      ],
    },
    { name: 'Maintenance', cards: [{ code: 'MS02', cls: 'Midsize', tag: 'vehicle-maintenance', live: true }] },
    { name: 'Available', cards: [{ code: 'FS02', cls: 'Fullsize', tag: 'past-rental' }] },
  ];
  return (
    <div
      className="thumb thumb-ui thumb-fleet"
      role="img"
      aria-label="Vehicle inventory pipeline with Reserved, Rented, Maintenance and Available stages, and an automatic maintenance SMS"
    >
      <div className="fl">
      <div className="fl-bar">
        <span className="fl-title">Vehicle inventory</span>
        <span className="fl-count">5 vehicles</span>
      </div>
      <div className="fl-cols">
        {cols.map((c) => (
          <div className="fl-col" key={c.name}>
            <span className="fl-col-name">{c.name}</span>
            {c.cards.map((card) => (
              <div className={`fl-card${'live' in card && card.live ? ' is-live' : ''}`} key={card.code}>
                <b>{card.code}</b>
                <span>{card.cls}</span>
                <i>{card.tag}</i>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="fl-toast">
        <span className="fl-dot" />
        SMS sent: maintenance reminder
      </div>
      </div>
    </div>
  );
}
