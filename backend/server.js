import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/restaurants", restaurants);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

// Export the server app
export default app;
