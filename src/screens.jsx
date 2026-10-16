import { useState } from "react";
import Icon from "./Icon.jsx";
import {
  TopBar,
  BrandBar,
  SearchBar,
  Pills,
  Section,
  GameStrip,
} from "./ui.jsx";
import { CLUBS, INTRA, SEARCH, TEAMS, EVENTS, FAQ } from "./data.js";
import { searchAll } from "./search.js";

const GENDERS = ["All", "Men's", "Women's", "Co-Ed"].map((g) => [g, g]);
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");

export function Home({ ctx }) {
  const [text, setText] = useState("");
  const submit = () => ctx.go("search", { q: text.trim(), tab: "all" });
  return (
    <>
      <BrandBar
        onHelp={() => ctx.go("help")}
        onGear={() => ctx.toast("Settings")}
      />
      <SearchBar
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        enterKeyHint="search"
      />
      <div className="tiles">
        <button
          className="tile a"
          onClick={() => ctx.go("clubs", { gender: "All" })}
        >
          <span className="ic">
            <Icon name="users" />
          </span>
          <b>Discover Clubs</b>
          <span>Join 80+ student groups</span>
        </button>
        <button
          className="tile b"
          onClick={() => ctx.go("intra", { gender: "All" })}
        >
          <span className="ic">
            <Icon name="trophy" />
          </span>
          <b>Intramurals</b>
          <span>Sign up for sports leagues</span>
        </button>
      </div>
      <Section
        title="Upcoming Games"
        right={<a onClick={() => ctx.go("calendar")}>View All</a>}
      />
      <GameStrip onOpen={() => ctx.go("calendar")} />
      <Section title="My Clubs" right={<em>ACTIVE (3)</em>} />
      <div className="hs">
        <div className="club">
          <div className="sq" style={{ background: "var(--tan)" }}>
            <Icon name="football" size={16} />
          </div>
          <div>
            <b>Flag Football</b>
            <small>Alpha Chi Omega</small>
          </div>
          <span className="ch">
            <Icon name="chev" size={14} />
          </span>
        </div>
        <div className="club">
          <div className="sq" style={{ background: "var(--blue)" }}>
            <Icon name="volleyball" size={16} />
          </div>
          <div>
            <b>Volleyball Club</b>
            <small>Vice President</small>
          </div>
        </div>
        <div className="club">
          <div className="sq" style={{ background: "var(--tan)" }}>
            <Icon name="broom" size={16} />
          </div>
          <div>
            <b>Broomball</b>
            <small>Member</small>
          </div>
          <span className="ch">
            <Icon name="chev" size={14} />
          </span>
        </div>
      </div>
    </>
  );
}

export function Clubs({ ctx }) {
  const { gender } = ctx.S;
  const list = CLUBS.filter(
    (c) => gender === "All" || norm(c.g) === norm(gender)
  );
  return (
    <>
      <TopBar
        title="Discover Clubs"
        onBack={ctx.back}
        right={
          <button className="ib">
            <Icon name="info" />
          </button>
        }
      />
      <SearchBar placeholder="Search student organizations..." filter={false} />
      <Pills
        items={GENDERS}
        value={gender}
        onChange={(g) => ctx.set({ gender: g })}
      />
      {list.map((c) => (
        <div className="card" key={c.n}>
          <div
            className="img"
            style={{
              height: 92,
              background: `linear-gradient(120deg,${c.c[0]},${c.c[1]})`,
            }}
          />
          <div className="bd">
            <div className="row">
              <h3>{c.n}</h3>
              <span className="tag m">{c.m} members</span>
            </div>
            <p>{c.d}</p>
            <div className="ft">
              <span className="dot">{c.g}</span>
              <button
                className="btn dk"
                onClick={() => ctx.toast("Request sent to " + c.n)}
              >
                Join Club
              </button>
            </div>
          </div>
        </div>
      ))}
      {!list.length && <div className="empty">No clubs match</div>}
    </>
  );
}

