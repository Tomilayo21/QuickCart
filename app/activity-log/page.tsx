"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Clerk hook for auth
import { CSVLink } from "react-csv";
import Navbar from '@/components/admin/Navbar'


interface LogEntry {
  action: string;
  detail: string;
  timestamp: string;
}

export default function ActivityLogsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Admin-only access control
  useEffect(() => {
    if (!isLoaded) return; // wait until user data loads

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Check if user role is admin (adjust according to your user metadata)
    const isAdmin = user?.publicMetadata?.role === "admin";
    if (!isAdmin) {
      router.push("/unauthorized"); // redirect non-admins
    }
  }, [isSignedIn, isLoaded, user, router]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/activity-log");
        if (!res.ok) throw new Error("Failed to load activity logs");
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs by search term (in action or detail)
  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const lower = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(lower) ||
        log.detail.toLowerCase().includes(lower)
    );
  }, [logs, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  if (loading) return <p className="p-4">Loading activity logs...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4 mt-8">Activity Logs</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />

        <CSVLink
          data={filteredLogs}
          filename={`activity-logs-${new Date().toISOString()}.csv`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Export to CSV
        </CSVLink>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Detail</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No logs found.
              </td>
            </tr>
          ) : (
            paginatedLogs.map((log, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-3 py-2">{log.action}</td>
                <td className="border border-gray-300 px-3 py-2">{log.detail}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
