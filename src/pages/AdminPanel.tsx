import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";
import type { Holiday } from "../types/leave";

const EMPTY_FORM = { name: "", date: "", recurringAnnually: false };

const AdminPanel = () => {
  const { data, error, isLoading, reload } = useAsync(() => api.get<Holiday[]>("/holidays"), []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.date) {
      setFormError("Name and date are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/holidays", form);
      setForm(EMPTY_FORM);
      reload();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to add holiday.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Manage the public holidays used for leave calculations.</p>

      <form className="card p-4 flex flex-wrap items-end gap-3" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="holiday-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            id="holiday-name"
            className="input-field mt-1"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="holiday-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Date
          </label>
          <input
            id="holiday-date"
            type="date"
            className="input-field mt-1"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={form.recurringAnnually}
            onChange={(e) => setForm((prev) => ({ ...prev, recurringAnnually: e.target.checked }))}
          />
          Recurs every year
        </label>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add holiday"}
        </button>
      </form>

      {formError && (
        <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
          {formError}
        </div>
      )}

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading holidays..." onRetry={reload} />

      {data && (
        <div className="card divide-y divide-gray-200 dark:divide-gray-700">
          {data.length === 0 && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No holidays configured yet.</p>
          )}
          {data.map((holiday) => (
            <div key={holiday.id} className="p-4 flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-100">{holiday.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {holiday.date}
                {holiday.recurringAnnually ? " (recurring)" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
