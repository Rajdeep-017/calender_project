import { useState, useEffect, useRef } from "react";
import "./calender.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const MONTH_IMAGES = [
  { gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)", label: "Winter Peaks", emoji: "🏔️" },
  { gradient: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)", label: "Aurora", emoji: "🌌" },
  { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)", label: "Spring Bloom", emoji: "🌸" },
  { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", label: "Ocean Cliff", emoji: "🌊" },
  { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", label: "Forest Trail", emoji: "🌿" },
  { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", label: "Golden Hour", emoji: "🌅" },
  { gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", label: "Desert Dusk", emoji: "🏜️" },
  { gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)", label: "Harvest", emoji: "🍂" },
  { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Alpine Lake", emoji: "🏞️" },
  { gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", label: "Canyon", emoji: "🌄" },
  { gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", label: "Frozen Tundra", emoji: "❄️" },
  { gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #2980b9 100%)", label: "Midwinter", emoji: "🌨️" },
];

const HOLIDAYS = {
  "1-1": "New Year's Day", "2-14": "Valentine's Day", "3-17": "St. Patrick's",
  "4-22": "Earth Day", "5-1": "Labour Day", "6-21": "Summer Solstice",
  "7-4": "Independence Day", "8-15": "Independence Day (IN)", "10-31": "Halloween",
  "11-11": "Veterans Day", "12-25": "Christmas", "12-31": "New Year's Eve",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date, start, end) {
  if (!start || !end) return false;
  const [s, e] = start <= end ? [start, end] : [end, start];
  return date > s && date < e;
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState({});
  const [noteText, setNoteText] = useState("");
  const [activeNote, setActiveNote] = useState("month");
  const [theme, setTheme] = useState("light");
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const notesRef = useRef(null);

  const monthImg = MONTH_IMAGES[viewMonth];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const noteKey = activeNote === "month"
    ? `${viewYear}-${viewMonth}`
    : (rangeStart ? `${viewYear}-${viewMonth}-${rangeStart.getDate()}` : null);

  useEffect(() => {
    if (noteKey) setNoteText(notes[noteKey] || "");
  }, [noteKey, viewMonth, viewYear]);

  const saveNote = () => {
    if (!noteKey) return;
    setNotes(prev => ({ ...prev, [noteKey]: noteText }));
  };

  const navigate = (dir) => {
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setViewMonth(prev => {
        let m = prev + dir;
        if (m > 11) { setViewYear(y => y + 1); return 0; }
        if (m < 0) { setViewYear(y => y - 1); return 11; }
        return m;
      });
      setRangeStart(null); setRangeEnd(null); setSelecting(false);
      setFlipping(false);
    }, 300);
  };

  const handleDayClick = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    if (!selecting || rangeEnd) {
      setRangeStart(d); setRangeEnd(null); setSelecting(true);
    } else {
      if (d < rangeStart) { setRangeEnd(rangeStart); setRangeStart(d); }
      else { setRangeEnd(d); }
      setSelecting(false);
      setActiveNote("range");
    }
  };

  const getDateClass = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    const classes = [];
    if (isSameDay(d, today)) classes.push("today");
    if (isSameDay(d, rangeStart)) classes.push("range-start");
    if (isSameDay(d, rangeEnd)) classes.push("range-end");
    const endForRange = selecting && hoverDate ? hoverDate : rangeEnd;
    if (isInRange(d, rangeStart, endForRange)) classes.push("in-range");
    const hk = `${viewMonth + 1}-${day}`;
    if (HOLIDAYS[hk]) classes.push("holiday");
    const noteK = `${viewYear}-${viewMonth}-${day}`;
    if (notes[noteK]) classes.push("has-note");
    return classes.join(" ");
  };

  const isDark = theme === "dark";

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const rangeLabel = rangeStart && rangeEnd
    ? `${rangeStart.getDate()} – ${rangeEnd.getDate()} ${MONTHS[viewMonth]}`
    : rangeStart ? `${rangeStart.getDate()} ${MONTHS[viewMonth]}…` : null;

  const totalDays = rangeStart && rangeEnd
    ? Math.round(Math.abs(rangeEnd - rangeStart) / 86400000) + 1 : null;

  return (
    <div style={{ fontFamily: "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', Palatino, Georgia, serif" }} className={`cal-root${isDark ? " dark" : ""}`}>
      <div className="calendar-card">
        {/* BINDING */}
        <div className="binding">
          {Array.from({length: 11}).map((_,i) => <div key={i} className="ring"/>)}
        </div>

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="hero-bg" style={{ background: monthImg.gradient }}/>
          <div className="hero-emoji">{monthImg.emoji}</div>
          <div className="hero-chevron"/>

          <div className="hero-nav">
            <button className="theme-btn" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title="Toggle theme">
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="hero-content">
            <div className="hero-year">{viewYear}</div>
            <div className="hero-month">{MONTHS[viewMonth]}</div>
            <div className="hero-label">{monthImg.label}</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Month navigation */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px 0", fontFamily:"var(--font-sans)" }}>
            <button className="nav-btn" onClick={() => navigate(-1)} style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text2)", fontSize:14 }}>‹</button>
            <span style={{ fontSize:12, color:"var(--text3)", letterSpacing:1 }}>
              {MONTHS[viewMonth].toUpperCase()} {viewYear}
            </span>
            <button className="nav-btn" onClick={() => navigate(1)} style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text2)", fontSize:14 }}>›</button>
          </div>

          <div className="calendar-section">
            <div className="days-header">
              {DAYS_SHORT.map((d, i) => (
                <div key={d} className={`day-label${i >= 5 ? " weekend" : ""}`}>{d}</div>
              ))}
            </div>
            <div className={`days-grid${flipping ? (flipDir > 0 ? " flipping-left" : " flipping-right") : ""}`}>
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`}/>;
                const dayOfWeek = (firstDay + day - 1) % 7;
                const isWeekend = dayOfWeek >= 5;
                return (
                  <div
                    key={day}
                    className={`day-cell${isWeekend ? " weekend" : ""} ${getDateClass(day)}`}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => {
                      setHoverDate(new Date(viewYear, viewMonth, day));
                      const hk = `${viewMonth + 1}-${day}`;
                    }}
                    onMouseLeave={() => setHoverDate(null)}
                    title={HOLIDAYS[`${viewMonth + 1}-${day}`] || ""}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Range info */}
          <div className={`range-info${!rangeStart ? " empty" : ""}`}>
            {rangeStart ? (
              <>
                <span className="range-label">{rangeLabel}</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {totalDays && <span className="range-days">{totalDays}d</span>}
                  <button className="clear-btn" onClick={() => { setRangeStart(null); setRangeEnd(null); setSelecting(false); }}>×</button>
                </div>
              </>
            ) : (
              <span className="range-label hint">Click two dates to select a range</span>
            )}
          </div>

          {/* Holiday tip */}
          <div className="holiday-tip">
            {hoverDate && HOLIDAYS[`${hoverDate.getMonth() + 1}-${hoverDate.getDate()}`] && (
              <><span>🎉</span> {HOLIDAYS[`${hoverDate.getMonth() + 1}-${hoverDate.getDate()}`]}</>
            )}
          </div>

          {/* Notes */}
          <div className="notes-section">
            <div className="notes-tabs">
              <button className={`notes-tab${activeNote === "month" ? " active" : ""}`} onClick={() => setActiveNote("month")}>Month</button>
              {rangeStart && <button className={`notes-tab${activeNote === "range" ? " active" : ""}`} onClick={() => setActiveNote("range")}>Selection</button>}
            </div>
            <div className="notes-label">
              {activeNote === "month" ? `${MONTHS[viewMonth]} Notes` : rangeLabel || "Selection"}
            </div>
            <textarea
              ref={notesRef}
              className="notes-textarea"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={activeNote === "month" ? `Notes for ${MONTHS[viewMonth]}…` : "Notes for selected dates…"}
              rows={4}
            />
            <div className="notes-footer">
              <button className="save-btn" onClick={saveNote}>Save Note</button>
            </div>
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{background:"var(--text)"}}/>Today</div>
            <div className="legend-item"><div className="legend-dot" style={{background:"var(--blue)"}}/>Selected</div>
            <div className="legend-item"><div className="legend-dot" style={{background:"var(--blue-pale)", border:"1px solid var(--blue)"}}/>Range</div>
            <div className="legend-item"><div className="legend-dot" style={{background:"var(--accent)"}}/>Holiday</div>
            <div className="legend-item"><div className="legend-dot" style={{background:"var(--green)"}}/>Has Note</div>
          </div>
        </div>
      </div>
    </div>
  );
}