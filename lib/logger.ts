// lib/logger.ts

enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogOptions {
  level?: LogLevel;
  context?: string;
  details?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel;

  private constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  public static getInstance(minLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(minLevel);
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}] ` : "";
    const details = options?.details ? ` ${JSON.stringify(options.details)}` : "";
    return `${timestamp} [${level}] ${context}${message}${details}`;
  }

  public debug(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, options));
    }
  }

  public info(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, options));
    }
  }

  public warn(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, options));
    }
  }

  public error(message: string, error?: Error, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMessage = error ? `: ${error.message}` : "";
      const errorStack = error?.stack ? `\n${error.stack}` : "";
      console.error(this.formatMessage(LogLevel.ERROR, `${message}${errorMessage}`, options) + errorStack);
    }
  }
}

// Initialize logger with default level from environment variable or INFO
const logLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || LogLevel.INFO;
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '')
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '')
    }
  }
}
