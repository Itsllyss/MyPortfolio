'use client';

import { Award, CalendarDays, Mail, Video } from 'lucide-react';
import { CERTIFICATES } from '@/lib/certificates';
import { PROJECTS, getProject, type Project } from '@/lib/projects';
import { CALL, SITE } from '@/lib/site';
import ProjectThumb from './ProjectThumb';

type Ask = (text: string) => void;

function ProjectCard({ project, onAsk, wide }: { project: Project; onAsk?: Ask; wide?: boolean }) {
  return (
    <article className={`pcard${wide ? ' pcard-wide' : ''}${onAsk ? ' is-linked' : ''}`}>
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
        {onAsk && (
          <button type="button" className="pcard-cta link" onClick={() => onAsk(project.ask)}>
            See how it works
          </button>
        )}
      </div>
    </article>
  );
}

export function ProjectGrid({ onAsk }: { onAsk: Ask }) {
  return (
    <div className="pgrid">
      {PROJECTS.map((p) => (
        <ProjectCard key={p.id} project={p} onAsk={onAsk} />
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
  { group: 'Boards and automation', items: [{ name: 'monday.com' }, { name: 'Make.com', icon: '/icons/make.svg' }] },
  { group: 'AI and data', items: [{ name: 'Claude', icon: '/icons/claude.svg' }, { name: 'Homer' }] },
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
