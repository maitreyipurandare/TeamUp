import { CLUBS } from "./data.js";

// Placeholder details per club (edit freely). Anything not listed uses DEFAULT.
const CLUB_INFO = {
  "Lacrosse Club": {
    meets: "Tue & Thu · 6:30 PM",
    where: "Mabel Lee Field",
    lead: "Jordan Hale, President",
    fee: "$40 / semester",
  },
  "Rugby Club": {
    meets: "Mon & Wed · 7:00 PM",
    where: "Rec Center Turf",
    lead: "Sam Ortiz, President",
    fee: "$50 / semester",
  },
  "Soccer Club": {
    meets: "Wed & Fri · 5:30 PM",
    where: "Mabel Lee Field",
    lead: "Ava Brandt, President",
    fee: "$30 / semester",
  },
  "Swim Club": {
    meets: "Mon, Wed & Fri · 6:00 AM",
    where: "Devaney Pool",
    lead: "Priya Nair, President",
    fee: "$25 / semester",
  },
  "Tennis Club": {
    meets: "Sat · 10:00 AM",
    where: "UNL Tennis Courts",
    lead: "Luke Moreau, President",
    fee: "$20 / semester",
  },
  "Women's Basketball Club": {
    meets: "Tuesdays · 7:30 PM (Practice)",
    where: "Rec Center Court A",
    lead: "Kayla Brooks, President",
    fee: "$35 / semester",
  },
  "Men's Basketball Club": {
    meets: "Thursdays · 8:00 PM (Practice)",
    where: "Rec Center Court B",
    lead: "Marcus Dean, President",
    fee: "$35 / semester",
  },
};
const DEFAULT = {
  meets: "Weekly · times shared after joining",
  where: "Campus Recreation Center",
  lead: "Club president",
  fee: "Free",
};

function build(title, desc, colors, chips, info, members) {
  return {
    kind: "Club",
    title,
    sub: "Student Club",
    desc,
    colors,
    chips,
    rows: [
      ["Meets", info.meets],
      ["Location", info.where],
      ["Members", members],
      ["Leader", info.lead],
      ["Dues", info.fee],
    ],
  };
}

// From a CLUBS entry (Discover Clubs screen)
export const clubDetail = (c) =>
  build(
    c.n,
    c.d,
    c.c,
    [`${c.m} members`, c.g],
    CLUB_INFO[c.n] || DEFAULT,
    `${c.m} active`
  );

// From a search result (uses CLUBS data if the club exists there)
export function clubFromResult(r) {
  const c = CLUBS.find((x) => x.n === r.t);
  if (c) return clubDetail(c);
  const info = { ...(CLUB_INFO[r.t] || DEFAULT), meets: r.w || DEFAULT.meets };
  return build(r.t, r.d, ["#6b7f9b", "#b86a45"], [r.l], info, r.l);
}

// From a TEAMS row: [name, blurb, spots, schedule, division, open?]
export const teamDetail = (t, sport) => ({
  kind: "Intramural Team",
  title: t[0],
  sub: `Intramural ${sport}`,
  desc: t[1],
  colors: ["#8a4a3a", "#2f2a28"],
  chips: [t[4], `${t[2]} spots filled`],
  rows: [
    ["Sport", sport],
    ["Schedule", t[3]],
    ["Division", t[4]],
    ["Spots filled", t[2]],
    ["Registration", "Open"],
  ],
});
