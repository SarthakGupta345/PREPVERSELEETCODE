"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const company_route_1 = __importDefault(require("./routes/company.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_route_2 = __importDefault(require("./routes/auth.route"));
const metrics_middleware_1 = require("./middleware/metrics.middleware");
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(metrics_middleware_1.metricsMiddleware);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json({
    limit: "50mb"
}));
app.get("/metrics", metrics_middleware_1.metricsHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});
app.use("/companies", company_route_1.default);
app.use("/problems", auth_route_1.default);
app.use("/auth", auth_route_2.default);
