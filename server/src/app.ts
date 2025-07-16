import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/authRoutes.js";

const PORT = process.env.PORT ?? 3002;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

app.use("/api/v1/", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
