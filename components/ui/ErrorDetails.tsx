// components/ui/ErrorDetails.tsx
"use client";

import { useState } from "react";

interface ErrorDetailsProps {
  error: any;
  requestData?: any;
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, requestData }) => {
  const [expanded, setExpanded] = useState(false);

  if (!error) return null;

  return (
    <details className="mt-2">
      <summary 
        className="cursor-pointer text-xs font-semibold text-yellow-300 hover:text-yellow-200"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide" : "Show"} Error Details
      </summary>
      <div className="mt-2 space-y-2">
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-1">Error Message:</p>
          <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto max-h-32 text-red-300">
            {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
          </pre>
        </div>
        {requestData && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1">Request Data:</p>
            <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto max-h-32 text-blue-300">
              {JSON.stringify(requestData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </details>
  );
};




