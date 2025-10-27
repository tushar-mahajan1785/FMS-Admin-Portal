// src/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Public Layout</h1>
      <Outlet />
    </div>
  );
}
