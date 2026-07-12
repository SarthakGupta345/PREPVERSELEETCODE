import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import companyRoutes from "./routes/company.route"
import problemRoutes from "./routes/auth.route"
import authRoutes from "./routes/auth.route"

const PORT = process.env.PORT
const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json({
    limit: "50mb"
}))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get("/", (req, res) => {
    res.send("Server is running")
})


app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});


app.use("/companies", companyRoutes);
app.use("/problems", problemRoutes);
app.use("/auth", authRoutes);


