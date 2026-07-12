import { Request, Response, NextFunction } from "express";
import client from "prom-client";

// Enable collection of default Node.js metrics
client.collectDefaultMetrics({ register: client.register });

// Custom metrics
export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10], // buckets for response time
});

export const activeRequestsGauge = new client.Gauge({
  name: "http_active_requests",
  help: "Number of active HTTP requests currently being processed",
});

// Middleware to measure duration and count requests
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  activeRequestsGauge.inc();

  res.on("finish", () => {
    activeRequestsGauge.dec();
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;
    
    // Determine the route path (e.g. /companies, /auth, etc.)
    const route = req.route ? req.route.path : req.path;
    
    httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc();
    httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode.toString()).observe(durationInSeconds);
  });

  next();
};

// Route handler for /metrics
export const metricsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  } catch (err) {
    res.status(500).send(err);
  }
};
