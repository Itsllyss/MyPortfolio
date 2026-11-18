# Interactive Portfolio

A personal interactive portfolio website. The project is new. `taste-skill.md` (tasteskill 2.5.1)
is the design source of truth, with the project's `frontend-design` skill on top of it (see Design
skills). When this file and `taste-skill.md` disagree, `taste-skill.md` wins.

The tasteskill kit it refers to (`assets/`, `scripts/`, `references/`, `gate.mjs`, `deal.mjs`,
`copy-lint.mjs` and so on) is **not installed** here. Apply the rules by hand. Do not invent those
scripts or call them; if the kit gets installed later, follow the run in `taste-skill.md`
section 4 instead.

## Design skills

Two design sources apply, in this order:

1. **`taste-skill.md`** (tasteskill 2.5.1): the house rules, kinds, process and checklist below.
2. **`frontend-design` skill**, installed at `.claude/skills/frontend-design/SKILL.md` (from
   `anthropics/claude-plugins-official`). Invoke it before any design or build work and follow it
   wherever `taste-skill.md` is silent.

From `frontend-design`, always apply:

- **Ground the design in the subject.** Identify the subject, audience and the page's main job
  first (propose them and confirm if the brief doesn't say); draw palette, type and imagery from
  that subject's world and vernacular.
- **Plan, review, then build.** Write a compact token plan first: 4–6 named hex colours, the
  typefaces and their roles, a layout concept with ASCII wireframes and alignment, and the page's
  principles. Review it against the brief and revise any part that reads like a default you'd give
  any similar page, saying what changed and why. Only then write code.
- **Typography carries the personality.** One or two deliberately chosen families (clearly distinct
  if two), a clear type scale, body lines under 80 characters, a little more line-height for serif
  body text. Type in headlines is an active part of the design.
- **Avoid the generated-page tells:** one accented word in a headline (italic, bold or a different
  colour); all-caps labels; labels above every heading; `01 / 02 / 03` markers on content that isn't
  a sequence; meta strings joined with ` · `; `WORD — fragment` labels; `→` appended to buttons and
  links; a monospace face for small labels; tinted near-black (`#0B0B0B`, `#111`) in place of
  black; identical rounded cards with the same grey shadow; gradient washes as decoration.
- **Avoid the clustered default looks** unless the brief asks for one: cream (`#F4F1EA`) + serif +
  terracotta (`#D97757`); near-black + one acid-green or vermilion accent; broadsheet hairlines with
  zero radius; the SaaS card kit.
- **Restraint:** spend boldness in one place; keep the rest quiet; remove one accessory before
  shipping. Watch CSS specificity so section and button classes don't cancel each other's spacing.
- **Copy:** plain words from the user's side, active voice, sentence case; a button says what
  happens and keeps that name through the flow ("Publish" → "Published"); errors say what went
  wrong and how to fix it, without apologising.

**Where they conflict, `taste-skill.md` wins.** In particular: tasteskill's hover layer stays (a
linked card lifts 2px, photos zoom, buttons step and press), even though `frontend-design` calls
hover on every card a generic default; and the page keeps its hero entrance plus one or two dealt
moments, which matches `frontend-design`'s "one orchestrated moment" rather than scattered
fade-ins. Do keep hover motion small and quiet.

## Stack

- Default: a static site (`index.html`, plain CSS and JS) unless the user picks a framework.
- An existing framework project builds in its own stack; a Next.js build uses `output: 'export'`.
- Keep the site working from a local http server (never rely on `file://`).

## The bar

Build what a good company would ship: it says plainly what is offered, shows the real work on
every screen, and looks made for this person, not from a template and not like an art piece.
figma.com and x.ai are the bar.

## House rules (these win over everything else)

1. **No caption or description under any image or visual.** Licence credits go in one footer line.
2. **Every visual renders**, never an empty ground, at 1440, 1024, 768 and 390 wide.
3. **One section per screen:** the hero alone on the first screen; every section one or two
   screens tall at 1440x900; no next section's heading peeking in.
4. **Equal left and right content edges.** Everything sits on the `.wrap` lines or grid columns.
5. **Hover micro-animations:** a linked card lifts 2px, a photo zooms 1.02–1.03 inside its frame,
   buttons step on hover and press on click, underlines draw, card loops cycle in 2.5–4 s. No tilt,
   carousels or timed tabs. The hero enters once on load; the page carries one dealt "moment"
   (two on a long page).
