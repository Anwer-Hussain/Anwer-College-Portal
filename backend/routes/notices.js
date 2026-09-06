const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const NOTICES_FILE = path.join(__dirname, "..", "data", "notices.json");

function readNotices() {
  if (!fs.existsSync(NOTICES_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(NOTICES_FILE, "utf-8");
  return JSON.parse(raw);
}

// GET /api/notices - list all notices, supporting category and search filters
router.get("/", (req, res) => {
  try {
    let notices = readNotices();
    const { category, search } = req.query || {};

    if (category && category !== "All") {
      notices = notices.filter(n => n.category && n.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      notices = notices.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) || 
        (n.body && n.body.toLowerCase().includes(q))
      );
    }

    notices.sort((a, b) => (a.date < b.date ? 1 : -1));
    res.json({ ok: true, count: notices.length, notices });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Could not read notices." });
  }
});

module.exports = router;
