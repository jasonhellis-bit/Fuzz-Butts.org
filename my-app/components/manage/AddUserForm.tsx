"use client";
import { useState, useTransition } from "react";
import { createUser } from "@/actions/userActions";

const AVAILABLE_ROLES = ["admin", "volunteer"] as const;

export default function AddUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      const result = await createUser(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsOpen(false);
        setSelectedRoles([]);
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 mb-6">
        + Add User
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">New User</h2>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="roles" value={selectedRoles.join(",")} />

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
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
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input type="text" name="title" className="border p-2 w-full" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temporary Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roles
          </label>
          <div className="flex gap-4">
            {AVAILABLE_ROLES.map((role) => (
              <label key={role} className="flex items-center gap-2 capitalize">
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
            defaultValue="pending"
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
          {isPending ? "Creating..." : "Create User"}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsOpen(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50">
          Cancel
        </button>
      </form>
    </div>
  );
}