6. **More and better real photographs** where they fit; good backgrounds, heroes, layouts and fonts.
7. **Real full-colour icons** (a real product's real icon, never a drawn look-alike); small diagram
   visuals in cards (a hub with branches; input → processor → three lanes; pulses along lines).
8. **Shader effects and big scenes only for technical subjects** (software, AI, dev tools, gaming,
   fintech, hardware). Other kinds get photographs, type and flat colour.
9. **Contacts:** street and district only, no house number, postcode or coordinates; no register or
   VAT numbers; no phone in a real format; example contacts on `.example` domains.

## Kind of site

Decide the kind before designing and declare it on the page:
`<html data-type="…">`, `<meta name="page-type" content="…">` (same value) and
`<meta name="site-kind" content="…">`.

| Brief | page type | site-kind | kind |
|---|---|---|---|
| Developer / software / AI work | software | software | software |
| Games | software | gaming | gaming |
| Hardware or devices | product | tech | tech |
| Physical product or brand | product | other | product |
| People are hired (designer, studio, agency, freelancer) | service | other | service |
| People come to it (cafe, shop, studio with a door) | place | other | place |

A portfolio is usually **service** (a person hired for their work), or **software** when the work
is software the person builds. Confirm with the user if unclear.

- **Tech kinds** (software, gaming, tech): the work itself leads at true size. Software shows its own
  UI as live HTML in one `app-frame` (never a generic dashboard). 60–80 words per screen outside UI
  mocks. One effect (a shader ground, a WebGL part, an object or one big scene) and one or two
  moments in their own sections; at most four live WebGL contexts; no card moves with scroll.
- **Other kinds** (product, service, place): photographs lead (the work, the people, the rooms),
  two or more per screen on a product page. Real icons for tools actually used; one still diagram
  at most; flat grounds and one brand band. No shader effect, grain, gradient, scene or loop —
  only photo- or type-led moments.
- **One object never carries the page:** the lead subject appears in the hero and two more sections
  at most, a different picture each time; other visuals carry the rest.
- **Client assets get slots:** any video, screenshots, renders or key art named in the brief gets a
  frame that reads finished now (stand-in poster/photographs), commented for the real file.

## Process

1. **Read the brief.** Note the kind, what is offered, who hires/buys, the one main action (e.g.
   "View projects", "Book a call") and the real material: logo, screens, photographs, facts.
2. **Write all the copy first.** The h1 names the category and the audience; one hard fact on the
   first screen; a noun in every heading; buttons are a verb plus an object. Nothing invented —
   no fake reviews, quotes, clients or figures. Avoid slop words and stock phrases.
3. **Plan the page as screens.** Line 1: the kind. Line 2: palette and type pairing, with one
   sentence on why the palette fits. Then one line per section: id, its one idea, its picture and
   picture kind, its height (1 or 2 screens), and which section holds a moment and why it moves.
4. **Vary, don't default.** Pick palette, type pairing, nav, footer, close, rhythm, button style and
   mark deliberately for this person; never repeat a previous layout by habit. Radius: `sharp` for
   developer tools/fintech, `soft` by default, `round` for consumer apps, square for a place.
5. **Build** each section as `main > section` with one `.wrap`, its h2 first, a `--h: 1` or `2`
   height. One design system: tokens on `:root`, one button pair, one card style, one radius
   scale, one link look, one heading scale, at most two boxes deep.
6. **Check in a real browser** at 1440x900, 1024x768, 820x1180, 768x1024, 390x844 and 320 wide;
   screenshot and read every shot against the checklist below. Fix everything before calling it done.
7. **Report:** the kind, palette and why, pairing, hero, moments/effect, what could not be checked,
   assumed facts, and every stand-in photograph or asset the user still needs to supply.

## Checklist

- **First screen:** says what is offered, for whom, with one hard fact; the hero fills it alone at
  every width with its main button inside it.
- **One section per screen:** 1–2 screens each, h2 first and top-aligned, nothing sparse or half
  empty, no neighbour's heading or picture in view.
- **Equal edges:** no block out to one side, no sideways scroll at any width.
- **Every visual draws** at all widths; a refused effect shows a still fallback.
- **No caption**, placeholder, sample note or printed `.example` address.
- **Right things for the kind** (see above); real photographs, none used twice; real icons in their
  own colours.
- **Motion:** every button, link, linked card and photo answers the pointer; nothing tilts; the hero
  enters once; one or two moments; nothing moves on scroll except a moment inside its own section
  (or the big scene on tech); anything moving past 5 s has a pause button; under
  `prefers-reduced-motion` everything rests and nothing stays hidden.
- **Keyboard and head:** every control named, alt text on images, visible labels, headings one level
  at a time, no `tabindex` > 0, a skip link reached first by Tab with a visible focus ring, the menu
  button states its state; `lang`, title, description, Open Graph tags, icon, theme-color.
- **Copy and links:** at most two hero actions; one action at most twice a screen; one fact, one
  wording; every link lands; forms really send, confirmation only after a real send, each error
  under its own field.
- **Fast:** light images (sized and compressed), no layout shift, few WebGL contexts.
- **820, 768, 390 and 320:** sections still on their screens; on phones sections grow with content
  and nothing overlaps or hides under a fixed bar; tap targets 44px tall; splits stack text first;
  one column at 390, full-width buttons, full-screen menu.
- **Your eyes:** beside figma.com and x.ai it reads as a professional site; nothing tilted,
  staggered, cut or overlapping; the hero is the work, not a mood.

## Never

- Cards, rows or sections that fade in on scroll; parallax on text; scroll-jacking; random blinking.
- Stock photographs passed off as the person's own work, people or place (stand-ins are listed in
  the report as stand-ins).
- A drawn look-alike of a real logo; invented reviews, quotes, clients or figures.
- **Violet or lavender** anywhere in the page's own design (accent, ground, gradient, effect, tint).
  Real third-party logos keep their own colours.
- Copying a reference site's code, copy, pictures or signature effect.
