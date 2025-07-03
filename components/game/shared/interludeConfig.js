// Interlude configuration and helpers for are-you-a-baller
import ResultCopy from '@/data/game/result';

export const INTERLUDES = [
  {
    step: 3,
    badge: '/img/game/interlude/1.png',
    ids: ['homeownership_status', 'ideal_location'],
  },
  {
    step: 7,
    badge: '/img/game/interlude/2.png',
    ids: ['house_type', 'home_buying_timeline', 'home_paying_timeline'],
  },
  {
    step: 10,
    badge: '/img/game/interlude/3.png',
    ids: ['saving_percent', 'financial_advisory', 'retirement_planning'],
  },
  {
    step: 12,
    ids: [],
    collectContact: true,
    badge: '/img/game/interlude/4.png',
  },
];

export const BREAK_STEPS = new Set(INTERLUDES.map((i) => i.step));

// Helper to build interlude bullets
export function buildInterludeBullets(
  cfg,
  answers,
  bulletCache,
  setBulletCache
) {
  // 2. helper: replace <vars> with saved answers
  const fill = (txt) =>
    typeof txt === 'string'
      ? txt.replace(/<([^>]+)>/g, (_, k) => answers[k] ?? '')
      : '';

  // 3. for every id listed in cfg.ids build exactly ONE line
  const bullets = cfg?.ids?.flatMap((id) => {
    const ans = answers[id];
    if (!ans) return [];
    // normalise pool
    const src = ResultCopy[id];
    let pool = Array.isArray(src)
      ? src
      : Array.isArray(src?.[ans])
      ? src[ans]
      : typeof src === 'object'
      ? Object.values(src).flat()
      : [];
    pool = pool
      .map((p) => (typeof p === 'string' ? p : p.body))
      .filter(Boolean);
    if (!pool.length) return [];
    // stable random pick
    const key = `${id}::${ans}`;
    const text =
      bulletCache[key] ?? pool[Math.floor(Math.random() * pool.length)];
    if (!bulletCache[key]) setBulletCache((c) => ({ ...c, [key]: fill(text) }));
    return [fill(text)];
  });
  return bullets.length ? bullets : ["Keep going — you're doing great!"];
}
