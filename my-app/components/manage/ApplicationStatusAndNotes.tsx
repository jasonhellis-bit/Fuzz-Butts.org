"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus, addApplicationNote } from "@/actions/applicationActions";
import { ApplicationNote, ApplicationStatus } from "@/types/types";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "pending",      label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "approved",     label: "Approved" },
  { value: "denied",       label: "Denied" },
  { value: "withdrawn",    label: "Withdrawn" },
];

const STATUS_BADGE: Record<ApplicationStatus, { label: string; classes: string }> = {
  pending:      { label: "Pending",      classes: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", classes: "bg-blue-100 text-blue-700" },
  approved:     { label: "Approved",     classes: "bg-green-100 text-green-700" },
  denied:       { label: "Denied",       classes: "bg-red-100 text-red-700" },
  withdrawn:    { label: "Withdrawn",    classes: "bg-gray-100 text-gray-600" },
};

export default function ApplicationStatusAndNotes({
  applicationId,
  currentStatus,
  notes,
  isReadOnly = false,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
  notes: ApplicationNote[];
  isReadOnly?: boolean;
}) {
  const router = useRouter();

  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  const [noteText, setNoteText] = useState("");
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [noteError, setNoteError] = useState("");

  async function handleStatusSave() {
    setStatusSaving(true);
    setStatusError("");
    const result = await updateApplicationStatus(applicationId, status);
    setStatusSaving(false);
    if (result.error) {
      setStatusError("Failed to update status. Please try again.");
      return;
    }
    router.refresh();
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setNoteSubmitting(true);
    setNoteError("");
    const result = await addApplicationNote(applicationId, noteText.trim());
    setNoteSubmitting(false);
    if (result.error) {
      setNoteError("Failed to save note. Please try again.");
      return;
    }
    setNoteText("");
    router.refresh();
  }

  const badge = STATUS_BADGE[currentStatus];

  return (
    <div className="flex flex-col gap-4">
      {/* Status panel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Application Status
        </h3>
        {isReadOnly ? (
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge.classes}`}>
            {badge.label}
          </span>
        ) : (
          <>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-3">
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {statusError && <p className="text-red-500 text-xs mb-2">{statusError}</p>}
            <button
              onClick={handleStatusSave}
              disabled={statusSaving || status === currentStatus}
              className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {statusSaving ? "Saving…" : "Save Status"}
            </button>
          </>
        )}
      </div>

      {/* Notes panel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Notes</h3>

        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No notes yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div key={note.id} className="border-l-2 border-blue-200 pl-3">
                <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap">
                  {note.note}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {note.created_by_name ?? "Unknown"} &middot;{" "}
                  {new Date(note.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isReadOnly && (
          <form
            onSubmit={handleAddNote}
            className="flex flex-col gap-2 pt-3 border-t border-gray-100">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note…"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            {noteError && <p className="text-red-500 text-xs">{noteError}</p>}
            <button
              type="submit"
              disabled={noteSubmitting || !noteText.trim()}
              className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {noteSubmitting ? "Saving…" : "Add Note"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
