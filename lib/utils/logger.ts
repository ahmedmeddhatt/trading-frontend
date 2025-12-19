// lib/utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  url?: string;
  route?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // Add URL and route info if in browser
    if (typeof window !== 'undefined') {
      entry.url = window.location.href;
      entry.route = window.location.pathname;
    }

    return entry;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output with styling
    const style = this.getStyle(entry.level);
    console.log(
      `%c[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
      style,
      entry.data || ''
    );

    // Log to localStorage for persistence (browser only)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('app_logs');
        const logs = stored ? JSON.parse(stored) : [];
        logs.push(entry);
        if (logs.length > this.maxLogs) {
          logs.shift();
        }
        localStorage.setItem('app_logs', JSON.stringify(logs));
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  private getStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      info: 'color: #3b82f6; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;',
      debug: 'color: #10b981; font-weight: bold;',
    };
    return styles[level] || '';
  }

  info(message: string, data?: any) {
    this.addLog(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any) {
    this.addLog(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: any) {
    this.addLog(this.formatMessage('error', message, data));
  }

  debug(message: string, data?: any) {
    this.addLog(this.formatMessage('debug', message, data));
  }

  // Route tracking
  route(pathname: string, searchParams?: Record<string, string>) {
    this.info(`Route accessed: ${pathname}`, { pathname, searchParams });
  }

  // API tracking
  api(method: string, url: string, data?: any) {
    this.debug(`API ${method}: ${url}`, { method, url, data });
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    if (status >= 400) {
      this.error(`API ${method} ${url} failed: ${status}`, { method, url, status, data });
    } else {
      this.debug(`API ${method} ${url} success: ${status}`, { method, url, status });
    }
  }

  // Page tracking
  page(name: string, props?: any) {
    this.info(`Page rendered: ${name}`, props);
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear logs
  clear() {
    this.logs = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_logs');
    }
  }

  // Export logs as JSON
  export() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Helper to log route changes (client-side)
if (typeof window !== 'undefined') {
  // Log initial route
  logger.route(window.location.pathname);

  // Override pushState and replaceState to track navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    const url = args[2]?.toString() || window.location.pathname;
    logger.route(url);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    const url = args[2]?.toString() || window.location.pathname;
    logger.route(url);
  };

  // Track popstate (back/forward)
  window.addEventListener('popstate', () => {
    logger.route(window.location.pathname);
  });
}




