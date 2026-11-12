import { useState, useRef, useEffect } from "react";
import Icon from "./Icon.jsx";
import {
  Home,
  Clubs,
  Intramurals,
  Search,
  Teams,
  Waiver,
  Calendar,
  Notifications,
  Profile,
  Help,
  Stub,
  Detail,
} from "./screens.jsx";

export default function App() {
  const [stack, setStack] = useState(["home"]);
  const [S, setS] = useState({
    q: "Basketball",
    tab: "all",
    gender: "All",
    waiver: false,
    team: "Basketball",
    sel: null,
    faq: 0,
    readNotifications: [],
  });
  const [toastMsg, setToastMsg] = useState("");
  const timer = useRef();
  const scroller = useRef();
  const screen = stack[stack.length - 1];

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [screen]);

  const ctx = {
    S,
    set: (patch) => setS((s) => ({ ...s, ...patch })),
    go: (name, patch) => {
      if (patch) setS((s) => ({ ...s, ...patch }));
      setStack((st) => [...st, name]);
    },
    back: () => setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)),
    root: (name, patch) => {
      if (patch) setS((s) => ({ ...s, ...patch }));
      setStack([name]);
    },

    toast: (msg) => {
      const notification = typeof msg === "string" ? { message: msg } : msg;

      setToastMsg(notification);

      clearTimeout(timer.current);

      timer.current = setTimeout(
        () => {
          setToastMsg("");
        },
        notification.action ? 5000 : 1800
      );
    },
  };

  const views = {
    home: <Home ctx={ctx} />,
    clubs: <Clubs ctx={ctx} />,
    intra: <Intramurals ctx={ctx} />,
    search: <Search ctx={ctx} />,
    teams: <Teams ctx={ctx} />,
    waiver: <Waiver ctx={ctx} />,
    calendar: <Calendar ctx={ctx} />,
    help: <Help ctx={ctx} />,
    profile: <Profile ctx={ctx} />,
    notifs: <Notifications ctx={ctx} />,
    detail: <Detail ctx={ctx} />,
  };

  const inSearch = ["search", "teams", "waiver"].includes(screen);
  const tabs = [
    ["home", "home", ["home", "clubs", "intra"].includes(screen)],
    [
      inSearch ? "search" : "cal",
      inSearch ? "search" : "calendar",
      inSearch || screen === "calendar",
    ],
    ["user", "profile", screen === "profile"],
    ["bell", "notifs", screen === "notifs"],
  ];

  return (
    <div className="phone">
      <div
        className={"scroll" + (screen === "home" ? " home-scroll" : "")}
        ref={scroller}
      >
        {views[screen]}
      </div>
      {screen !== "help" && (
        <nav className="nav">
          {tabs.map(([icon, target, on]) => (
            <button
              key={target}
              className={on ? "on" : ""}
              onClick={() => {
                ctx.set({ gender: "All" });
                ctx.root(target);
              }}
            >
              <Icon name={icon} />
            </button>
          ))}
        </nav>
      )}

      {toastMsg && (
        <div className="toast">
          <span>{toastMsg.message}</span>

          {toastMsg.action && (
            <button
              type="button"
              className="toast-undo"
              onClick={() => {
                clearTimeout(timer.current);
                toastMsg.action.onClick();
              }}
            >
              {toastMsg.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
