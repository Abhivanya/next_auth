"use client";

import { logoutAction } from "../_actions/logoutAction";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <form action={logoutAction}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
