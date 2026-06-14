"use client";

import { useState } from "react";

/* ── Schedule Data ─────────────────────────────────────── */
const CLASSES = [
  {
    name: "Tiny Tots (Ages 2–5)",
    emoji: "👶",
    color: "#f472b6",
    times: { Mon: "10:00 AM – 11:00 AM", Tue: "10:00 AM – 11:00 AM", Wed: "10:00 AM – 11:00 AM", Thu: "10:00 AM – 11:00 AM" },
  },
  {
    name: "Kids Music (Ages 5–10)",
    emoji: "🎵",
    color: "#60a5fa",
    times: { Mon: "11:00 AM – 12:00 PM", Tue: "11:00 AM – 12:00 PM", Wed: "11:00 AM – 12:00 PM", Thu: "11:00 AM – 12:00 PM" },
  },
  {
    name: "Kids Music (Ages 11–17)",
    emoji: "🎤",
    color: "#a78bfa",
    times: { Mon: "12:00 PM – 1:00 PM", Tue: "12:00 PM – 1:00 PM", Wed: "12:00 PM – 1:00 PM", Thu: "12:00 PM – 1:00 PM" },
  },
  {
    name: "Piano Class",
    emoji: "🎹",
    color: "#34d399",
    times: { Mon: "1:00 PM – 2:00 PM", Tue: "1:00 PM – 2:00 PM", Wed: "1:00 PM – 2:00 PM", Thu: "1:00 PM – 2:00 PM" },
  },
  {
    name: "Teens Recording Studio",
    emoji: "🎧",
    color: "#fbbf24",
    times: { Mon: "2:00 PM – 3:00 PM", Tue: "2:00 PM – 3:00 PM", Wed: "2:00 PM – 3:00 PM", Thu: "2:00 PM – 3:00 PM" },
  },
  {
    name: "Private Lessons (By Appointment)",
    emoji: "🎼",
    color: "#c9a84c",
    times: { Fri: "By Appointment", Sat: "By Appointment", Sun: "By Appointment" },
  },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const IMPORTANT_DATES = [
  { date: "June 16 – June 30", label: "FREE Summer Classes", type: "free" },
  { date: "July 1 – July 31", label: "July Classes — All $25", type: "paid" },
  { date: "July 4", label: "🇺🇸 Independence Day — Closed", type: "closed" },
  { date: "August 1 – August 31", label: "August Session — Regular Pricing", type: "paid" },
];

/* ── Calendar Builder ──────────────────────────────────── */
function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startDay = first.getDay();
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function getClassesForDay(dayOfWeek: number) {
  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek];
  return CLASSES.filter((c) => c.times[dayName as keyof typeof c.times]);
}

const CLOSED_DATES = ["2026-07-04"];

function isClosedDate(d: Date) {
  const iso = d.toISOString().slice(0, 10);
  return CLOSED_DATES.includes(iso);
}

