export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
  minLevel?: LogLevel;
  captureCaller?: boolean;
}

export class Logger {
  private static readonly LEVELS: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
  };

  private readonly minLevel: LogLevel;
  private readonly captureCaller: boolean;

  constructor(
    private readonly context: Record<string, unknown> = {},
    options: LoggerOptions = {}
  ) {
    this.minLevel = options.minLevel ?? 'info';
    this.captureCaller = options.captureCaller ?? true;
  }

  /**
   * Creates a child logger with merged key-value tags.
   */
  public with(tags: Record<string, unknown>): Logger {
    return new Logger(
      { ...this.context, ...tags },
      { minLevel: this.minLevel, captureCaller: this.captureCaller }
    );
  }

  /**
   * Captures the file path and line number from the V8 call stack.
   */
  private getCallerLocation(): string | undefined {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack as unknown as NodeJS.CallSite[];
    Error.prepareStackTrace = orig;

    // Stack index:
    // 0 = getCallerLocation
    // 1 = log()
    // 2 = debug/info/warn/error
    // 3 = Actual caller site
    const caller = stack?.[3];
    if (!caller) return undefined;

    const fileName = caller.getFileName();
    const lineNumber = caller.getLineNumber();

    if (!fileName) return undefined;

    return lineNumber ? `${fileName}:${lineNumber}` : fileName;
  }

  private log(level: LogLevel, message: string, extra: Record<string, unknown> = {}): void {
    if (Logger.LEVELS[level] < Logger.LEVELS[this.minLevel]) return;

    const caller = this.captureCaller ? this.getCallerLocation() : undefined;

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(caller ? { caller } : {}),
      ...this.context,
      ...extra,
    };

    console.log(JSON.stringify(payload));
  }

  public debug(message: string, extra?: Record<string, unknown>): void {
    this.log('debug', message, extra);
  }

  public info(message: string, extra?: Record<string, unknown>): void {
    this.log('info', message, extra);
  }

  public warn(message: string, extra?: Record<string, unknown>): void {
    this.log('warn', message, extra);
  }

  public error(message: string, extra?: Record<string, unknown>): void {
    this.log('error', message, extra);
  }
}
