'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { hasCards, toBlocks } from '@/lib/blocks';
import { CertificateCards, ContactCard, ProjectGrid, ProjectSingle, ToolsGrid } from './Cards';

type Props = {
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  onAsk: (text: string) => void;
};

const Markdown = memo(function Markdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="link">
            {children}
          </a>
        ),
        h1: ({ children }) => <p className="md-strong">{children}</p>,
        h2: ({ children }) => <p className="md-strong">{children}</p>,
        h3: ({ children }) => <p className="md-strong">{children}</p>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
});

function Message({ role, text, streaming = false, onAsk }: Props) {
  if (role === 'user') {
    return (
      <div className="msg msg-user">
        <span className="sr-only">You said: </span>
        <p>{text}</p>
      </div>
    );
  }

  const blocks = toBlocks(text, streaming);
  return (
    <div className={`msg msg-bot${hasCards(blocks) ? ' is-wide' : ''}`}>
      <span className="sr-only">Allyssa said: </span>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'md':
            return (
              <div className="md" key={i}>
                <Markdown text={b.text} />
              </div>
            );
          case 'projects':
            return <ProjectGrid key={i} onAsk={onAsk} />;
          case 'project':
            return <ProjectSingle key={i} id={b.id} />;
          case 'tools':
            return <ToolsGrid key={i} />;
          case 'certificates':
            return <CertificateCards key={i} />;
          case 'contact':
            return <ContactCard key={i} />;
        }
      })}
    </div>
  );
}

export default memo(Message);

export function Typing() {
  return (
    <div className="msg msg-bot msg-typing" aria-label="Allyssa is typing">
      <span />
      <span />
      <span />
    </div>
  );
}
