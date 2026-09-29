"use client";

import { useCallback, useMemo, useState } from "react";

type Row = Record<string, unknown>;

function display(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function Table({ rows, empty }: { rows: Row[]; empty: string }) {
  if (!rows.length) return <p className="text-sm text-white/40">{empty}</p>;
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5">
          <tr>{keys.map((key) => <th key={key} className="px-3 py-2 text-white/60 whitespace-nowrap">{key.replaceAll("_", " ")}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={String(row.id ?? index)} className="border-t border-white/10">
              {keys.map((key) => <td key={key} className="px-3 py-2 text-white/70 whitespace-nowrap">{display(row[key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DatabaseAccessPanel({ teacherCode }: { teacherCode: string }) {
  const [tab, setTab] = useState<"students" | "requests" | "airtable">("students");
  const [query, setQuery] = useState("");
  const [airtable, setAirtable] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAirtable = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        "/api/registrations?source=all&teacherCode=" + encodeURIComponent(teacherCode),
        { cache: "no-store" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load Airtable.");
      setAirtable((data.registrations || []) as Row[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load Airtable.");
    } finally {
      setLoading(false);
    }
  }, [teacherCode]);

  const filteredAirtable = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return airtable;
    return airtable.filter((row) =>
      Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(q))
    );
  }, [airtable, query]);

  const selectTab = (nextTab: "students" | "requests" | "airtable") => {
    setTab(nextTab);
    if (nextTab === "airtable" && airtable.length === 0) void loadAirtable();
  };

  return (
    <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c]/70">Database Access</p>
          <h2 className="text-xl font-semibold">BASMA Data</h2>
        </div>
        <button
          onClick={() => tab === "airtable" ? void loadAirtable() : setMessage("This Neon view is waiting for its secure server connection.")}
          disabled={loading}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => selectTab("students")} className={"rounded-lg px-3 py-2 text-sm " + (tab === "students" ? "bg-[#c9a84c] text-black" : "bg-white/5 text-white/70")}>Neon · Active Students</button>
        <button onClick={() => selectTab("requests")} className={"rounded-lg px-3 py-2 text-sm " + (tab === "requests" ? "bg-[#c9a84c] text-black" : "bg-white/5 text-white/70")}>Neon · Lesson Requests</button>
        <button onClick={() => selectTab("airtable")} className={"rounded-lg px-3 py-2 text-sm " + (tab === "airtable" ? "bg-[#c9a84c] text-black" : "bg-white/5 text-white/70")}>Airtable · Marketing & History</button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search this database..."
        className="w-full mb-4 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-[#c9a84c]/60"
      />

      {message && <p className="mb-4 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white/45">{message}</p>}

      {tab === "students" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm text-white/70">Active Students</p>
          <p className="mt-1 text-sm text-white/40">Neon data will appear here after the secure server connection is added.</p>
        </div>
      )}

      {tab === "requests" && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm text-white/70">Lesson Requests</p>
          <p className="mt-1 text-sm text-white/40">Neon data will appear here after the secure server connection is added.</p>
        </div>
      )}

      {tab === "airtable" && (
        <>
          <div className="mb-3 text-xs text-white/30">
            Showing {filteredAirtable.length} of {airtable.length} Airtable records
          </div>
          <Table rows={filteredAirtable} empty="No Airtable records found." />
        </>
      )}

      <p className="mt-5 text-xs text-white/30">
        Neon is for active website data. Airtable remains separate for marketing and history. No records are moved or deleted here.
      </p>
    </section>
  );
}
