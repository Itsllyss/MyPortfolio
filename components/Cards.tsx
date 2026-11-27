'use client';

import { Award, Building2, CalendarDays, Mail, MapPin, Video } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ABOUT } from '@/lib/about';
import { CERTIFICATES } from '@/lib/certificates';
import { DETAILS } from '@/lib/project-details';
import { PROJECTS, getProject, type Project } from '@/lib/projects';
import { CALL, SITE } from '@/lib/site';
import ProjectDetail from './ProjectDetail';
import ProjectThumb from './ProjectThumb';

type Ask = (text: string) => void;

function ProjectCard({ project, onAsk, wide }: { project: Project; onAsk?: Ask; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  const detail = DETAILS[project.id];
  const hasDetail = !!detail;
  const linked = hasDetail || !!onAsk;
  return (
    <article className={`pcard${wide ? ' pcard-wide' : ''}${linked ? ' is-linked' : ''}`}>
      <div className="pcard-media">
        <ProjectThumb id={project.id} />
      </div>
      <div className="pcard-body">
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <ul className="badges" aria-label="Key results">
          {project.metrics.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        {hasDetail ? (
          <button type="button" className="pcard-cta link" onClick={() => setOpen(true)} aria-haspopup="dialog">
            {detail.cta}
          </button>
        ) : (
          onAsk && (
            <button type="button" className="pcard-cta link" onClick={() => onAsk(project.ask)}>
              See how it works
            </button>
          )
        )}
      </div>
      {hasDetail &&
        typeof document !== 'undefined' &&
        createPortal(
          <ProjectDetail project={project} config={detail} open={open} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </article>
  );
}

export function ProjectGrid({ onAsk }: { onAsk: Ask }) {
  return (
    <div className="pgrid">
      {PROJECTS.map((p, i) => (
        // an odd last card spans the row instead of sitting alone
        <ProjectCard key={p.id} project={p} onAsk={onAsk} wide={i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1} />
      ))}
    </div>
  );
}

export function ProjectSingle({ id }: { id: string }) {
  const project = getProject(id);
  if (!project) return null;
  return <ProjectCard project={project} wide />;
}

// Real logos (simple-icons, CC0) where one exists; the rest are named in text,
// never redrawn.
const TOOLS: { group: string; items: { name: string; icon?: string; tile?: string }[] }[] = [
  { group: 'CRM and funnels', items: [{ name: 'GoHighLevel' }, { name: 'Agentbox CRM' }, { name: 'Systeme.io' }] },
  {
    group: 'Boards and automation',
    items: [{ name: 'monday.com' }, { name: 'Make.com', icon: '/icons/make.svg' }, { name: 'n8n', icon: '/icons/n8n.svg' }],
  },
  {
    group: 'AI and data',
    items: [
      { name: 'Claude', icon: '/icons/claude.svg' },
      { name: 'Google Gemini Vision', icon: '/icons/googlegemini.svg' },
      { name: 'OpenAI' },
      { name: 'Homer' },
    ],
  },
  {
    group: 'Messages and booking',
    items: [
      { name: 'WhatsApp', icon: '/icons/whatsapp.svg' },
      { name: 'Mailchimp', icon: '/icons/mailchimp.svg', tile: 'mailchimp' },
      { name: 'Calendly', icon: '/icons/calendly.svg' },
    ],
  },
];

export function ToolsGrid() {
  return (
    <div className="tools">
      {TOOLS.map((g) => (
        <div className="tools-group" key={g.group}>
          <h3>{g.group}</h3>
          <ul>
            {g.items.map((t) => (
              <li key={t.name} className="tool">
                {t.icon && (
                  <span className={`tool-icon${t.tile ? ` tile-${t.tile}` : ''}`}>
                    <img src={t.icon} alt="" width={20} height={20} />
                  </span>
                )}
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function CertificateCards() {
  return (
    <ul className="certs">
      {CERTIFICATES.map((c) => (
        <li key={c.title} className="cert">
          <span className="cert-badge" aria-hidden="true">
            <Award size={20} strokeWidth={2.1} />
          </span>
          <div className="cert-body">
            <h3>{c.title}</h3>
            <p className="cert-meta">
              <span>{c.issuer}</span>
              <span>
                {c.date}
                {c.duration ? `, ${c.duration}` : ''}
              </span>
            </p>
            <ul className="badges" aria-label="What it covered">
              {c.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AboutCard() {
  return (
    <section className="about" aria-label="About Allyssa">
      <div className="about-head">
        <img className="about-avatar" src="/avatar/frames/frame_091.webp" alt="" width={56} height={56} />
        <div>
          <h3>{ABOUT.headline}</h3>
          <p className="about-meta">
            <span>
              <MapPin size={14} aria-hidden="true" />
              {ABOUT.location}
            </span>
            <span>
              <Building2 size={14} aria-hidden="true" />
              {ABOUT.experience}
            </span>
          </p>
        </div>
      </div>
      <p className="about-pitch">{ABOUT.pitch}</p>
      <ul className="about-stack" aria-label="Core stack">
        {ABOUT.stack.map((t) => (
          <li key={t.name} className="tool">
            {'icon' in t && (
              <span className="tool-icon">
                <img src={t.icon} alt="" width={16} height={16} />
              </span>
            )}
            {t.name}
          </li>
        ))}
      </ul>
      <ol className="services">
        {ABOUT.services.map((s, i) => (
          <li key={s.title}>
            <span className="service-step" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <a
        className="btn btn-primary"
        href={CALL.href}
        {...(CALL.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <CalendarDays size={18} aria-hidden="true" />
        Book a free discovery call
      </a>
    </section>
  );
}

export function ContactCard() {
  return (
    <div className="contact">
      <h3>Let’s look at your workflow together</h3>
      <p className="contact-note">
        <Video size={16} aria-hidden="true" />
        Free discovery call on Google Meet. Pick a time on my calendar, or email {SITE.email}.
      </p>
      <div className="contact-actions">
        <a
          className="btn btn-primary"
          href={CALL.href}
          {...(CALL.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <CalendarDays size={18} aria-hidden="true" />
          Book a free call
        </a>
        <a className="btn btn-ghost" href={`mailto:${SITE.email}?subject=Automation%20project`}>
          <Mail size={18} aria-hidden="true" />
          Email me
        </a>
      </div>
    </div>
  );
}
