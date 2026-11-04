import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "../services/api";
import { useAsync } from "../hooks/useAsync";
import AsyncState from "../components/common/AsyncState";

const UserRoles = () => {
  const { data: availableRoles, error, isLoading, reload } = useAsync(
    () => api.get<string[]>("/users/roles"),
    [],
  );

  const [userId, setUserId] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    const numericUserId = Number(userId);
    if (!userId || Number.isNaN(numericUserId)) {
      setSubmitError("Enter a valid user ID.");
      return;
    }
    if (selectedRoles.length === 0) {
      setSubmitError("Select at least one role.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/users/${numericUserId}/roles`, selectedRoles);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Failed to update roles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">User Roles</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Update the roles assigned to a user. Only administrators can do this.
      </p>

      <AsyncState isLoading={isLoading} error={error} loadingLabel="Loading available roles..." onRetry={reload} />

      {availableRoles && (
        <form className="card p-4 space-y-4 max-w-md" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              User ID
            </label>
            <input
              id="userId"
              className="input-field mt-1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-200">Roles</legend>
            {availableRoles.map((role) => (
              <label key={role} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                {role}
              </label>
            ))}
          </fieldset>

          {submitError && (
            <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3 dark:bg-green-950 dark:border-green-900 dark:text-green-300">
              Roles updated successfully.
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update roles"}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserRoles;
