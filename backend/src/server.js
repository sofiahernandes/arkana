// Local server bootstrap used to start the Express app outside serverless environments.
import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ ok: true, server: "up" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
