'use client';

import { useChat } from '@ai-sdk/react';
import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'framer-motion';
import { Briefcase, CalendarDays, Layers, Mail, Moon, Pause, Play, RotateCcw, Smile, Sparkles, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Avatar, { type Mood } from '@/components/Avatar';
import Composer from '@/components/Composer';
import LiquidCursor from '@/components/LiquidCursor';
import Message, { Typing } from '@/components/Message';
import { CALL, FOLLOW_UPS, SITE } from '@/lib/site';

// The five cards under the hero chat box; each sends its prompt to the chat.
const QUICK = [
  { label: 'Me', prompt: 'Tell me about yourself', icon: Smile, tone: 'green' },
  { label: 'Projects', prompt: 'Show me your best projects', icon: Briefcase, tone: 'blue' },
  { label: 'Skills', prompt: 'What are your skills and the tools you use?', icon: Layers, tone: 'yellow' },
  { label: 'Fun', prompt: 'Tell me a fun fact', icon: Sparkles, tone: 'pink' },
  { label: 'Contact', prompt: 'How can I contact you?', icon: Mail, tone: 'peach' },
] as const;

type Theme = 'dark' | 'light';

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function readError(err: Error | undefined) {
  const text = err?.message?.trim() ?? '';
  if (!text || text.length > 220 || text.startsWith('<') || text.startsWith('{')) {
    return 'The reply did not come through. Check your connection, then try again.';
  }
  return text;
}

export default function Home() {
  const { messages, sendMessage, status, stop, error, regenerate, clearError } = useChat();
  const [theme, setTheme] = useState<Theme>('light');
  const [paused, setPaused] = useState(false);
  const [happy, setHappy] = useState(false);
  const scroller = useRef<HTMLElement>(null);
  const stick = useRef(true);
  const prevStatus = useRef(status);

  const started = messages.length > 0;
  const busy = status === 'submitted' || status === 'streaming';
  const last = messages[messages.length - 1];
  const lastText = (m: typeof last) =>
    m ? m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('') : '';
  const waiting = status === 'submitted' || (status === 'streaming' && last?.role === 'assistant' && !lastText(last));

  // Smile for a moment after a reply lands.
  useEffect(() => {
    let t: number | undefined;
    if (prevStatus.current === 'streaming' && status === 'ready') {
      setHappy(true);
      t = window.setTimeout(() => setHappy(false), 1900);
    }
    prevStatus.current = status;
    return () => window.clearTimeout(t);
  }, [status]);

  const mood: Mood = waiting ? 'thinking' : status === 'streaming' ? 'talking' : happy ? 'happy' : 'idle';

  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === 'light' || t === 'dark') setTheme(t);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#000000' : '#ffffff');
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'on';
  }, [paused]);

  const ask = useCallback(
    (text: string) => {
      if (status === 'submitted' || status === 'streaming') return;
      if (error) clearError();
      stick.current = true;
      sendMessage({ text });
    },
    [status, error, clearError, sendMessage],
  );

  // Follow the reply as it streams, until the reader scrolls up to read.
  useEffect(() => {
    const el = scroller.current;
    if (!el || !started) return;
    const release = (e: WheelEvent | TouchEvent | KeyboardEvent) => {
      if (e instanceof WheelEvent && e.deltaY >= 0) return;
      if (e instanceof KeyboardEvent && !['ArrowUp', 'PageUp', 'Home'].includes(e.key)) return;
      stick.current = false;
    };
    const onScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) stick.current = true;
    };
    el.addEventListener('wheel', release, { passive: true });
    el.addEventListener('touchmove', release, { passive: true });
    el.addEventListener('keydown', release);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('wheel', release);
      el.removeEventListener('touchmove', release);
      el.removeEventListener('keydown', release);
      el.removeEventListener('scroll', onScroll);
    };
  }, [started]);

  useEffect(() => {
    const el = scroller.current;
    if (el && started && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, started, error]);

  const statusLine =
    mood === 'thinking' ? 'Thinking…' : mood === 'talking' ? 'Typing…' : `${SITE.role}, ${SITE.location}`;

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className={`app ${started ? 'is-chat' : 'is-home'}`}>
          <a href="#ask" className="skip-link">
            Skip to the chat box
          </a>
          <LiquidCursor paused={paused} />

          <header className="topbar">
            <div className="wrap topbar-inner">
              <span className="brand">
                <span className="brand-mark" aria-hidden="true">
                  AB
                </span>
                <span className="brand-name">{SITE.name}</span>
              </span>
              <div className="topbar-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setPaused((p) => !p)}
                  aria-pressed={paused}
                  aria-label={paused ? 'Play animations' : 'Pause animations'}
                  title={paused ? 'Play animations' : 'Pause animations'}
                >
                  {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                  {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </button>
                <a
                  className="btn btn-primary btn-sm"
                  href={CALL.href}
                  {...(CALL.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Book a call
                </a>
              </div>
            </div>
          </header>

          <main id="main" ref={scroller} className="stage">
            {!started ? (
              <section className="hero" data-enter aria-labelledby="hello">
                <div className="wrap hero-inner">
                  <motion.div layoutId="avatar" className="hero-avatar" {...enter(0)}>
                    <Avatar mood={mood} paused={paused} />
                  </motion.div>
                  <motion.h1 id="hello" {...enter(0.12)}>
                    Hey, I’m {SITE.firstName} <span className="wave" aria-hidden="true">👋</span>
                  </motion.h1>
                  <motion.p className="hero-role" {...enter(0.2)}>
                    AI Automation Specialist — <span className="hero-place">Philippines</span>
                  </motion.p>
                  <motion.div className="hero-composer" {...enter(0.3)}>
                    <Composer busy={busy} onSend={ask} onStop={stop} autoFocus />
                  </motion.div>
                  <motion.ul className="quick" aria-label="Ask about" {...enter(0.4)}>
                    {QUICK.map(({ label, prompt, icon: Icon, tone }) => (
                      <li key={label}>
                        <button type="button" className="quick-card" onClick={() => ask(prompt)}>
                          <span className={`quick-badge tone-${tone}`} aria-hidden="true">
                            <Icon size={18} strokeWidth={2.2} />
                          </span>
                          {label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </div>
              </section>
            ) : (
              <section className="thread" aria-labelledby="chat-title">
                <h1 id="chat-title" className="sr-only">
                  Chat with {SITE.name}, {SITE.role}
                </h1>
                <div className="chat-head">
                  <div className="wrap chat-col chat-head-inner">
                    <motion.div layoutId="avatar" className="chat-avatar">
                      <Avatar mood={mood} paused={paused} />
                    </motion.div>
                    <div>
                      <p className="chat-name">{SITE.firstName}</p>
                      <p className="chat-status" aria-live="polite">
                        {statusLine}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="wrap chat-col">
                  <h2 className="sr-only">Conversation</h2>
                  <div className="log" role="log" aria-busy={busy}>
                    <AnimatePresence initial={false}>
                      {messages.map((m, i) => {
                        const text = lastText(m);
                        if (m.role === 'assistant' && !text) return null;
                        return (
                          <motion.div
                            key={m.id}
                            className={`row row-${m.role}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <Message
                              role={m.role === 'user' ? 'user' : 'assistant'}
                              text={text}
                              streaming={status === 'streaming' && i === messages.length - 1}
                              onAsk={ask}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {waiting && (
                      <div className="row row-assistant">
                        <Typing />
                      </div>
                    )}
                    {error && (
                      <div className="row row-assistant">
                        <div className="msg msg-bot msg-error" role="alert">
                          <p>{readError(error)}</p>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => regenerate()}>
                            <RotateCcw size={16} aria-hidden="true" />
                            Try again
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </main>

          {started && (
            <div className="dock">
              <div className="wrap chat-col">
                <ul className="chips chips-sm" aria-label="Quick questions">
                  {FOLLOW_UPS.map((f) => (
                    <li key={f.label}>
                      <button type="button" className="chip" onClick={() => ask(f.prompt)} disabled={busy}>
                        {f.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <Composer busy={busy} onSend={ask} onStop={stop} autoFocus />
              </div>
            </div>
          )}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