export function Intramurals({ ctx }) {
  const { gender } = ctx.S;
  const list = INTRA.filter((i) => gender === "All" || i[1] === gender);
  return (
    <>
      <TopBar
        title="Intramural Sports"
        onBack={ctx.back}
        right={
          <button className="ib">
            <Icon name="info" />
          </button>
        }
      />
      <Pills
        items={GENDERS}
        value={gender}
        onChange={(g) => ctx.set({ gender: g })}
      />
      {list.map((i, idx) => (
        <div className="card" key={idx}>
          <div className="bd">
            <div className="row">
              <h3>
                {i[5]} &nbsp;{i[0]}
              </h3>
              <span className="tag">{i[1]}</span>
            </div>
            <p>{i[2]}</p>
            <div className="ft">
              <span>
                Format: {i[3]}
                <br />
                <b>Closes: {i[4]}</b>
              </span>
              <button
                className="btn"
                onClick={() => ctx.go("teams", { team: i[0] })}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function Search({ ctx }) {
  const { q, tab } = ctx.S;
  const all = searchAll(q);
  const clubs = all.filter((r) => r.k === "c").length;
  const shown = all.filter((r) => tab === "all" || r.k === tab);
  return (
    <>
      <BrandBar onBack={ctx.back} onGear={() => ctx.toast("Settings")} />
      <SearchBar
        value={q}
        onChange={(e) => ctx.set({ q: e.target.value })}
        autoFocus
      />
      <Pills
        items={[
          ["all", "All", all.length],
          ["c", "Clubs", clubs],
          ["i", "Intramurals", all.length - clubs],
        ]}
        value={tab}
        onChange={(t) => ctx.set({ tab: t })}
      />
      {shown.map((r) => (
        <div className="card res" key={r.t}>
          <div className="row">
            <span className={"pk " + r.k}>
              {r.k === "i" ? "Intramural" : "Club"}
            </span>
            <span className="st dot">Open</span>
          </div>
          <h3>{r.t}</h3>
          <p style={{ marginBottom: 0 }}>{r.d}</p>
          <div className="ft">
            <small>
              <Icon name="cal" size={11} /> {r.w}
              <br />
              <Icon name="pin" size={11} /> {r.l}
            </small>
            <button
              className="btn"
              onClick={() =>
                r.k === "i"
                  ? ctx.go("teams", { team: r.sport })
                  : ctx.toast("Request sent to " + r.t)
              }
            >
              Join
            </button>
          </div>
        </div>
      ))}
      {!shown.length && (
        <div className="empty">No clubs or leagues match “{q}”</div>
      )}
    </>
  );
}

export function Teams({ ctx }) {
  return (
    <>
      <TopBar title={ctx.S.team} onBack={ctx.back} />
      <SearchBar placeholder="Search for a team by name..." />
      {TEAMS.map((t) => (
        <div className="card res" key={t[0]}>
          <div className="row">
            <span className="pk i">Intramural</span>
            <span className={"st dot" + (t[5] ? "" : " cl")}>
              {t[5] ? `OPEN (${t[2]})` : "CLOSED"}
            </span>
          </div>
          <h3>{t[0]}</h3>
          <p style={{ marginBottom: 0 }}>{t[1]}</p>
          <div className="ft">
            <small>
              <Icon name="cal" size={11} /> {t[3]}
              <br />
              <Icon name="pin" size={11} /> {t[4]}
            </small>
            <button
              className="btn"
              onClick={() =>
                t[5]
                  ? ctx.go("waiver", { team: t[0], waiver: false })
                  : ctx.toast("Registration closed")
              }
            >
              Join
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export function Waiver({ ctx }) {
  const [msg, setMsg] = useState("");
  const { waiver, team } = ctx.S;
  const send = () => {
    if (!waiver) return ctx.toast("Please accept the waiver first");
    ctx.toast("Join request sent!");
    setTimeout(() => ctx.root("home"), 900);
  };
  return (
    <>
      <div className="top">
        <button className="ib" onClick={ctx.back}>
          <Icon name="back" />
        </button>
        <div className="ttl red">
          {team.toUpperCase()}
          <small>Intramural Basketball</small>
        </div>
        <span />
      </div>
      <Section title="1. Sign Waiver" />
      <div className="waiver">
        <div className="wh">
          Release Of Liability <Icon name="down" size={16} />
        </div>
        <div className="txt">
          ...activities and to reimburse and make good to the UNIVERSITY any
          loss, damage, or cost the UNIVERSITY may have to pay as a result of my
          participation in the program.
          <br />
          <br />
          DISCLAIMER: The UNIVERSITY OF NEBRASKA is NOT RESPONSIBLE for any
          injury or loss of property to any person suffered while warming up,
          practicing, traveling, playing, or participating in Campus Recreation
          Activities.
        </div>
        <div
          className={"chk" + (waiver ? " on" : "")}
          onClick={() => ctx.set({ waiver: !waiver })}
        >
          <span />
          <div>
            I am of legal age to accept this release and I have read and
            understand the above release and agree to all its provisions.{" "}
            <b style={{ color: "var(--red)" }}>*</b>
          </div>
        </div>
      </div>
      <Section title="2. Send Join Request" />
      <div className="form">
        <label>Request Message (Optional)</label>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button className="btn" onClick={send}>
          Send Join Request
        </button>
      </div>
    </>
  );
}

export function Calendar({ ctx }) {
  const { sel } = ctx.S;
  const g = (sel && EVENTS[sel]) || {
    g: "Flag Football",
    a: "Alpha Chi Omega",
    b: "Delta Upsilon",
    d: "Today · 4:00 PM",
    p: "Lower Field A",
  };
  const days = [27, 28, 29, 30, ...Array.from({ length: 31 }, (_, i) => i + 1)];
  const weeks = Array.from({ length: 5 }, (_, r) =>
    days.slice(r * 7, r * 7 + 7).map((d, i) => ({ d, other: r * 7 + i < 4 }))
  );
  return (
    <>
      <TopBar title="Calendar" onBack={ctx.back} />
      <Section title="Upcoming Games" />
      <div className="hs">
        <div className="game" style={{ width: "100%" }}>
          <span className="chip">{g.g}</span>
          <div className="nm" style={{ lineHeight: 1.6 }}>
            {g.a} &nbsp;VS&nbsp; {g.b}
          </div>
          <div className="meta">
            <Icon name="cal" size={11} /> {g.d}
            <br />
            <Icon name="pin" size={11} /> {g.p}
          </div>
        </div>
      </div>
      <div className="cal">
        <table>
          <thead>
            <tr>
              {"SUN MON TUE WED THU FRI SAT".split(" ").map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, r) => (
              <tr key={r}>
                {w.map(({ d, other }) => {
                  const ev = !other && EVENTS[d];
                  const cls = [
                    other && "o",
                    !other && d === 14 && "t",
                    !other && sel === d && "sel",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <td
                      key={r + "-" + d}
                      className={cls}
                      onClick={() => !other && ctx.set({ sel: d })}
                    >
                      {!other && d === 14 ? <u>{d}</u> : d}
                      {ev && <span className="ev">{ev.label}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function Help({ ctx }) {
  const { faq } = ctx.S;
  return (
    <>
      <TopBar title="Help & Support" onBack={ctx.back} />
      <Section title="App Walkthrough" />
      <div className="hs walk">
        <div className="cardw">
          <div
            className="im"
            style={{ background: "linear-gradient(120deg,#8a7a5a,#b0a080)" }}
          />
          <small>STEP 01</small>
          <b>Searching For Clubs</b>
          <i>Video Tutorial</i>
        </div>
        <div className="cardw">
          <div
            className="im"
            style={{ background: "linear-gradient(120deg,#4f7a47,#2c3a2a)" }}
          />
          <small>STEP 02</small>
          <b>Finding Intramural Teams</b>
          <i>Video Tutorial</i>
        </div>
      </div>
      <Section title="Frequently Asked Questions" />
      {FAQ.map((f, i) => (
        <div key={i} className={"faq" + (faq === i ? " open" : "")}>
          <button onClick={() => ctx.set({ faq: faq === i ? -1 : i })}>
            {f[0]}
            <Icon name="chev" />
          </button>
          {faq === i && <div className="a">{f[1]}</div>}
        </div>
      ))}
      <button
        className="cta"
        onClick={() => ctx.toast("Contacting support office…")}
      >
        <Icon name="help" size={15} /> &nbsp;Contact Support Office
      </button>
    </>
  );
}

export function Stub({ ctx, title }) {
  return (
    <>
      <TopBar title={title} onBack={ctx.back} />
      <div className="empty">Nothing here in this prototype.</div>
    </>
  );
}
