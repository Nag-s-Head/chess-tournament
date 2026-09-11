import { Logger } from "./logger";

describe("Logger", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("Base Logging Functionality", () => {
    it("prints structured JSON logs with timestamp, level, and message", () => {
      const logger = new Logger({}, { minLevel: "info" });
      logger.info("Server started");

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload).toMatchObject({
        level: "info",
        message: "Server started",
      });
      expect(payload.timestamp).toBeDefined();
      expect(isNaN(Date.parse(payload.timestamp))).toBe(false);
    });

    it("includes extra fields passed to log methods", () => {
      const logger = new Logger({}, { minLevel: "info" });
      logger.info("User logged in", { userId: 42, ip: "127.0.0.1" });

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload).toMatchObject({
        message: "User logged in",
        userId: 42,
        ip: "127.0.0.1",
      });
    });

    it("supports all log severity levels", () => {
      const logger = new Logger({}, { minLevel: "debug" });

      logger.debug("Debug msg");
      logger.info("Info msg");
      logger.warn("Warn msg");
      logger.error("Error msg");

      expect(consoleLogSpy).toHaveBeenCalledTimes(4);

      const levels = consoleLogSpy.mock.calls.map(
        (call) => JSON.parse(call[0]).level
      );
      expect(levels).toEqual(["debug", "info", "warn", "error"]);
    });
  });

  describe("Log Level Filtering", () => {
    it("filters out log messages below the specified minimum level", () => {
      const logger = new Logger({}, { minLevel: "warn" });

      logger.debug("Debug message");
      logger.info("Info message");
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.warn("Warning message");
      logger.error("Error message");
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("Caller Location Capture", () => {
    it("captures caller filename and line number when captureCaller is true", () => {
      const logger = new Logger({}, { captureCaller: true });
      logger.info("Test caller tracking"); // Line where call originates

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload.caller).toBeDefined();
      expect(payload.caller).toMatch(/logger\.test\.ts:\d+$/);
    });

    it("omits caller location when captureCaller is false", () => {
      const logger = new Logger({}, { captureCaller: false });
      logger.info("Test no caller tracking");

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload.caller).toBeUndefined();
    });
  });

  describe("Child Logger Context (.with)", () => {
    it("creates child loggers without modifying the parent context", () => {
      const parentLogger = new Logger({ app: "payment-service" }, { minLevel: "info" });
      const childLogger = parentLogger.with({ requestId: "req-abc-123" });

      parentLogger.info("Parent event");
      childLogger.info("Child event");

      const parentPayload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      const childPayload = JSON.parse(consoleLogSpy.mock.calls[1][0]);

      expect(parentPayload).toMatchObject({
        app: "payment-service",
        message: "Parent event",
      });
      expect(parentPayload.requestId).toBeUndefined();

      expect(childPayload).toMatchObject({
        app: "payment-service",
        requestId: "req-abc-123",
        message: "Child event",
      });
    });

    it("chains multiple .with() calls correctly and deep-merges tags", () => {
      const baseLogger = new Logger({ service: "api" }, { minLevel: "info" });
      const routeLogger = baseLogger.with({ route: "/checkout" });
      const userLogger = routeLogger.with({ userId: 99 });

      userLogger.error("Payment failed", { errorCode: "CARD_DECLINED" });

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload).toMatchObject({
        service: "api",
        route: "/checkout",
        userId: 99,
        message: "Payment failed",
        errorCode: "CARD_DECLINED",
      });
    });

    it("preserves minLevel and captureCaller configurations in child loggers", () => {
      const parentLogger = new Logger(
        { env: "production" },
        { minLevel: "error", captureCaller: false }
      );
      const childLogger = parentLogger.with({ component: "db" });

      childLogger.warn("Ignored warning");
      expect(consoleLogSpy).not.toHaveBeenCalled();

      childLogger.error("Fatal DB failure");
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      const payload = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(payload.env).toBe("production");
      expect(payload.component).toBe("db");
      expect(payload.caller).toBeUndefined();
    });
  });
});
