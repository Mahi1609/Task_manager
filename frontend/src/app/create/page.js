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
    <div style={{ padding: "20px" }}>
      <h1>Create Task</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <br /><br />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <br /><br />

      <input
        placeholder="Assigned To"
        value={form.assigned_to}
        onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
      />

      <br /><br />

      {/* ✅ FIXED datetime format */}
      <input
        type="datetime-local"
        onChange={(e) => {
          const value = e.target.value;
          setForm({
            ...form,
            due_date: value ? value + ":00" : "",
          });
        }}
      />

      <br /><br />

      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <br /><br />

      <button
        type="button"   // ✅ IMPORTANT
        onClick={handleSubmit}
        style={{
          padding: "8px 15px",
          background: "blue",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Create Task
      </button>
    </div>
  );
}