"use client";
import { useEffect, useState } from "react";
import {
  getTasks,
  updateStatus,
  deleteTask,
  updateTask,
} from "../services/api";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const BASE_URL = "http://127.0.0.1:8000";

      let url = `${BASE_URL}/tasks?`;

      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterUser) url += `assigned_to=${filterUser}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed API response");
      }

      const data = await res.json();
      setTasks(data);

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Cannot connect to backend");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterUser]);

  // ✅ STATUS UPDATE
  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    fetchTasks();
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;

    await deleteTask(id);
    fetchTasks();
  };

  // ✅ EDIT START
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  // ✅ EDIT SAVE
  const handleUpdate = async () => {
    await updateTask(editingTask.id, editingTask);
    setEditingTask(null);
    fetchTasks();
  };

  // ✅ OVERDUE
  const isOverdue = (task) => {
    return (
      new Date(task.due_date) < new Date() &&
      task.status !== "completed"
    );
  };

  return (
    <div style={{ padding: "20px", background: "#f5f6fa" }}>
      <h1>🚀 Task Dashboard</h1>

      {/* FILTERS */}
      <div style={{ margin: "20px 0" }}>
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          placeholder="Filter by user"
          onChange={(e) => setFilterUser(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* EDIT FORM */}
      {editingTask && (
        <div
          style={{
            background: "#fff",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Edit Task</h3>

          <input
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />

          <input
            value={editingTask.description}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}

      {/* TASK LIST */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              width: "280px",
              padding: "15px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              border: isOverdue(task) ? "2px solid red" : "none",
            }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>

            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Assigned: {task.assigned_to}</p>

            {isOverdue(task) && (
              <p style={{ color: "red" }}>⚠ Overdue</p>
            )}

            {/* ACTIONS */}
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() =>
                  handleStatusChange(task.id, "in-progress")
                }
              >
                Start
              </button>

              <button
                onClick={() =>
                  handleStatusChange(task.id, "completed")
                }
              >
                Complete
              </button>

              <button onClick={() => handleEdit(task)}>
                Edit
              </button>

              <button
                onClick={() => handleDelete(task.id)}
                style={{ color: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}