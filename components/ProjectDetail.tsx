'use client';

import {
  CalendarClock,
  CalendarX,
  ChevronDown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Maximize2,
  Siren,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { FLEET_REPORTING, type Phase } from '@/lib/fleet-workflows';
import type { DetailConfig } from '@/lib/project-details';
import type { Project } from '@/lib/projects';
import BookingEngine from './BookingEngine';
import Lightbox from './Lightbox';
import Rich from './Rich';

const ALERT_ICONS = [Wrench, Siren, CalendarClock, CalendarX];

function PhasePanel({ phase, uid, label }: { phase: Phase; uid: string; label: string }) {
  const [preview, setPreview] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const img = phase.image;
  return (
    <>
      <div className="phase-head">
        <h3>{phase.title}</h3>
        <div className="phase-actions">
          {img && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setZoomed(true)} aria-haspopup="dialog">
              <Maximize2 size={16} aria-hidden="true" />
              Open workflow diagram
            </button>
          )}
          {phase.pdf && (
            <>
              <a className="btn btn-primary btn-sm" href={phase.pdf} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                View / Download Workflow PDF
              </a>
              <a className="btn btn-ghost btn-sm" href={phase.pdf} download>
                <Download size={16} aria-hidden="true" />
                Download
              </a>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                aria-expanded={preview}
                aria-controls={`${uid}-pdf`}
                onClick={() => setPreview((v) => !v)}
              >
                {preview ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                {preview ? 'Hide preview' : 'Preview here'}
              </button>
            </>
          )}
        </div>
      </div>

      {preview && phase.pdf && (
        <div id={`${uid}-pdf`} className="pdf-frame">
          <iframe src={`${phase.pdf}#view=FitH`} title={`${phase.title} workflow PDF`} loading="lazy" />
        </div>
      )}

      {phase.lead && (
        <>
          <h4 className="report-h">Problem solved</h4>
          <p className="report-lead phase-lead">{phase.lead}</p>
        </>
      )}

      {img && (
        <>
          <button
            type="button"
            className="shot-link phase-shot"
            onClick={() => setZoomed(true)}
            aria-haspopup="dialog"
            aria-label="Open the full workflow diagram"
          >
            <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" />
            <span className="wf-shot-open" aria-hidden="true">
              <Maximize2 size={16} />
            </span>
          </button>
          <Lightbox
            open={zoomed}
            onClose={() => setZoomed(false)}
            title={phase.title}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
          />
        </>
      )}

      <ol className="steps">
        {phase.steps.map((s, i) => (
          <li key={s.title}>
            <details className="step" id={`${uid}-step-${i}`} open={i === 0}>
              <summary>
                <span className="step-num">
                  {label} {i + 1}
                </span>
                <span className="step-title">{s.title}</span>
                <ChevronDown size={18} className="step-chev" aria-hidden="true" />
              </summary>
              <p>
                <Rich text={s.text} />
              </p>
            </details>
          </li>
        ))}
      </ol>
    </>
  );
}

