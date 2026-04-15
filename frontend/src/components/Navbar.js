"use client";

import Link from "next/link";


export default function Navbar() {
  return (
    <div className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
            alt="logo"
            className="w-6 h-6"
          />
          <h1 className="text-xl font-bold text-blue-600">
            Task Manager
          </h1>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-6">

          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>

          <Link
            href="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Create Task
          </Link>

        </div>
      </div>
    </div>
  );
}