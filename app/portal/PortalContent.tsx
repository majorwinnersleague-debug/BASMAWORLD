"use client";

import { useState, useEffect, useCallback } from "react";

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
    sources: Record<string, number>;
  };
}

const STATUS_COLORS: Record<string, string> = {
  "New Lead": "#22c55e",
  Incomplete: "#f59e0b",
  Unknown: "#6b7280",
};

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || "#6b7280";
  return (
    <span
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
      }}
    >
      {status === "New Lead" ? "✅ Registered" : status === "Incomplete" ? "⚠️ Incomplete" : status}
    </span>
  );
}

function FamilyCard({
  familyKey,
  records,
  onSelect,
}: {
  familyKey: string;
  records: Registration[];
  onSelect: (r: Registration[]) => void;
}) {
  const parent = records[0];
  const students = records.filter((r) => r.studentName);
  const incomplete = records.filter((r) => r.status === "Incomplete");

  return (
    <button
      onClick={() => onSelect(records)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: "rgba(255,255,255,0.03)",
        border: incomplete.length > 0 ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "all 0.2s",
        marginBottom: 10,
      }}
      className="family-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
          {parent.parentName || "Unknown"}
        </h3>
        <StatusBadge status={incomplete.length > 0 ? "Incomplete" : "New Lead"} />
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
        {parent.email} {parent.phone ? `· ${parent.phone}` : ""}
      </p>
      {students.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {students.map((s, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                background: "rgba(201,168,76,0.15)",
                color: "#c9a84c",
                padding: "3px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500,
                marginRight: 6,
                marginBottom: 4,
              }}
            >
              {s.studentName} {s.studentAge ? `(${s.studentAge})` : ""}
            </span>
          ))}
        </div>
      )}
      {records.length > students.length && (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          {records.length} registration{records.length > 1 ? "s" : ""} total
        </p>
      )}
    </button>
  );
}

function StudentDetail({
  records,
  onBack,
}: {
  records: Registration[];
  onBack: () => void;
}) {
  const parent = records[0];
  const incomplete = records.filter((r) => r.status === "Incomplete");

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#c9a84c",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 20,
          padding: 0,
        }}
      >
        ← Back to search
      </button>

      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "24px 28px",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#fff" }}>
          {parent.parentName}
        </h2>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
          {parent.email} {parent.phone ? `· ${parent.phone}` : ""}
        </p>

        {incomplete.length > 0 && (
          <div
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>
              ⚠️ {incomplete.length} incomplete registration{incomplete.length > 1 ? "s" : ""} — forms need to be finished
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(245,158,11,0.7)" }}>
              Please complete the registration to secure your spot.
            </p>
            <a
              href="/enroll"
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "8px 20px",
                background: "#f59e0b",
                color: "#000",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Complete Registration →
            </a>
          </div>
        )}

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#c9a84c", margin: "16px 0 10px" }}>
          Students ({records.filter(r => r.studentName).length})
        </h3>
        {records.map((r, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  {r.studentName || r.parentName} {r.studentAge ? `— Age ${r.studentAge}` : ""}
                </p>
                {r.interests && (
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                    Interests: {r.interests}
                  </p>
                )}
                {r.ageGroup && (
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Age Group: {r.ageGroup}
                  </p>
                )}
                {r.experienceLevel && (
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Experience: {r.experienceLevel}
                  </p>
                )}
                {r.address && (
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    Address: {r.address}
                  </p>
                )}
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.status === "Incomplete" && (
              <a
                href="/enroll"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "6px 16px",
                  background: "rgba(245,158,11,0.2)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Finish Registration →
              </a>
            )}
            <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              Registered: {new Date(r.createdAt).toLocaleDateString()} · Source: {r.source}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortalContent() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Registration[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(async () => {
    if (!search.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const resp = await fetch(`/api/registrations?search=${encodeURIComponent(search.trim())}`);
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        .family-card:hover { background: rgba(255,255,255,0.06) !important; transform: translateY(-1px); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "rgba(201,168,76,0.5)",
              textTransform: "uppercase",
            }}
          >
            Parent Portal
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #e4cc7a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BASMA</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Academy</span>
          </h1>
        </div>
        <a
          href="/"
          style={{
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          ← Home
        </a>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {!selected ? (
          <>
            {/* Search */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  fontFamily: "'Playfair Display', serif",
                  margin: "0 0 8px",
                }}
              >
                Welcome Back! 👋
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 24px" }}>
                Type your name, email, or phone to find your registrations
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
                <button
                  onClick={doSearch}
                  disabled={loading || !search.trim()}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #c9a84c, #e4cc7a)",
                    color: "#050505",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: loading || !search.trim() ? 0.5 : 1,
                  }}
                >
                  {loading ? "..." : "Search"}
                </button>
              </div>
            </div>

            {/* Results */}
            {hasSearched && data && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                  Found {data.filtered} registration{data.filtered !== 1 ? "s" : ""} in {data.families} famil{data.families !== 1 ? "ies" : "y"}
                </p>

                {data.filtered === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 40,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 20,
                    }}
                  >
                    <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
                    <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
                      No registrations found
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>
                      Try searching with a different name, email, or phone number
                    </p>
                    <a
                      href="/enroll"
                      style={{
                        display: "inline-block",
                        padding: "10px 24px",
                        background: "linear-gradient(135deg, #c9a84c, #e4cc7a)",
                        color: "#050505",
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Register Now →
                    </a>
                  </div>
                )}

                {Object.entries(data.byParent).map(([key, records]) => (
                  <FamilyCard
                    key={key}
                    familyKey={key}
                    records={records}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            )}

            {/* Not searched yet */}
            {!hasSearched && (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    maxWidth: 400,
                    margin: "0 auto",
                  }}
                >
                  <a
                    href="/enroll"
                    style={{
                      display: "block",
                      padding: "20px 16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>📝</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>
                      New Registration
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
                      Sign up for classes
                    </p>
                  </a>
                  <a
                    href="/"
                    style={{
                      display: "block",
                      padding: "20px 16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16,
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 28, margin: "0 0 8px" }}>🏠</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>
                      Back Home
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "4px 0 0" }}>
                      View all programs
                    </p>
                  </a>
                </div>
              </div>
            )}
          </>
        ) : (
          <StudentDetail records={selected} onBack={() => setSelected(null)} />
        )}
      </main>

      {/* Footer nav */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(5,5,5,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "center",
          gap: 32,
          padding: "12px 20px",
          backdropFilter: "blur(10px)",
        }}
      >
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>🏠</span> Home
        </a>
        <a href="/enroll" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>📝</span> Enroll
        </a>
        <a href="/portal" style={{ color: "#c9a84c", textDecoration: "none", fontSize: 12, textAlign: "center" }}>
          <span style={{ fontSize: 18, display: "block" }}>👨‍👩‍👧</span> Portal
        </a>
      </div>
    </div>
  );
}
