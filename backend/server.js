const express = require("express");
const cors = require("cors");
const path = require("path");

const noticesRouter = require("./routes/notices");
const admissionsRouter = require("./routes/admissions");
const contactRouter = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve the frontend directly too, so the whole project can run from one server
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "anwer-college-portal-api", time: new Date().toISOString() });
});

app.use("/api/notices", noticesRouter);
app.use("/api/admissions", admissionsRouter);
app.use("/api/contact", contactRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Anwer College portal API running at http://localhost:${PORT}`);
});
