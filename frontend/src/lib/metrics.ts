import client from "prom-client";

// Prevent re-registering metrics in Next.js development mode
const globalForMetrics = global as unknown as { metricsInitialized: boolean };

if (!globalForMetrics.metricsInitialized) {
  // Automatically collect standard Node.js metrics (memory, CPU, etc.)
  client.collectDefaultMetrics();
  globalForMetrics.metricsInitialized = true;
}

export const registry = client.register;
