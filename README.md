# Allyssa Bulo, AI portfolio

An AI-native portfolio: visitors chat with Allyssa's animated avatar, which answers from her
resume and case studies and shows project cards, her tool stack and contact buttons right in the
conversation.

- **Next.js 16** (App Router) + **Vercel AI SDK 7** streaming chat
- **Groq** (`openai/gpt-oss-120b`) or **OpenAI** (`gpt-4o-mini`)
- **Framer Motion** avatar and transitions, **lucide-react** icons
- Light/dark mode, a rainbow liquid trail that follows the mouse, a splash on click

## Run it locally

You need **Node.js 20.9 or newer** (get the LTS installer from nodejs.org; check with `node -v`).

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and add **one** API key:

```bash
GROQ_API_KEY=gsk_...        # free tier at console.groq.com (checked first)
# or
OPENAI_API_KEY=sk-...       # platform.openai.com
```

Then fill in your contact details. The avatar shares these, and the **Book a call** button opens
the link:

```bash
NEXT_PUBLIC_BOOKING_URL=https://calendar.app.google/3czX9RJBpxAWNuPa6
NEXT_PUBLIC_CONTACT_EMAIL=lysabulo@outlook.com
```

```bash
npm run dev
```

Open http://localhost:3000. If you leave the key out, the chat says it isn't connected yet.

## Deploy to Render

1. Push this folder to a GitHub repo. `.gitignore` keeps the source PDFs and SOPs out, because
   they contain client names and your phone number.
2. In Render: **New → Blueprint**, pick the repo. `render.yaml` sets the build (`npm ci && npm run build`)
   and start (`npm start`) commands.
3. Under **Environment**, add `GROQ_API_KEY` (or `OPENAI_API_KEY`), `NEXT_PUBLIC_BOOKING_URL`,
   `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_SITE_URL` (your Render address, e.g.
   `https://allyssa-ai-portfolio.onrender.com`).
4. Deploy. `NEXT_PUBLIC_*` values are read at build time, so redeploy after changing them.

Without a blueprint: **New → Web Service**, Node runtime, build `npm ci && npm run build`, start
`npm start`, same environment variables.

> Render's free plan sleeps after 15 minutes idle; the first visit after that takes ~30 s.

## Deploy to Vercel

Import the repo at vercel.com/new, add the same environment variables, deploy. No `vercel.json`
is needed: the chat route sets its own `maxDuration`.

## Make it yours

| What | Where |
|---|---|
| Everything the avatar knows (resume, projects, fun facts, tone) | `lib/prompt.ts` |
| Project cards: titles, summaries, metric badges | `lib/projects.ts` |
| Certificates | `lib/certificates.ts` |
| Project thumbnails | `components/ProjectThumb.tsx`, `public/projects/` |
| Name, role, suggestion chips | `lib/site.ts` |
| Colours, type, layout | `app/globals.css` (tokens at the top) |
| Model and limits | `app/api/chat/route.ts` (or set `CHAT_MODEL`) |

### Cards in the chat

The system prompt tells the model to write these tokens on their own line. The page turns them
into visual cards:

| Token | Shows |
|---|---|
| `<<projects>>` | all three project cards |
| `<<project:fleet>>`, `<<project:listings>>`, `<<project:ai>>` | one project, wide |
| `<<tools>>` | the tool stack with logos |
| `<<certificates>>` | the two certificate cards (`lib/certificates.ts`) |
| `<<contact>>` | Book a call (Google Calendar, Meet) + Email buttons |

### The avatar

The avatar is your Adobe Firefly turn-and-smile clip, cut into frames. It opens on the
front-facing frame (`frame_091`) and turns its head to follow the mouse, then faces front again
2.5 s after the mouse stops. While it thinks, the glow ring pulses; while a reply streams, it bobs.

- `avatar.mp4` + `avatar-frames/`: the original video and all 96 full-size frames (WebP).
- `public/avatar/frames/`: the 41 frames the site uses (77–96 and 1–21), cropped to the head,
  white background removed, 480×480 WebP, ~900 KB in total.

To swap in a new clip, extract its frames the same way and keep the file names; the frame order
used for each head angle is the `SEQ` list in `components/Avatar.tsx`.

### Real screenshots

The rental and listing thumbnails are live HTML built from the real SOP stages, because no
screenshots of those systems were supplied. To use real ones, crop out any client names, save
them in `public/projects/`, and swap the markup in `components/ProjectThumb.tsx` for an `<img>`,
as the `ai` thumbnail does.

## Notes

- **Cost guard:** the chat route sends at most 16 messages of history, cuts messages at 2,000
  characters, caps replies at 1,400 tokens (reasoning included) and allows 20 requests a minute per visitor. The limit is
  in memory: it holds on Render's single server, and is best-effort on Vercel.
- **Accessibility:** a skip link, a visible focus ring, labelled controls, a pause button for all
  animation, and `prefers-reduced-motion` turns the trail and loops off.
- **Proxy:** `GROQ_BASE_URL` points the Groq client at another
  OpenAI-compatible endpoint if you ever need one.
