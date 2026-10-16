import { CLUBS, INTRA, SEARCH } from "./data.js";

// ---- Build one searchable list of clubs + intramural leagues ----
const covered = (t) =>
  SEARCH.some(
    (r) => r.k === "i" && r.t.toLowerCase().includes(t.toLowerCase())
  );

const INDEX = [
  // hand-written results from the prototype (basketball)
  ...SEARCH.map((r) => ({
    ...r,
    sport: r.k === "i" ? r.t.split(" ")[0] : undefined,
  })),
  // every club from Discover Clubs
  ...CLUBS.filter((c) => !SEARCH.some((r) => r.t === c.n)).map((c) => ({
    k: "c",
    t: c.n,
    d: c.d,
    w: `${c.m} members`,
    l: c.g,
  })),
  // one league per intramural sport
  ...[...new Set(INTRA.map((i) => i[0]))]
    .filter((s) => !covered(s))
    .map((sport) => {
      const rows = INTRA.filter((i) => i[0] === sport);
      return {
        k: "i",
        t: `${sport} Intramural League`,
        sport,
        d: rows[0][2],
        w: `Divisions: ${rows.map((r) => r[1]).join(", ")}`,
        l: `Closes ${rows[0][4]}`,
      };
    }),
];

// ---- Fuzzy matching ----
const GENERIC = new Set([
  "club",
  "clubs",
  "team",
  "teams",
  "league",
  "leagues",
  "intramural",
  "intramurals",
  "the",
  "and",
]);
const words = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

function edit(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[a.length][b.length];
}

function close(tok, w) {
  if (tok.length < 2) return w.startsWith(tok);
  if (w.includes(tok)) return true; // "bask" -> basketball
  if (tok.length >= 5 && w.length >= 4 && tok.includes(w)) return true; // "clubs" -> club
  const max = tok.length >= 7 ? 2 : tok.length >= 4 ? 1 : 0;
  return max > 0 && edit(tok, w) <= max; // "socer" -> soccer
}

export function searchAll(query) {
  let toks = words(query || "");
  if (!toks.length) return INDEX;
  const core = toks.filter((t) => !GENERIC.has(t));
  if (core.length) toks = core;
  return INDEX.map((item) => {
    const hay = words(item.t + " " + (item.sport || ""));
    return {
      item,
      score: toks.filter((t) => hay.some((w) => close(t, w))).length,
    };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
