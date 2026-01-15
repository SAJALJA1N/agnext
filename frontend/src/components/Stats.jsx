import React, { useEffect, useState } from "react";
import api from "../services/api";
import { notify } from "./Toast";

export default function Stats({ onReload }) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/tasks/stats");
        setStats(res.data);
      } catch (err) {
        // Fallback: compute minimal stats from list endpoint if stats not present
        try {
          const res2 = await api.get("/tasks");
          const list = res2.data.tasks || res2.data || [];
          const total = list.length;
          const byStatus = list.reduce((acc, t) => { acc[t.status] = (acc[t.status]||0)+1; return acc; }, {});
          setStats({ total, byStatus, overdue: list.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completed").length });
        } catch (e) {
          notify("Could not fetch stats");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReload]);

  if (!stats) return <div className="bg-white p-4 rounded shadow">Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">Total tasks</div>
        <div className="text-2xl font-semibold">{stats.total ?? 0}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">Completed</div>
        <div className="text-2xl font-semibold">{(stats.byStatus && stats.byStatus.Completed) || 0}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-slate-500">Overdue</div>
        <div className="text-2xl font-semibold">{stats.overdue ?? 0}</div>
      </div>
    </div>
  );
}
