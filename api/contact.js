// Vercel Serverless Function: /api/contact (GET, POST)

let inMemoryContactMessages = [
  {
    id: 1725619300000,
    submittedAt: "2026-09-02T11:00:00.000Z",
    ticketId: "MSG-2026-0101",
    name: "Kavitha Sundaram",
    email: "kavitha.s@gmail.com",
    phone: "9840123456",
    subject: "Admissions Inquiry",
    message: "Could you provide information regarding the cutoff marks for AI & Data Science under government counseling?"
  }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
}

module.exports = (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({
      ok: true,
      count: inMemoryContactMessages.length,
      messages: inMemoryContactMessages
    });
    return;
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    const errors = [];
    if (name.length < 2) errors.push("Name must be at least 2 characters.");
    if (!EMAIL_PATTERN.test(email)) errors.push("Please enter a valid email address.");
    if (message.length < 5) errors.push("Message must be at least 5 characters.");

    if (errors.length > 0) {
      res.status(400).json({ ok: false, errors });
      return;
    }

    const ticketId = `MSG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry = {
      id: Date.now(),
      ticketId,
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone: phone || "Not Provided",
      subject: subject || "General Inquiry",
      message
    };

    inMemoryContactMessages.unshift(newEntry);

    res.status(201).json({
      ok: true,
      message: "Contact message received successfully.",
      ticketId,
      entry: newEntry
    });
    return;
  }

  res.status(405).json({ ok: false, error: "Method not allowed." });
};
