import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import { notFound, errorHandler } from "./middleware/error.js";

import apiRoutes from "./routes/index.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  logger.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.use(
  morgan("dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB(process.env.MONGODB_URI, process.env.MONGODB_NAME);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info("Server is running on port " + PORT);
});
