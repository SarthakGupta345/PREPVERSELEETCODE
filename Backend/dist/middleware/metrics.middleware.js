"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsHandler = exports.metricsMiddleware = exports.activeRequestsGauge = exports.httpRequestDurationMicroseconds = exports.httpRequestCounter = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Enable collection of default Node.js metrics
prom_client_1.default.collectDefaultMetrics({ register: prom_client_1.default.register });
// Custom metrics
exports.httpRequestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
exports.httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10], // buckets for response time
});
exports.activeRequestsGauge = new prom_client_1.default.Gauge({
    name: "http_active_requests",
    help: "Number of active HTTP requests currently being processed",
});
// Middleware to measure duration and count requests
const metricsMiddleware = (req, res, next) => {
    const start = process.hrtime();
    exports.activeRequestsGauge.inc();
    res.on("finish", () => {
        exports.activeRequestsGauge.dec();
        const diff = process.hrtime(start);
        const durationInSeconds = diff[0] + diff[1] / 1e9;
        // Determine the route path (e.g. /companies, /auth, etc.)
        const route = req.route ? req.route.path : req.path;
        exports.httpRequestCounter.labels(req.method, route, res.statusCode.toString()).inc();
        exports.httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode.toString()).observe(durationInSeconds);
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
// Route handler for /metrics
const metricsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader("Content-Type", prom_client_1.default.register.contentType);
        res.send(yield prom_client_1.default.register.metrics());
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.metricsHandler = metricsHandler;
