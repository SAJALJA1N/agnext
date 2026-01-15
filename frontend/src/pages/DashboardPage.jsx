import React, { useEffect, useState } from "react";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Filters from "../components/Filters";
import Stats from "../components/Stats";
import { notify } from "../components/Toast";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", priority: "", status: "", category: "" });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      const { data } = await api.get("/tasks", { params });
      // If your backend returns { tasks, total,... } adapt accordingly.
      setTasks(data.tasks || data); // compatibility
    } catch (err) {
      console.error(err);
      notify("Could not fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Stats onReload={fetchTasks} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <TaskForm onCreated={fetchTasks} />
            <Filters filters={filters} setFilters={setFilters} />
            <div className="mt-4">
              {loading ? <div>Loading...</div> : <TaskList tasks={tasks} onChange={fetchTasks} />}
            </div>
          </div>
        </div>
        <aside className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Quick Tips</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>Use priority to focus on important tasks.</li>
            <li>Due dates to plan work and avoid overdue tasks.</li>
            <li>Filter and search to quickly find tasks.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
