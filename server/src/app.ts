import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

const PORT = process.env.PORT || 3002;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
