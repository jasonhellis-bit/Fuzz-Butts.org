"use client";
import { User } from "@/types/types";
import { useState, useTransition } from "react";
import { updateUser, changePassword } from "@/actions/userActions";

const AVAILABLE_ROLES = ["admin", "volunteer"] as const;

export default function ManageUserCard({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(() =>
    user.roles
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean),
  );
  const [phoneValue, setPhoneValue] = useState(user.phone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordPending, startPasswordTransition] = useTransition();

  function formatPhone(raw: string) {
    let digits = raw.replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1"))
      digits = digits.slice(1);
    digits = digits.slice(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await updateUser(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  function handlePasswordSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    startPasswordTransition(async () => {
      const result = await changePassword(user.id, newPassword);
      if (result.error) {
        setPasswordError(result.error);
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
      }
    });
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const hasAudit = user.audit && user.audit.length > 0;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="roles" value={selectedRoles.join(",")} />

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              defaultValue={user.first_name}
              required
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              defaultValue={user.last_name}
              required
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={user.title ?? ""}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={user.email ?? ""}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={phoneValue}
              onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roles
            </label>
            <div className="flex gap-4">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue={user.status}
              className="border p-2 w-full">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2 disabled:opacity-50">
            {isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            disabled={isPending}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
      {user.title && <p className="text-gray-500 mb-1">{user.title}</p>}
      {user.email && <p className="text-gray-600 mb-1">{user.email}</p>}
      {user.phone && (
        <p className="text-gray-600 mb-1">{formatPhone(user.phone)}</p>
      )}
      <p className="text-gray-600 mb-1">
        Status: <span className="capitalize">{user.status}</span>
      </p>
      {user.roles && <p className="text-gray-600 mb-2">Roles: {user.roles}</p>}

      {hasAudit && (
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
            <div className="mt-3 text-sm">
              <div className="grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-1 font-semibold text-gray-500 border-b pb-1 mb-1">
                <span>Date &amp; Time</span>
                <span>User</span>
                <span>Action</span>
              </div>
              {user.audit!.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[auto_auto_1fr] gap-x-4 gap-y-1 py-1 border-b last:border-0 text-gray-700">
                  <span className="whitespace-nowrap text-gray-500">
                    {new Date(entry.event_date_time).toLocaleString()}
                  </span>
                  <span className="whitespace-nowrap">{fullName}</span>
                  <span>{entry.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasAudit && (
        <p className="text-gray-700 mb-4 mt-2">No audit trail available.</p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsEditing(true)}>
          Edit User
        </button>
        <button
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
          onClick={() => {
            setShowPasswordForm((s) => !s);
            setPasswordError(null);
            setPasswordSuccess(false);
          }}>
          Change Password
        </button>
      </div>

      {showPasswordForm && (
        <form
          onSubmit={handlePasswordSubmit}
          className="mt-4 border border-gray-200 rounded p-4 bg-gray-50 max-w-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Set new password for {fullName}
          </p>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="border p-2 w-full rounded text-sm"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="border p-2 w-full rounded text-sm"
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mb-3">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-600 text-sm mb-3">
              Password updated successfully.
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPasswordPending}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm disabled:opacity-50">
              {isPasswordPending ? "Saving…" : "Save Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(false);
                setPasswordError(null);
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
