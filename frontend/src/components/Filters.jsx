import React, { useState } from "react";

export default function Filters({ filters, setFilters }) {
  const [local, setLocal] = useState(filters);

  function apply() {
    setFilters(local);
  }

  function clearAll() {
    setLocal({ q: "", priority: "", status: "", category: "" });
    setFilters({ q: "", priority: "", status: "", category: "" });
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex gap-2">
        <input value={local.q || ""} onChange={(e)=>setLocal({...local, q: e.target.value})} placeholder="Search..." className="flex-1 p-2 border rounded" />
        <select value={local.priority || ""} onChange={(e)=>setLocal({...local, priority: e.target.value})} className="p-2 border rounded">
          <option value="">Priority</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select value={local.status || ""} onChange={(e)=>setLocal({...local, status: e.target.value})} className="p-2 border rounded">
          <option value="">Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={clearAll} className="px-3 py-1 border rounded">Clear</button>
        <button onClick={apply} className="px-3 py-1 bg-slate-800 text-white rounded">Apply</button>
      </div>
    </div>
  );
}
