"use client";
import { useState } from "react";
import { createTask } from "../../services/api";
import { useRouter } from "next/navigation";

export default function CreateTask() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "medium",
    due_date: "",
  });

  const handleSubmit = async () => {
    console.log("CREATE CLICKED"); // ✅ debug

    // ✅ validation
    if (!form.title || !form.description || !form.assigned_to || !form.due_date) {
      alert("Please fill all fields");
      return;
    }

    try {
      console.log("FORM DATA:", form);

      const res = await createTask(form);

      console.log("API RESPONSE:", res);

      // ✅ handle backend validation errors
      if (res.detail) {
        alert(res.detail);
        return;
      }

      alert("Task Created Successfully ✅");

      // ✅ reset form
      setForm({
        title: "",
        description: "",
        assigned_to: "",
        priority: "medium",
        due_date: "",
      });

      // ✅ redirect to dashboard
      router.push("/");

    } catch (err) {
      console.error("ERROR:", err);
      alert("Failed to create task ❌");
    }
  };
  return (
  <div className="min-h-screen bg-gray-100 flex justify-center mt-10 p-6">

    <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg">

      <h1 className="text-2xl font-bold mb-6 text-center">
        Create New Task
      </h1>

      {/* TITLE */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full p-2 border rounded"
          placeholder="Enter task title"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <input
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full p-2 border rounded"
          placeholder="Enter description"
        />
      </div>

      {/* ASSIGNED TO */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Assigned To
        </label>
        <input
          value={form.assigned_to}
          onChange={(e) =>
            setForm({ ...form, assigned_to: e.target.value })
          }
          className="w-full p-2 border rounded"
          placeholder="Enter user name"
        />
      </div>

      {/* DUE DATE */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Due Date
        </label>
        <input
          type="datetime-local"
          onChange={(e) => {
            const value = e.target.value;
            setForm({
              ...form,
              due_date: value ? value + ":00" : "",
            });
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* PRIORITY */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Priority
        </label>
        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create Task
      </button>

    </div>
  </div>
);
}