// Shows the Telegram screenshot once public/docs/telegram-summary-sample.png
// exists; until then, a stand-in with the summary's four sections.
function TelegramSample() {
  const img = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading');

  useEffect(() => {
    const el = img.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? 'ok' : 'missing');
  }, []);

  if (state === 'missing') {
    return (
      <div className="tg" role="img" aria-label="Telegram Daily Summary layout: four alert sections">
        <div className="tg-bar">
          <img src="/icons/telegram.svg" alt="" width={20} height={20} />
          <span>Daily Summary</span>
        </div>
        <div className="tg-bubble">
          <b>Daily Summary</b>
          {FLEET_REPORTING.alerts.map((a, i) => {
            const Icon = ALERT_ICONS[i];
            return (
              <div key={a} className="tg-row">
                <Icon size={15} aria-hidden="true" />
                <span>{a}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <a href={FLEET_REPORTING.sample} target="_blank" rel="noopener noreferrer" className="shot-link">
      <img
        ref={img}
        src={FLEET_REPORTING.sample}
        alt="Telegram Daily Summary message listing maintenance and contract alerts"
        onLoad={() => setState('ok')}
        onError={() => setState('missing')}
      />
    </a>
  );
}

function ReportPanel() {
  const r = FLEET_REPORTING;
  return (
    <>
      <div className="phase-head">
        <h3>{r.title}</h3>
        <div className="phase-actions">
          <a className="btn btn-primary btn-sm" href={r.diagram} target="_blank" rel="noopener noreferrer">
            <Maximize2 size={16} aria-hidden="true" />
            Open workflow diagram
          </a>
        </div>
      </div>
      <p className="report-lead">{r.summary}</p>

      <ol className="pipe" aria-label="Make.com scenario">
        {r.pipeline.map((p) => (
          <li key={p.app}>
            <span className="pipe-icon">
              <img src={p.icon} alt="" width={22} height={22} />
            </span>
            <span>
              <b>{p.app}</b>
              <span className="pipe-action">{p.action}</span>
            </span>
          </li>
        ))}
      </ol>

      <h4 className="report-h">The 4 alerts it checks every day</h4>
      <ul className="alerts">
        {r.alerts.map((a, i) => {
          const Icon = ALERT_ICONS[i];
          return (
            <li key={a}>
              <span className={`alert-icon${i % 2 ? ' is-overdue' : ''}`} aria-hidden="true">
                <Icon size={18} />
              </span>
              {a}
            </li>
          );
        })}
      </ul>

      <div className="gallery">
        <div className="shot">
          <h4 className="report-h">Make.com scenario</h4>
          <a href={r.diagram} target="_blank" rel="noopener noreferrer" className="shot-link">
            <img
              src={r.diagram}
              alt="Make.com scenario scheduled daily: Google Sheets Get a Cell, then Tools Text aggregator, then Telegram Bot Send a Text Message"
              width={2228}
              height={1268}
              loading="lazy"
            />
          </a>
        </div>
        <div className="shot">
          <h4 className="report-h">Telegram Daily Summary</h4>
          <TelegramSample />
        </div>
      </div>
    </>
  );
}

type Props = { project: Project; config: DetailConfig; open: boolean; onClose: () => void };

export default function ProjectDetail({ project, config, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState(0);
  const [round, setRound] = useState(0); // remounts panels (closing previews) on each open
  const uid = useId();

  const tabs = [
    ...config.groups.map((g) => ({ id: g.id, tab: g.tab, short: g.short, count: g.steps.length as number | null })),
    ...(config.report ? [{ id: FLEET_REPORTING.id, tab: FLEET_REPORTING.tab, short: FLEET_REPORTING.short, count: null }] : []),
  ];
  const single = config.groups.length === 1; // one group: no tabs, the strip shows its steps

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setRound((n) => n + 1);
      d.showModal();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = tabs.length;
    const next = e.key === 'ArrowRight' ? (tab + 1) % n : e.key === 'ArrowLeft' ? (tab - 1 + n) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  };

  // Single-group projects: a strip node opens and scrolls to its step.
  const jumpToStep = (i: number) => {
    const el = document.getElementById(`${uid}-step-${i}`) as HTMLDetailsElement | null;
    if (!el) return;
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const group = config.groups[tab];

  return (
    <dialog
      ref={ref}
      className="detail"
      aria-labelledby={`${uid}-title`}
      onClose={(e) => {
        if (e.target === ref.current) onClose(); // not a nested lightbox closing
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      <div className="detail-panel">
        <header className="detail-head">
          <div>
            <h2 id={`${uid}-title`}>{project.title}</h2>
            <p>{project.summary}</p>
          </div>
          <button type="button" className="icon-btn detail-close" onClick={onClose} aria-label="Close project details">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="detail-scroll">
          <section className="detail-arch" aria-labelledby={`${uid}-arch`}>
            <h3 id={`${uid}-arch`}>{config.archTitle}</h3>
            {config.engine ? null : single ? (
              <ol
                className={`arch${config.groups[0].steps.length > 4 ? ' arch-rows' : ''}`}
                style={{ '--n': config.groups[0].steps.length } as CSSProperties}
              >
                {config.groups[0].steps.map((s, i) => (
                  <li key={s.title}>
                    <button type="button" className="arch-node" onClick={() => jumpToStep(i)}>
                      <span className="arch-count">{i + 1}</span>
                      <span className="arch-name">{s.short ?? s.title}</span>
                      {s.span && <span className="arch-span">{s.span}</span>}
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="arch" style={{ '--n': config.groups.length + (config.report ? 1 : 0) } as CSSProperties}>
                {config.groups.map((p, i) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`arch-node${i === tab ? ' is-active' : ''}`}
                      onClick={() => setTab(i)}
                      aria-controls={`${uid}-panel`}
                    >
                      <span className="arch-count">{p.steps.length}</span>
                      <span className="arch-name">{p.title.replace(/^Phase \d: /, '')}</span>
                      <span className="arch-span">
                        {p.steps[0].title.split(' (')[0]} to {p.steps[p.steps.length - 1].title.split(' (')[0]}
                      </span>
                    </button>
                  </li>
                ))}
                {config.report && (
                  <li className="arch-side">
                    <button
                      type="button"
                      className={`arch-node${tab === tabs.length - 1 ? ' is-active' : ''}`}
                      onClick={() => setTab(tabs.length - 1)}
                      aria-controls={`${uid}-panel`}
                    >
                      <span className="arch-count arch-icon">
                        <img src="/icons/telegram.svg" alt="" width={20} height={20} />
                      </span>
                      <span className="arch-name">Daily Executive Reporting Bot</span>
                      <span className="arch-span">Make.com, Google Sheets to Telegram</span>
                    </button>
                  </li>
                )}
              </ol>
            )}
            <ul className="badges detail-stack" aria-label="Built with">
              {[...project.stack, ...config.extraStack].map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {config.engine === 'booking' && <BookingEngine key={round} uid={uid} />}

          {!config.engine && tabs.length > 1 && (
            <div className="tabs" role="tablist" aria-label="Workflow phases">
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  id={`${uid}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === tab}
                  aria-controls={`${uid}-panel`}
                  tabIndex={i === tab ? 0 : -1}
                  className="tab"
                  onClick={() => setTab(i)}
                  onKeyDown={onTabKey}
                >
                  <span className="tab-long">{t.tab}</span>
                  <span className="tab-short">{t.short}</span>
                  {t.count !== null && <span className="tab-count">{t.count}</span>}
                </button>
              ))}
            </div>
          )}

          {!config.engine && (
          <section
            key={`${tab}-${round}`}
            id={`${uid}-panel`}
            {...(tabs.length > 1 ? { role: 'tabpanel', 'aria-labelledby': `${uid}-tab-${tab}` } : {})}
            className={`phase${tabs.length > 1 ? '' : ' is-single'}`}
          >
            {group ? <PhasePanel phase={group} uid={uid} label={config.stepLabel} /> : <ReportPanel />}
          </section>
          )}
        </div>
      </div>
    </dialog>
  );
}
