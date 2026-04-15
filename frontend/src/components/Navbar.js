"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 20px",
      background: "#1e293b",
      color: "#fff"
    }}>
      <h2>Task Manager</h2>

      <div>
        <Link href="/" style={{ marginRight: "15px", color: "#fff" }}>
          Dashboard
        </Link>

        <Link href="/create" style={{ color: "#fff" }}>
          Create Task
        </Link>
      </div>
    </div>
  );
}