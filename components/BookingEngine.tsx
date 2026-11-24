'use client';

import { Braces, Flag, Maximize2, MessageSquareText, Zap, type LucideIcon } from 'lucide-react';
import { Fragment, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { BOOKING_WORKFLOWS, BREAKDOWN_LABELS, type BookingWorkflow, type NodeKind } from '@/lib/booking-workflows';
import Lightbox from './Lightbox';
import Rich from './Rich';

const NODE_ICONS: Record<NodeKind, LucideIcon> = {
  trigger: Zap,
  condition: Braces,
  message: MessageSquareText,
  exit: Flag,
};

// {{merge.fields}} in a text message render as chips.
function SmsText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/).map((part, i) =>
        i % 2 ? (
          <span key={i} className="sms-var">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Phone({ wf }: { wf: BookingWorkflow }) {
  return (
    <div className="phone" role="img" aria-label={`Text messages the lead receives: ${wf.sms.map((m) => `${m.when}, ${m.text}`).join(' ')}`}>
      <div className="phone-screen">
        <div className="phone-head" aria-hidden="true">
          <span className="phone-avatar">
            <MessageSquareText size={16} />
          </span>
          <span className="phone-name">Text message</span>
        </div>
        <ol className="sms" aria-hidden="true">
          {wf.sms.map((m, i) => (
            <li key={m.when + m.label} style={{ '--i': i } as CSSProperties}>
              <span className="sms-when">
                <b>{m.when}</b> {m.label}
              </span>
              <p className="sms-bubble">
                <SmsText text={m.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function WorkflowPanel({ wf, uid }: { wf: BookingWorkflow; uid: string }) {
  const [node, setNode] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const n = wf.nodes[node];

  return (
    <>
      <div className="phase-head">
        <h3>{wf.title}</h3>
        <div className="phase-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setZoomed(true)} aria-haspopup="dialog">
            <Maximize2 size={16} aria-hidden="true" />
            Open workflow diagram
          </button>
        </div>
      </div>
      <p className="report-lead">
        <Rich text={wf.summary} />
      </p>

      <h4 className="report-h">Workflow path</h4>
      <ol className="arch wf-flow" style={{ '--n': wf.nodes.length } as CSSProperties} aria-label="Workflow path">
        {wf.nodes.map((s, i) => {
          const Icon = NODE_ICONS[s.kind];
          return (
            <li key={s.label}>
              <button
                type="button"
                className={`arch-node${i === node ? ' is-active' : ''}`}
                aria-pressed={i === node}
                aria-controls={`${uid}-inspect`}
                onClick={() => setNode(i)}
              >
                <span className={`arch-count wf-kind is-${s.kind}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="arch-name">{s.label}</span>
                <span className="arch-span">{s.role}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div id={`${uid}-inspect`} className="wf-inspect" aria-live="polite">
        <div className="wf-inspect-col">
          <h5>Step logic</h5>
          <p>
            <Rich text={n.logic} />
          </p>
        </div>
        <div className="wf-inspect-col">
          <h5>Wait timing</h5>
          <p className="wf-timing">{n.timing}</p>
        </div>
        <div className="wf-inspect-col">
          <h5>Safeguard rules</h5>
          <ul>
            {n.safeguards.map((g) => (
              <li key={g}>
                <Rich text={g} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h4 className="report-h">Stage by stage</h4>
      <ul className="wf-cards">
        {BREAKDOWN_LABELS.map(([key, label]) => (
          <li key={key} className="wf-card">
            <h5>{label}</h5>
            <p>
              <Rich text={wf.breakdown[key]} />
            </p>
          </li>
        ))}
      </ul>

      <div className="wf-proof">
        <div className="wf-proof-shot">
          <h4 className="report-h">The workflow in GoHighLevel</h4>
          <button
            type="button"
            className="shot-link wf-shot"
            onClick={() => setZoomed(true)}
            aria-haspopup="dialog"
            aria-label={`Open the full ${wf.title} workflow diagram`}
          >
            <img src={wf.image.src} alt={wf.image.alt} width={wf.image.width} height={wf.image.height} loading="lazy" />
            <span className="wf-shot-open" aria-hidden="true">
              <Maximize2 size={16} />
            </span>
          </button>
        </div>
        <div className="wf-proof-phone">
          <h4 className="report-h">What the lead receives</h4>
          <Phone wf={wf} />
        </div>
      </div>

      <Lightbox
        open={zoomed}
        onClose={() => setZoomed(false)}
        title={wf.title}
        src={wf.image.src}
        alt={wf.image.alt}
        width={wf.image.width}
        height={wf.image.height}
      />
    </>
  );
}

export default function BookingEngine({ uid }: { uid: string }) {
  const [tab, setTab] = useState(0);
  const wfs = BOOKING_WORKFLOWS;

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const count = wfs.length;
    const next = e.key === 'ArrowRight' ? (tab + 1) % count : e.key === 'ArrowLeft' ? (tab - 1 + count) % count : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(next);
    document.getElementById(`${uid}-wtab-${next}`)?.focus();
  };

  return (
    <>
      <div className="tabs tabs-wf" role="tablist" aria-label="Workflows">
        {wfs.map((w, i) => (
          <button
            key={w.id}
            id={`${uid}-wtab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === tab}
            aria-controls={`${uid}-wpanel`}
            tabIndex={i === tab ? 0 : -1}
            className="tab"
            onClick={() => setTab(i)}
            onKeyDown={onTabKey}
          >
            <span className="tab-num">{i + 1}</span>
            <span className="tab-long">{w.tab}</span>
            <span className="tab-short">{w.short}</span>
          </button>
        ))}
      </div>
      <section
        key={wfs[tab].id}
        id={`${uid}-wpanel`}
        role="tabpanel"
        aria-labelledby={`${uid}-wtab-${tab}`}
        className="phase"
      >
        <WorkflowPanel wf={wfs[tab]} uid={`${uid}-w${tab}`} />
      </section>
    </>
  );
}
