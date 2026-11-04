interface AsyncStateProps {
  isLoading: boolean;
  error: string | null;
  loadingLabel?: string;
  onRetry?: () => void;
}

/**
 * Renders a loading or error state. Returns null when there is nothing to
 * show, so callers can render it unconditionally above their content:
 *
 *   <AsyncState isLoading={isLoading} error={error} onRetry={reload} />
 *   {data && <ActualContent data={data} />}
 */
const AsyncState = ({ isLoading, error, loadingLabel = "Loading...", onRetry }: AsyncStateProps) => {
  if (isLoading) {
    return (
      <div className="card p-4 text-sm text-gray-500 dark:text-gray-400" role="status">
        {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="card p-4 border border-red-200 bg-red-50 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        role="alert"
      >
        <p className="font-medium">Something went wrong</p>
        <p className="mt-1">{error}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-secondary mt-3">
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default AsyncState;
