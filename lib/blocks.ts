// Splits an assistant reply into markdown and the visual cards the system
// prompt asks for: <<projects>>, <<project:id>>, <<tools>>, <<certificates>>, <<contact>>.

export type Block =
  | { kind: 'md'; text: string }
  | { kind: 'projects' }
  | { kind: 'project'; id: string }
  | { kind: 'tools' }
  | { kind: 'certificates' }
  | { kind: 'contact' };

const TOKEN = /<<\s*(projects|tools|certificates|contact|project\s*:\s*([a-z]+))\s*>>/gi;

export function toBlocks(raw: string, streaming: boolean): Block[] {
  // While streaming, hide a half-written token ("<<proj") at the end.
  const text = streaming ? raw.replace(/<<[^>]*>?$/, '') : raw;
  const blocks: Block[] = [];
  const seen = new Set<string>();
  let last = 0;

  for (const m of text.matchAll(TOKEN)) {
    const before = text.slice(last, m.index);
    if (before.trim()) blocks.push({ kind: 'md', text: before });
    last = (m.index ?? 0) + m[0].length;

    const key = m[2] ? `project:${m[2].toLowerCase()}` : m[1].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    if (m[2]) blocks.push({ kind: 'project', id: m[2].toLowerCase() });
    else blocks.push({ kind: key as 'projects' | 'tools' | 'certificates' | 'contact' });
  }

  const rest = text.slice(last);
  if (rest.trim()) blocks.push({ kind: 'md', text: rest });
  return blocks;
}

export const hasCards = (blocks: Block[]) => blocks.some((b) => b.kind !== 'md');
