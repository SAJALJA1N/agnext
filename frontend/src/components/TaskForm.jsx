import React, { useState } from "react";
import api from "../services/api";
import { notify } from "./Toast";
import dayjs from "dayjs";

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      notify("Title is required");
      return;
    }
    try {
      await api.post("/tasks", {
        title,
        description,
        priority,
        category,
        dueDate: dueDate ? dayjs(dueDate).toISOString() : undefined,
      });
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate("");
      setPriority("Medium");
      notify("Task created");
      onCreated?.();
    } catch (err) {
      console.error(err);
      notify("Could not create task");
    }
  };

  return (
    <form onSubmit={create} className="space-y-2">
      <div className="flex gap-2">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Task title" className="flex-1 p-2 border rounded" />
        <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="p-2 border rounded">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (e.g., Work, Personal)" className="p-2 border rounded md:col-span-1" />
        <input value={dueDate} onChange={(e)=>setDueDate(e.target.value)} type="date" className="p-2 border rounded md:col-span-1" />
        <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="p-2 border rounded md:col-span-1" />
      </div>
    </form>
  );
}
