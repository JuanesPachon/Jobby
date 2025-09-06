import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT ?? 3002;
const app = express();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.disable("x-powered-by");

app.use("/api/v1/", authRouter);
app.use("/api/v1/", userRouter);
app.use("/api/v1/", taskRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
