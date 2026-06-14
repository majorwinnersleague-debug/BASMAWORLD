"use client";

import { useState, useEffect, useCallback } from "react";

interface FormStatus {
  parentInfo: boolean;
  studentInfo: boolean;
  interests: boolean;
  waiver: boolean;
  payment: boolean;
}

interface Recommendation {
  name: string;
  description: string;
  link: string;
  match: string;
}

interface Registration {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  studentAge: string;
  interests: string;
  status: string;
  source: string;
  ageGroup: string;
  experienceLevel: string;
  referralSource: string;
  message: string;
  address: string;
  createdAt: string;
  forms: FormStatus;
  completedSteps: number;
  totalSteps: number;
  completionPct: number;
  recommendations: Recommendation[];
}

interface ApiResponse {
  total: number;
  filtered: number;
  families: number;
  registrations: Registration[];
  byParent: Record<string, Registration[]>;
  stats: {
    total: number;
    newLead: number;
    incomplete: number;
    withStudent: number;
    fullyComplete: number;
    needsWaiver: number;
    needsPayment: number;
    sources: Record<string, number>;
  };
}

const FORM_STEPS = [
  { key: "parentInfo" as keyof FormStatus, label: "Parent Information", desc: "Name, email, and phone", link: "/", linkLabel: "Update Info" },
  { key: "studentInfo" as keyof FormStatus, label: "Student Details", desc: "Student name and age", link: "/", linkLabel: "Add Student Info" },
  { key: "interests" as keyof FormStatus, label: "Interests & Experience", desc: "Musical interests and skill level", link: "/", linkLabel: "Select Interests" },
  { key: "waiver" as keyof FormStatus, label: "Waiver / Medical Form", desc: "Health info, allergies, photo consent", link: "/contract", linkLabel: "Complete Waiver" },
  { key: "payment" as keyof FormStatus, label: "Payment", desc: "Class fees paid via Stripe", link: "/enroll", linkLabel: "Make Payment" },
];

