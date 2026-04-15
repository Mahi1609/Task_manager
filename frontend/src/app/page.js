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
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-6 pb-6">

      {/* <h1 className="text-3xl font-bold mb-6"> Dashboard</h1> */}

      {/* FILTERS */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          placeholder="Filter by user"
          onChange={(e) => setFilterUser(e.target.value)}
          className="p-2 rounded border"
        />
      </div>

      {/* EDIT FORM */}
      {editingTask && (
        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Task</h3>

          {/* Title */}
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          {/* Description */}
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            value={editingTask?.description || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          {/* Assigned */}
          <label className="block text-sm font-medium mb-1">Assigned To</label>
          <input
            value={editingTask?.assigned_to || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask, assigned_to: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          />

          {/* Priority */}
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={editingTask?.priority || "medium"}
            onChange={(e) =>
              setEditingTask({ ...editingTask, priority: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Status (with smart disable) */}
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={editingTask?.status || "pending"}
            onChange={(e) =>
              setEditingTask({ ...editingTask, status: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>

            {/* 🚫 Prevent invalid reverse transition */}
            <option
              value="completed"
              disabled={editingTask?.status === "pending"}
            >
              Completed
            </option>
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditingTask(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition ${
              isOverdue(task) ? "border-2 border-red-500" : ""
            }`}
          >
            <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
            <p className="text-gray-600 text-sm mb-3">
              {task.description}
            </p>

            {/* STATUS BADGE */}
            <span
              className={`px-2 py-1 text-xs rounded font-medium ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {task.status}
            </span>

            {/* PRIORITY */}
            <p className="mt-2 text-sm">
              <span className="font-medium">Priority:</span>{" "}
              <span
                className={
                  task.priority === "high"
                    ? "text-red-500"
                    : task.priority === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {task.priority}
              </span>
            </p>

            <p className="text-sm mt-1">
              Assigned: {task.assigned_to}
            </p>

            {isOverdue(task) && (
              <p className="text-red-500 text-sm mt-1">
                ⚠ Overdue
              </p>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-2 mt-4">

              {task.status === "pending" && (
                <button
                  onClick={() =>
                    handleStatusChange(task.id, "in-progress")
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Start
                </button>
              )}

              {task.status === "in-progress" && (
                <button
                  onClick={() =>
                    handleStatusChange(task.id, "completed")
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Complete
                </button>
              )}

              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
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