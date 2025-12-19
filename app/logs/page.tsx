"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/utils/logger";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  data?: unknown;
  route?: string;
  url?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    logger.page("Logs", {
      pathname: window.location.pathname,
    });

    const loadLogs = () => {
      const stored = localStorage.getItem("app_logs");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as LogEntry[];
          setLogs(parsed.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        } catch (e) {
          console.error("Failed to parse logs:", e);
        }
      } else {
        setLogs(logger.getLogs());
      }
    };

    loadLogs();

    if (autoRefresh) {
      const interval = setInterval(loadLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const clearLogs = () => {
    logger.clear();
    setLogs([]);
  };

  const exportLogs = () => {
    const data = logger.export();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-[#ff4444]";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      case "debug":
        return "text-[#00ff88]";
      default:
        return "text-[#a3a3a3]";
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Heading level={1} className="mb-0">Application Logs</Heading>
            <div className="space-x-2">
              <Button onClick={clearLogs} variant="danger">
                Clear Logs
              </Button>
              <Button onClick={exportLogs} variant="secondary">
                Export JSON
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "primary" : "secondary"}
              >
                {autoRefresh ? "Pause" : "Resume"} Auto-refresh
              </Button>
            </div>
          </div>

          <div className="bg-dark-elevated rounded-lg p-4 md:p-6 border border-dark-border max-h-[calc(100vh-300px)] md:max-h-[80vh] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-text-secondary text-center">No logs available</p>
            ) : (
              <div className="space-y-2 font-mono text-sm">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="border-b border-dark-border pb-2 last:border-0"
                  >
                    <div className="flex items-start gap-2">
                      <span className={`font-bold ${getLevelColor(log.level)}`}>
                        [{log.level.toUpperCase()}]
                      </span>
                      <span className="text-text-tertiary text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-text-secondary">{log.message}</span>
                    </div>
                    {log.route && (
                      <div className="text-text-tertiary text-xs ml-20">
                        Route: {log.route}
                      </div>
                    )}
                    {log.url && (
                      <div className="text-text-tertiary text-xs ml-20">
                        URL: {log.url}
                      </div>
                    )}
                    {log.data ? (
                      <details className="ml-20 mt-1">
                        <summary className="text-text-tertiary text-xs cursor-pointer">
                          Data
                        </summary>
                        <pre className="text-xs text-text-secondary mt-1 bg-dark-surface p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  );
}

