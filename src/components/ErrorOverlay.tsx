import React, { useEffect, useState } from "react";

const ErrorOverlay: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      setError(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    };

    const promiseHandler = (event: PromiseRejectionEvent) => {
      setError(String(event.reason));
    };

    window.addEventListener("error", handler as EventListener);
    window.addEventListener("unhandledrejection", promiseHandler as EventListener);

    return () => {
      window.removeEventListener("error", handler as EventListener);
      window.removeEventListener("unhandledrejection", promiseHandler as EventListener);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl w-full bg-red-900/95 text-white rounded-lg p-4 shadow-2xl">
        <h3 className="font-semibold mb-2">Runtime Error</h3>
        <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-3 py-1 rounded bg-white text-red-900 font-medium"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ErrorOverlay;