function ProgressBar({ pct }: { pct: number }) {
  const color = pct === 100 ? "#22c55e" : pct >= 60 ? "#c9a84c" : "#f59e0b";
  return (
    <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function ChecklistItem({ complete, label, desc, link, linkLabel }: {
  complete: boolean; label: string; desc: string; link: string; linkLabel: string;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      background: complete ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
      border: `1px solid ${complete ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
      borderRadius: 12, marginBottom: 8,
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{complete ? "✅" : "❌"}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: complete ? "#22c55e" : "#fff" }}>
          {label}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{desc}</p>
      </div>
      {!complete && (
        <a
          href={link}
          style={{
            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: "rgba(201,168,76,0.2)", color: "#c9a84c",
            border: "1px solid rgba(201,168,76,0.3)", textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {linkLabel} →
        </a>
      )}
    </div>
  );
}

function StudentChecklist({ reg }: { reg: Registration }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px", marginBottom: 16,
    }}>
      {/* Student header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff" }}>
            {reg.studentName || reg.parentName} {reg.studentAge ? `— Age ${reg.studentAge}` : ""}
          </h4>
          {reg.interests && (
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(201,168,76,0.7)" }}>
              🎵 {reg.interests}
            </p>
          )}
          {reg.experienceLevel && (
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              Level: {reg.experienceLevel}
            </p>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: 20, fontWeight: 800,
            color: reg.completionPct === 100 ? "#22c55e" : reg.completionPct >= 60 ? "#c9a84c" : "#f59e0b",
          }}>
            {reg.completionPct}%
          </p>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <ProgressBar pct={reg.completionPct} />
        <p style={{ margin: "6px 0 0", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {reg.completedSteps} of {reg.totalSteps} steps completed
        </p>
      </div>

      {/* Checklist */}
      {FORM_STEPS.map((step) => (
        <ChecklistItem
          key={step.key}
          complete={reg.forms[step.key]}
          label={step.label}
          desc={step.desc}
          link={step.link}
          linkLabel={step.linkLabel}
        />
      ))}

      <p style={{ margin: "10px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
        Registered: {new Date(reg.createdAt).toLocaleDateString()} · Source: {reg.source}
      </p>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <a
      href={rec.link}
      style={{
        display: "block", textDecoration: "none",
        background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: 14, padding: "16px 18px", marginBottom: 10,
        transition: "all 0.2s",
      }}
      className="rec-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>{rec.name}</p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{rec.description}</p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
          background: "rgba(201,168,76,0.15)", color: "#c9a84c",
          whiteSpace: "nowrap", marginLeft: 12,
        }}>
          {rec.match}
        </span>
      </div>
    </a>
  );
}

function FamilyDetail({ records, onBack }: { records: Registration[]; onBack: () => void }) {
  const parent = records[0];
  const allComplete = records.every((r) => r.completionPct === 100);
  const avgCompletion = Math.round(records.reduce((a, r) => a + r.completionPct, 0) / records.length);

  // Collect unique recommendations across all students
  const allRecs: Recommendation[] = [];
  const seenNames = new Set<string>();
  for (const r of records) {
    for (const rec of r.recommendations) {
      if (!seenNames.has(rec.name)) {
        seenNames.add(rec.name);
        allRecs.push(rec);
      }
    }
  }

  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: "#c9a84c",
        cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0,
      }}>
        ← Back to search
      </button>

      {/* Family header */}
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "24px 28px", marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff" }}>
            {parent.parentName}
          </h2>
          {allComplete ? (
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>
              ✅ All Complete
            </span>
          ) : (
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}>
              ⚠️ {avgCompletion}% Complete
            </span>
          )}
        </div>
        <p style={{ margin: "0 0 4px", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
          📧 {parent.email} {parent.phone ? `· 📱 ${parent.phone}` : ""}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          {records.length} student{records.length > 1 ? "s" : ""} registered
        </p>
      </div>

      {/* Per-student checklists */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c9a84c", margin: "0 0 14px" }}>
        📋 Registration Progress
      </h3>
      {records.map((r) => (
        <StudentChecklist key={r.id} reg={r} />
      ))}

      {/* Recommendations */}
      {allRecs.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c9a84c", margin: "24px 0 14px" }}>
            ⭐ Recommended Classes
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>
            Based on your students&apos; ages and interests:
          </p>
          {allRecs.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} />
          ))}
        </>
      )}
    </div>
  );
}

function FamilyListCard({ records, onSelect }: { records: Registration[]; onSelect: (r: Registration[]) => void }) {
  const parent = records[0];
  const students = records.filter((r) => r.studentName);
  const avgCompletion = Math.round(records.reduce((a, r) => a + r.completionPct, 0) / records.length);
  const allComplete = records.every((r) => r.completionPct === 100);
  const hasIncomplete = records.some((r) => r.completionPct < 100);

  return (
    <button
      onClick={() => onSelect(records)}
      style={{
        display: "block", width: "100%", textAlign: "left",
        background: "rgba(255,255,255,0.03)",
        border: hasIncomplete ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(34,197,94,0.2)",
        borderRadius: 16, padding: "16px 20px", cursor: "pointer",
        transition: "all 0.2s", marginBottom: 10,
      }}
      className="family-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
          {parent.parentName || "Unknown"}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: allComplete ? "#22c55e" : "#f59e0b" }}>
            {avgCompletion}%
          </span>
          <div style={{ width: 40, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
            <div style={{ width: `${avgCompletion}%`, height: "100%", background: allComplete ? "#22c55e" : "#f59e0b", borderRadius: 3 }} />
          </div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
        {parent.email} {parent.phone ? `· ${parent.phone}` : ""}
      </p>
      {students.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {students.map((s, i) => (
            <span key={i} style={{
              display: "inline-block", background: "rgba(201,168,76,0.15)", color: "#c9a84c",
              padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
              marginRight: 6, marginBottom: 4,
            }}>
              {s.studentName} {s.studentAge ? `(${s.studentAge})` : ""}
            </span>
          ))}
        </div>
      )}
      {hasIncomplete && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#f59e0b" }}>
          ⚠️ {records.filter((r) => r.completionPct < 100).length} incomplete — tap to see details
        </p>
      )}
    </button>
  );
}

function StatsBar({ stats }: { stats: ApiResponse["stats"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
      {[
        { label: "Total", value: stats.total, icon: "📊", color: "#c9a84c" },
        { label: "Complete", value: stats.fullyComplete, icon: "✅", color: "#22c55e" },
        { label: "Need Waiver", value: stats.needsWaiver, icon: "📝", color: "#f59e0b" },
        { label: "Need Payment", value: stats.needsPayment, icon: "💳", color: "#ef4444" },
      ].map((s) => (
        <div key={s.label} style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "12px 8px", textAlign: "center",
        }}>
          <p style={{ fontSize: 18, margin: "0 0 2px" }}>{s.icon}</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function PortalContent() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registration[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load all data on mount
  useEffect(() => {
    fetch("/api/registrations")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const doSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const resp = await fetch(`/api/registrations?${params}`);
      const json = await resp.json();
      setData(json);
      setSelected(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") doSearch();
  };

  // Apply client-side filters
  const filteredByParent = data?.byParent
    ? Object.fromEntries(
        Object.entries(data.byParent).filter(([, records]) => {
          if (statusFilter === "all") return true;
          if (statusFilter === "complete") return records.every((r) => r.completionPct === 100);
          if (statusFilter === "incomplete") return records.some((r) => r.completionPct < 100);
          return true;
        })
      )
    : {};

  const filteredCount = Object.values(filteredByParent).reduce((acc, r) => acc + r.length, 0);
  const familyCount = Object.keys(filteredByParent).length;

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        .family-card:hover { background: rgba(255,255,255,0.06) !important; transform: translateY(-1px); }
        .rec-card:hover { background: rgba(201,168,76,0.12) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .filter-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; }
        .filter-btn.active { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.4); color: #c9a84c; }
      `}</style>

      {/* Header */}
      <header style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.3em", color: "rgba(201,168,76,0.5)", textTransform: "uppercase" }}>Parent Portal</p>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #e4cc7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BASMA</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Academy</span>
          </h1>
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>← Home</a>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px 100px" }}>
        {!selected ? (
          <>
            {/* Stats */}
            {data?.stats && <StatsBar stats={data.stats} />}

            {/* Search */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", margin: "0 0 6px" }}>
                  Find Your Registration 🔍
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                  Enter your email or phone to see your kids&apos; progress
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Email, phone number, or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
                    color: "#fff", fontSize: 15, outline: "none",
                  }}
                />
                <button
                  onClick={doSearch}
                  disabled={loading}
                  style={{
                    padding: "14px 24px", borderRadius: 14, border: "none",
                    background: "linear-gradient(135deg, #c9a84c, #e4cc7a)",
                    color: "#050505", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All ({data?.filtered || 0})</button>
                <button className={`filter-btn ${statusFilter === "complete" ? "active" : ""}`} onClick={() => setStatusFilter("complete")}>✅ Complete</button>
                <button className={`filter-btn ${statusFilter === "incomplete" ? "active" : ""}`} onClick={() => setStatusFilter("incomplete")}>⚠️ Needs Action</button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ width: 32, height: 32, border: "3px solid rgba(201,168,76,0.2)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading registrations...</p>
              </div>
            )}

            {/* Results */}
            {!loading && data && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                  {filteredCount} registration{filteredCount !== 1 ? "s" : ""} · {familyCount} famil{familyCount !== 1 ? "ies" : "y"}
                </p>

                {familyCount === 0 && (
                  <div style={{ textAlign: "center", padding: 40, background: "rgba(255,255,255,0.03)", borderRadius: 20 }}>
                    <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>No registrations found</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>
                      Try a different email, phone, or name
                    </p>
                    <a href="/enroll" style={{
                      display: "inline-block", padding: "10px 24px",
                      background: "linear-gradient(135deg, #c9a84c, #e4cc7a)",
                      color: "#050505", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}>
                      Register Now →
                    </a>
                  </div>
                )}

                {Object.entries(filteredByParent).map(([key, records]) => (
                  <FamilyListCard key={key} records={records} onSelect={setSelected} />
                ))}
              </div>
            )}
          </>
        ) : (
          <FamilyDetail records={selected} onBack={() => setSelected(null)} />
        )}
      </main>

      {/* Footer nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(5,5,5,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "center", gap: 32, padding: "12px 20px",
        backdropFilter: "blur(10px)",
      }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>🏠</span> Home
        </a>
        <a href="/enroll" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>📝</span> Enroll
        </a>
        <a href="/portal" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>👨‍👩‍👧</span> Portal
        </a>
        <a href="/schedule" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>📅</span> Schedule
        </a>
      </div>
    </div>
  );
}
