const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const DATA_FILE = path.join(__dirname, "..", "data", "contact_messages.json");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeMessages(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function validateContact(body) {
  const errors = [];
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (name.length < 2) errors.push("Name must be at least 2 characters.");
  if (!EMAIL_PATTERN.test(email)) errors.push("Please provide a valid email address.");
  if (message.length < 5) errors.push("Message must be at least 5 characters.");

  return {
    errors,
    cleaned: {
      name,
      email,
      phone: phone || "Not Provided",
      subject: subject || "General Inquiry",
      message
    }
  };
}

// GET /api/contact - list all messages
router.get("/", (req, res) => {
  const messages = readMessages();
  res.json({ ok: true, count: messages.length, messages });
});

// POST /api/contact - submit new contact message
router.post("/", (req, res) => {
  const { errors, cleaned } = validateContact(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const messages = readMessages();
  const ticketId = `MSG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newEntry = {
    id: Date.now(),
    ticketId,
    submittedAt: new Date().toISOString(),
    ...cleaned
  };

  messages.unshift(newEntry);
  writeMessages(messages);

  res.status(201).json({
    ok: true,
    message: "Contact enquiry received successfully.",
    ticketId,
    entry: newEntry
  });
});

module.exports = router;
