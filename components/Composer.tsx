'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Square } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

type Props = {
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  autoFocus?: boolean;
};

const LONG = 'Ask about my projects, tools, or automating your business…';
const SHORT = 'Ask me anything…';

export default function Composer({ busy, onSend, onStop, autoFocus }: Props) {
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState(LONG);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const set = () => setPlaceholder(mq.matches ? SHORT : LONG);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // Grow with the text, up to about six lines.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    // An empty box stays one line tall, however long the placeholder.
    if (value) el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [value]);

  useEffect(() => {
    if (autoFocus && window.matchMedia('(pointer: fine)').matches) ref.current?.focus();
  }, [autoFocus]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue('');
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <motion.form layoutId="composer" className="composer" onSubmit={submit} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
      <label htmlFor="ask" className="sr-only">
        Ask Allyssa a question
      </label>
      <textarea
        id="ask"
        ref={ref}
        rows={1}
        value={value}
        maxLength={2000}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        enterKeyHint="send"
      />
      {busy ? (
        <button type="button" className="send is-stop" onClick={onStop} aria-label="Stop the reply">
          <Square size={16} fill="currentColor" aria-hidden="true" />
        </button>
      ) : (
        <button type="submit" className="send" aria-label="Send message" disabled={!value.trim()}>
          <ArrowUp size={20} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
    </motion.form>
  );
}
