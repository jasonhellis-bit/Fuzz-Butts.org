"use client";
import { User } from "@/types/types";
import { useState } from "react";

export default function ManageUserCard({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-2xl">
        <input
          type="text"
          value={user.name}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="email"
          value={user.email}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={user.role}
          className="border p-2 mb-2 w-full"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2">
          Save
        </button>
      </div>
    );
  } else if (user.audit && user.audit.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <p className="text-gray-600 mb-2">{user.role}</p>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setAuditOpen((s) => !s)}
            className="flex w-full items-center justify-between rounded bg-gray-100 px-3 py-2">
            <span className="text-lg font-bold">Audit Trail</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-5 w-5 transform transition-transform ${auditOpen ? "-rotate-180" : "rotate-0"}`}>
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.243a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {auditOpen && (
            <ul className="list-disc pl-5 mt-3">
              {user.audit.map((entry, index) => (
                <li key={index} className="text-gray-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex-1">{entry.action}</span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          onClick={() => setIsEditing(true)}>
          Edit User
        </button>
      </div>
    );
  } else {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <p className="text-gray-600 mb-2">{user.role}</p>
        <p className="text-gray-700 mb-4">No audit trail available.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsEditing(true)}>
          Edit User
        </button>
      </div>
    );
  }
}