export default function ScheduleContent() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthDays = getMonthDays(viewYear, viewMonth);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectedClasses = selectedDate ? getClassesForDay(selectedDate.getDay()) : [];

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        .cal-day { transition: all 0.15s; cursor: pointer; }
        .cal-day:hover { background: rgba(201,168,76,0.15) !important; transform: scale(1.05); }
        .cal-nav:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* Header */}
      <header style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.3em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase" }}>Schedule</p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #e4cc7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BASMA</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Calendar</span>
          </h1>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>← Home</a>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 120px" }}>

        {/* ── Calendar ────────────────────────────── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "24px 20px", marginBottom: 28 }}>

          {/* Month nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={prevMonth} className="cal-nav" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", borderRadius: 10, width: 40, height: 40 }}>‹</button>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: "#c9a84c" }}>
              {monthNames[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="cal-nav" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", borderRadius: 10, width: 40, height: 40 }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", padding: "6px 0", letterSpacing: "0.05em" }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {monthDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} style={{ minHeight: 90 }} />;
              const isToday = day.toDateString() === today.toDateString();
              const isSel = selectedDate && day.toDateString() === selectedDate.toDateString();
              const closed = isClosedDate(day);
              const dayClasses = getClassesForDay(day.getDay());
              const hasClasses = dayClasses.length > 0;
              const dow = day.getDay();
              const isWeekend = dow === 0 || dow === 5 || dow === 6;

              return (
                <button
                  key={i}
                  className="cal-day"
                  onClick={() => setSelectedDate(day)}
                  style={{
                    background: isSel
                      ? "linear-gradient(135deg, #c9a84c, #e4cc7a)"
                      : isToday
                      ? "rgba(201,168,76,0.2)"
                      : closed
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(255,255,255,0.02)",
                    border: isToday && !isSel ? "1px solid rgba(201,168,76,0.4)" : "1px solid transparent",
                    borderRadius: 12,
                    padding: "10px 4px 8px",
                    textAlign: "center",
                    color: isSel ? "#050505" : closed ? "#ef4444" : "#fff",
                    fontWeight: isToday || isSel ? 800 : 500,
                    fontSize: 15,
                    position: "relative",
                    minHeight: 90,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span>{day.getDate()}</span>
                  {hasClasses && !closed && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4, width: "100%" }}>
                      {dayClasses.map((c, ci) => {
                        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()] as keyof typeof c.times;
                        const time = c.times[dayName] || "";
                        if (!time) return null;
                        const shortTime = time === "By Appointment" ? "Appt" : time.split(" – ")[0].replace(":00", "");
                        return (
                          <div key={ci} style={{
                            fontSize: 7,
                            lineHeight: "10px",
                            padding: "2px 2px",
                            borderRadius: 3,
                            background: isSel ? "rgba(0,0,0,0.15)" : `${c.color}22`,
                            color: isSel ? "rgba(0,0,0,0.7)" : c.color,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {shortTime}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {closed && <div style={{ fontSize: 8, marginTop: 4 }}>CLOSED</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selected Day Detail ─────────────────── */}
        {selectedDate && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 24px", marginBottom: 28 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#c9a84c" }}>
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
            {isClosedDate(selectedDate) ? (
              <div style={{ textAlign: "center", padding: 24 }}>
                <p style={{ fontSize: 32, margin: "0 0 8px" }}>🚫</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#ef4444" }}>No Classes — Holiday</p>
              </div>
            ) : selectedClasses.length === 0 ? (
              <div style={{ textAlign: "center", padding: 24 }}>
                <p style={{ fontSize: 32, margin: "0 0 8px" }}>😴</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>No classes scheduled</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {selectedClasses.map((cls, i) => {
                  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][selectedDate.getDay()] as keyof typeof cls.times;
                  const time = cls.times[dayName];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 16px",
                        background: `${cls.color}11`,
                        border: `1px solid ${cls.color}33`,
                        borderRadius: 14,
                      }}
                    >
                      <div style={{ fontSize: 24 }}>{cls.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: cls.color }}>{cls.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{time}</p>
                      </div>
                      <a
                        href="/enroll"
                        style={{
                          padding: "6px 14px",
                          background: `${cls.color}22`,
                          color: cls.color,
                          border: `1px solid ${cls.color}44`,
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Enroll
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Weekly Overview ─────────────────────── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 24px", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#c9a84c", fontFamily: "'Playfair Display', serif" }}>
            📋 Weekly Class Schedule
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 11 }}>Class</th>
                  {DAYS.map((d) => (
                    <th key={d} style={{ textAlign: "center", padding: "10px 4px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 11, minWidth: 60 }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASSES.map((cls, i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap" }}>
                      <span style={{ color: cls.color, fontWeight: 600 }}>{cls.emoji} {cls.name}</span>
                    </td>
                    {DAYS.map((d) => {
                      const time = cls.times[d as keyof typeof cls.times];
                      return (
                        <td key={d} style={{ textAlign: "center", padding: "10px 4px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {time ? (
                            <span style={{ background: `${cls.color}15`, color: cls.color, padding: "3px 6px", borderRadius: 6, fontSize: 10, fontWeight: 500 }}>
                              {time === "By Appointment" ? "Appt" : time.split(" – ")[0]}
                            </span>
                          ) : (
                            <span style={{ color: "rgba(255,255,255,0.15)" }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Important Dates ─────────────────────── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px 24px", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#c9a84c", fontFamily: "'Playfair Display', serif" }}>
            📌 Important Dates
          </h3>
          {IMPORTANT_DATES.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < IMPORTANT_DATES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: item.type === "free" ? "#22c55e" : item.type === "paid" ? "#c9a84c" : "#ef4444",
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#fff" }}>{item.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Color legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          {CLASSES.map((cls, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cls.color }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{cls.emoji} {cls.name.split("(")[0].trim()}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(5,5,5,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "center", gap: 32, padding: "12px 20px", backdropFilter: "blur(10px)" }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>🏠</span> Home
        </a>
        <a href="/enroll" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>📝</span> Enroll
        </a>
        <a href="/schedule" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>📅</span> Schedule
        </a>
        <a href="/portal" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>👨‍👩‍👧</span> Portal
        </a>
      </div>
    </div>
  );
}
