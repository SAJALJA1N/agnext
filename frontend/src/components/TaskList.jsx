import React, { useState } from "react";
import api from "../services/api";
import dayjs from "dayjs";
import { notify } from "./Toast";

export default function TaskList({ tasks = [], onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [temp, setTemp] = useState({});

  const startEdit = (t) => {
    setEditingId(t.id || t._id);
    setTemp({
      title: t.title || "",
      description: t.description || "",
      priority: t.priority || "Medium",
      status: t.status || "Pending",
      category: t.category || "",
      dueDate: t.dueDate ? dayjs(t.dueDate).format("YYYY-MM-DD") : "",
    });
  };

  const cancel = () => {
    setEditingId(null);
    setTemp({});
  };

  const save = async (id) => {
    try {
      await api.put(`/tasks/${id}`, {
        title: temp.title,
        description: temp.description,
        priority: temp.priority,
        status: temp.status,
        category: temp.category,
        dueDate: temp.dueDate ? dayjs(temp.dueDate).toISOString() : null,
      });
      notify("Saved");
      onChange?.();
      cancel();
    } catch (err) {
      console.error(err);
      notify("Could not save");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      notify("Deleted");
      onChange?.();
    } catch (err) {
      console.error(err);
      notify("Could not delete");
    }
  };

  const toggleComplete = async (t) => {
    try {
      await api.put(`/tasks/${t.id || t._id}`, { completed: !t.completed, status: t.completed ? "Pending" : "Completed" });
      onChange?.();
    } catch (err) {
      console.error(err);
      notify("Could not update");
    }
  };

  return (
    <ul className="space-y-3">
      {tasks.length === 0 && <div className="text-center text-slate-500 p-6">No tasks</div>}
      {tasks.map((t) => {
        const id = t.id || t._id;
        const isEditing = editingId === id;
        return (
          <li key={id} className="p-3 border rounded bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              {isEditing ? (
                <>
                  <input className="w-full p-2 border rounded" value={temp.title} onChange={(e)=>setTemp({...temp, title: e.target.value})} />
                  <div className="flex gap-2 mt-2">
                    <input className="flex-1 p-2 border rounded" value={temp.description} onChange={(e)=>setTemp({...temp, description: e.target.value})} />
                    <input className="p-2 border rounded" type="date" value={temp.dueDate} onChange={(e)=>setTemp({...temp, dueDate: e.target.value})} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <select className="p-2 border rounded" value={temp.priority} onChange={(e)=>setTemp({...temp, priority: e.target.value})}>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <select className="p-2 border rounded" value={temp.status} onChange={(e)=>setTemp({...temp, status: e.target.value})}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>toggleComplete(t)} className={`px-2 py-1 border rounded ${t.completed ? "bg-green-100" : ""}`}>{t.completed ? "✓" : "○"}</button>
                    <div>
                      <div className={`${t.status === "Completed" ? "line-through text-slate-500" : ""} font-semibold`}>{t.title}</div>
                      <div className="text-sm text-slate-600">{t.description}</div>
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-slate-500">
                    <span className="mr-3">Priority: {t.priority || "Medium"}</span>
                    <span className="mr-3">Status: {t.status || "Pending"}</span>
                    <span>Due: {t.dueDate ? dayjs(t.dueDate).format("MMM D, YYYY") : "—"}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 items-center">
              {isEditing ? (
                <>
                  <button onClick={()=>save(id)} className="px-3 py-1 bg-sky-600 text-white rounded">Save</button>
                  <button onClick={cancel} className="px-3 py-1 border rounded">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={()=>startEdit(t)} className="px-3 py-1 border rounded">Edit</button>
                  <button onClick={()=>remove(id)} className="px-3 py-1 border rounded">Delete</button>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
