import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  smoothStream,
  streamText,
  toUIMessageStream,
  wrapLanguageModel,
  type UIMessage,
} from 'ai';
import { buildSystemPrompt, detectFocus } from '@/lib/prompt';
import { SITE } from '@/lib/site';

export const maxDuration = 30;

const MAX_HISTORY = 10; // messages sent to the model
const MAX_CHARS = 2000; // per user message
const MAX_OUTPUT = 1000; // reply allowance, reasoning included
// Groq's free tier allows 8,000 tokens per minute and counts a request as its
// prompt plus MAX_OUTPUT. Stay under it with room to spare.
const TOKEN_BUDGET = 7000;
const tokens = (chars: number) => Math.ceil(chars / 4); // measured ~4.5 chars per token on this prompt
const LIMIT = 20; // requests per IP per window
const WINDOW_MS = 60_000;

// Best-effort limiter. It holds on a single long-running server (Render);
// on serverless (Vercel) each instance keeps its own count.
const hits = new Map<string, { n: number; reset: number }>();

function limited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { n: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.n += 1;
  return entry.n > LIMIT;
}

// True for provider rate-limit errors (HTTP 429, per-minute or per-day caps),
// also when wrapped in a retry error.
function isRateLimit(error: unknown): boolean {
  const queue: unknown[] = [error];
  const seen = new Set<unknown>();
  while (queue.length) {
    const e = queue.shift() as { statusCode?: number; message?: unknown; cause?: unknown; lastError?: unknown; errors?: unknown } | null;
    if (!e || typeof e !== 'object' || seen.has(e)) continue;
    seen.add(e);
    if (e.statusCode === 429) return true;
    if (typeof e.message === 'string' && /rate.?limit|tokens per (day|minute)/i.test(e.message)) return true;
    queue.push(e.cause, e.lastError, ...(Array.isArray(e.errors) ? e.errors : []));
  }
  return false;
}

// When the main Groq model hits its rate limit, answer with a smaller model
// that has its own separate allowance, and skip the main one for a while.
const FALLBACK_COOLDOWN_MS = 10 * 60_000;
let primaryBlockedUntil = 0;

function groqWithFallback(apiKey: string, name: string | undefined) {
  const groq = createGroq({ apiKey, baseURL: process.env.GROQ_BASE_URL || undefined });
  // Groq retired the Llama 3.x 70B models; gpt-oss-120b is its strongest fast chat model.
  const primary = groq(name || 'openai/gpt-oss-120b');
  const fallback = groq(process.env.CHAT_FALLBACK_MODEL?.trim() || 'openai/gpt-oss-20b');
  return wrapLanguageModel({
    model: primary,
    middleware: {
      wrapStream: async ({ doStream, params }) => {
        if (Date.now() < primaryBlockedUntil) return fallback.doStream(params);
        try {
          return await doStream();
        } catch (error) {
          if (!isRateLimit(error)) throw error;
          primaryBlockedUntil = Date.now() + FALLBACK_COOLDOWN_MS;
          console.warn('[chat] main model rate-limited; answering with the fallback model for 10 minutes');
          return fallback.doStream(params);
        }
      },
    },
  });
}

function pickModel() {
  const name = process.env.CHAT_MODEL?.trim();
  if (process.env.GROQ_API_KEY) return groqWithFallback(process.env.GROQ_API_KEY, name);
  if (process.env.OPENAI_API_KEY) {
    return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(name || 'gpt-4o-mini');
  }
  return null;
}

function fail(message: string, status: number) {
  return new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (limited(ip)) return fail('Too many messages in a minute. Wait a moment, then send again.', 429);

  const model = pickModel();
  if (!model) {
    return fail(
      'The chat is not connected yet. Add GROQ_API_KEY or OPENAI_API_KEY to the environment and restart the server.',
      503,
    );
  }

  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return fail('The message could not be read. Send it again.', 400);
  }
  if (messages.length === 0) return fail('Type a message before sending.', 400);

  // Trim history and over-long text so one visitor can't run up the bill.
  const recent = messages.slice(-MAX_HISTORY).map((m) => ({
    ...m,
    parts: m.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p.type === 'text' ? { ...p, text: p.text.slice(0, MAX_CHARS) } : p)),
  }));
  const textOf = (m: (typeof recent)[number]) => m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('');

  // Load full detail only for the projects this visitor is asking about.
  let focus = detectFocus(recent.filter((m) => m.role === 'user').map(textOf));
  let system = buildSystemPrompt(focus);
  const size = () => tokens(system.length + recent.reduce((n, m) => n + textOf(m).length, 0)) + MAX_OUTPUT;
  // Over budget: drop the second project's detail, then the oldest messages.
  if (size() > TOKEN_BUDGET && focus.length > 1) {
    focus = focus.slice(0, 1);
    system = buildSystemPrompt(focus);
  }
  while (size() > TOKEN_BUDGET && recent.length > 1) recent.shift();

  const result = streamText({
    model,
    system,
    messages: await convertToModelMessages(recent),
    // gpt-oss reasons before it answers: keep that short and out of the reply,
    // and leave room for it inside the token cap.
    maxOutputTokens: MAX_OUTPUT,
    temperature: 0.5, // a little lower: workflow answers must match the listed logic
    providerOptions: { groq: { reasoningEffort: 'low', reasoningFormat: 'hidden' } },
    experimental_transform: smoothStream({ delayInMs: 12, chunking: 'word' }),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error('[chat] reply failed:', error instanceof Error ? error.message : error);
        return isRateLimit(error)
          ? `I'm getting more questions than I can answer right now. Try again in a few minutes, or email me at ${SITE.email}.`
          : 'The reply stopped halfway. Send your message again.';
      },
    }),
  });
}
