import Icon from "./Icon.jsx";

export function TopBar({ title, onBack, right }) {
  return (
    <div className="top">
      <button className="ib" onClick={onBack}>
        <Icon name="back" />
      </button>
      <div className="ttl">{title}</div>
      {right || <button className="ib" style={{ visibility: "hidden" }} />}
    </div>
  );
}

export function BrandBar({ onBack, onHelp, onGear }) {
  return (
    <div className="top">
      {onBack ? (
        <button className="ib" onClick={onBack}>
          <Icon name="back" />
        </button>
      ) : (
        <button className="ib" onClick={onHelp}>
          <Icon name="help" />
        </button>
      )}
      <div className="brand">
        <h1>TeamUp</h1>
        <small>University of Nebraska-Lincoln</small>
      </div>
      <button className="ib" onClick={onGear}>
        <Icon name="gear" />
      </button>
    </div>
  );
}

export function SearchBar({
  placeholder = "Search clubs, intramurals, events...",
  filter = true,
  ...inputProps
}) {
  return (
    <div className="search">
      <Icon name="search" />
      <input placeholder={placeholder} {...inputProps} />
      {filter && (
        <span className="f">
          <Icon name="sliders" />
        </span>
      )}
    </div>
  );
}

export function Pills({ items, value, onChange }) {
  return (
    <div className="pills">
      {items.map(([key, label, count]) => (
        <button
          key={key}
          className={"pill" + (value === key ? " on" : "")}
          onClick={() => onChange(key)}
        >
          {label}
          {count != null && <i>{count}</i>}
        </button>
      ))}
    </div>
  );
}

export function Section({ title, right }) {
  return (
    <div className="sec">
      <h2>{title}</h2>
      {right}
    </div>
  );
}

export function GameStrip({ onOpen }) {
  const games = [
    [
      "Flag Football",
      "Alpha Chi Omega",
      "Delta Upsilon",
      "Today · 4:00 PM",
      "Lower Field A",
    ],
    [
      "Volleyball",
      "Spike Tysons",
      "Block Busters",
      "Oct 6 · 5:00 PM",
      "City Rec Court 1",
    ],
  ];
  return (
    <div className="hs">
      {games.map(([g, a, b, when, where]) => (
        <div className="game" key={g} onClick={onOpen}>
          <span className="chip">{g}</span>
          <div className="nm">
            {a}
            <br />
            VS
            <br />
            {b}
          </div>
          <div className="meta">
            <Icon name="cal" size={11} /> {when}
            <br />
            <Icon name="pin" size={11} /> {where}
          </div>
        </div>
      ))}
    </div>
  );
}
