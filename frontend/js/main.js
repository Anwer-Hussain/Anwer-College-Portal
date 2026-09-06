/**
 * Anwer College of Engineering and Technology (ACET)
 * Modern Collegiate Portal Application Logic
 */

// ==========================================================================
// API CLIENT CONFIGURATION & SMART FALLBACK
// ==========================================================================
const IS_LOCAL_FILE = window.location.protocol === "file:";
const API_BASE = (!IS_LOCAL_FILE && window.location.port !== "4000")
  ? "/api"
  : "http://localhost:4000/api";

const LOCAL_STORAGE_ADMISSIONS_KEY = "acet_admissions_entries_v2";
const LOCAL_STORAGE_CONTACTS_KEY = "acet_contact_messages_v1";

// ==========================================================================
// EMAILJS INTEGRATION CONFIGURATION
// Service ID: service_r67exzm (Gmail service connected to meerananwer12@gmail.com)
// ==========================================================================
const EMAILJS_CONFIG = {
  serviceID: "service_r67exzm",
  templateID: localStorage.getItem("acet_emailjs_template_id") || "template_1n0155w",
  publicKey: localStorage.getItem("acet_emailjs_public_key") || "0WR6ahkACe6eHYlt0",
  targetEmail: "meerananwer12@gmail.com"
};

// Starting Fallback Notices
const FALLBACK_NOTICES = [
  {
    id: 1,
    date: "2026-09-05",
    category: "Examinations",
    title: "End Semester Theory Examinations (Nov/Dec 2026) Schedule & Hall Allocation",
    body: "The final timetable and hall allocations for Anna University autonomous end-semester examinations have been published. Hall tickets can be collected from respective department offices starting 12 September.",
    isNew: true,
    fileSize: "420 KB PDF"
  },
  {
    id: 2,
    date: "2026-09-02",
    category: "Admissions",
    title: "B.Tech & B.E. Lateral Entry Admissions 2026-27 (Round 2 Merit List)",
    body: "Selected candidates for direct second-year engineering admission under merit quota are requested to report to the Central Auditorium with original documents before 20 September.",
    isNew: true,
    fileSize: "610 KB PDF"
  },
  {
    id: 3,
    date: "2026-08-28",
    category: "Placements",
    title: "Mega On-Campus Recruitment Drive 2026: Amazon, TCS & Cognizant",
    body: "Eligible final-year students (CSE, IT, ECE, MECH) with CGPA > 7.0 and no active standing arrears can register for Day-1 virtual coding assessment through the Training & Placement portal.",
    isNew: true,
    fileSize: "350 KB PDF"
  },
  {
    id: 4,
    date: "2026-08-22",
    category: "Events",
    title: "National Technical Symposium \"KURAL 2026\" & Hackathon Registrations Open",
    body: "The Department of Computer Science & Engineering invites technical paper submissions, web-a-thons, and robotics challenges. Cash prizes worth ₹1,50,000 to be won. Teams of up to 4 can register.",
    isNew: false,
    fileSize: "1.2 MB PDF"
  },
  {
    id: 5,
    date: "2026-08-15",
    category: "Scholarships",
    title: "Merit-cum-Means & First Graduate Scholarships 2026-27 Notification",
    body: "Applications are invited from eligible students for Tamil Nadu State Post-Matric and Anwer Merit Scholarship schemes. Submit duly signed forms at the administrative block counter 4.",
    isNew: false,
    fileSize: "280 KB PDF"
  },
  {
    id: 6,
    date: "2026-08-10",
    category: "Campus",
    title: "Central Digital Library 24/7 Reading Hall Facility during Exam Preparation",
    body: "The Air-Conditioned Digital Learning Resource Centre and IEEE Xplore access terminal will remain open until midnight throughout the examination preparation cycle.",
    isNew: false,
    fileSize: "190 KB PDF"
  }
];

// Seed initial demo admissions in localStorage if empty
function initializeLocalStorageAdmissions() {
  const existing = localStorage.getItem(LOCAL_STORAGE_ADMISSIONS_KEY);
  if (!existing) {
    const initialSeed = [
      {
        id: 1725619200000,
        applicationId: "ACET-2026-1042",
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        fullName: "Praveen Kumar S",
        email: "praveen.k@gmail.com",
        phone: "9876543210",
        department: "Computer Science and Engineering",
        marksPercentage: "92.5%",
        quota: "TNEA Single Window Counseling",
        status: "Verified",
        message: "Interested in AI/ML specialization and campus hostel accommodation."
      },
      {
        id: 1725705600000,
        applicationId: "ACET-2026-1089",
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        fullName: "Sneha Ramanathan",
        email: "sneha.raman@outlook.com",
        phone: "9123456780",
        department: "Electronics and Communication Engineering",
        marksPercentage: "88.4%",
        quota: "Direct Management Quota",
        status: "In Review",
        message: "Seeking merit scholarship details based on 12th board aggregate."
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_ADMISSIONS_KEY, JSON.stringify(initialSeed));
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, icon = "ℹ️") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// ADMISSION COUNTDOWN TIMER
// ==========================================================================
function initCountdown() {
  // Target: 25 days from now
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 24);
  deadline.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) {
      document.getElementById("admissionCountdown").innerHTML = "<span>Priority Admissions Closing Soon</span>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const elDays = document.getElementById("cdDays");
    const elHours = document.getElementById("cdHours");
    const elMins = document.getElementById("cdMins");
    const elSecs = document.getElementById("cdSecs");

    if (elDays) elDays.textContent = String(days).padStart(2, "0");
    if (elHours) elHours.textContent = String(hours).padStart(2, "0");
    if (elMins) elMins.textContent = String(mins).padStart(2, "0");
    if (elSecs) elSecs.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// NOTICE BOARD (LIVE SEARCH & CATEGORY FILTERING)
// ==========================================================================
let allNotices = [];
let activeCategory = "All";
let activeSearchQuery = "";

function formatDate(isoDate) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return isoDate;
  }
}

function renderNotices() {
  const container = document.getElementById("noticesContainer");
  if (!container) return;

  let filtered = [...allNotices];

  if (activeCategory !== "All") {
    filtered = filtered.filter(n => n.category && n.category.toLowerCase() === activeCategory.toLowerCase());
  }

  if (activeSearchQuery) {
    const q = activeSearchQuery.toLowerCase();
    filtered = filtered.filter(n => 
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.body && n.body.toLowerCase().includes(q)) ||
      (n.category && n.category.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="notices-loading-state">
        <span>No circulars found matching "${activeSearchQuery || activeCategory}".</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(n => {
    const categoryClass = n.category ? `is-${n.category.toLowerCase()}` : "";
    return `
      <article class="notice-item-card ${categoryClass}">
        <div class="notice-main-content">
          <div class="notice-meta-bar">
            <span class="notice-category-badge">${n.category || "General"}</span>
            <time class="notice-date">${formatDate(n.date)}</time>
            ${n.isNew ? '<span class="notice-new-tag">NEW</span>' : ""}
          </div>
          <h3 class="notice-title">${n.title}</h3>
          <p class="notice-body">${n.body}</p>
        </div>
        <button type="button" class="btn-download-notice" onclick="downloadNoticePdf('${n.title.replace(/'/g, "\\'")}', '${n.fileSize || "450 KB PDF"}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${n.fileSize || "PDF"}</span>
        </button>
      </article>
    `;
  }).join("");
}

window.downloadNoticePdf = function(title, size) {
  showToast(`Downloaded Official Circular: "${title.substring(0, 35)}..." (${size})`, "📄");
};

async function loadNotices() {
  try {
    const res = await fetch(`${API_BASE}/notices`);
    if (!res.ok) throw new Error("API unreachable");
    const data = await res.json();
    allNotices = (data.notices && data.notices.length) ? data.notices : FALLBACK_NOTICES;
  } catch (err) {
    // Graceful offline / static fallback
    allNotices = FALLBACK_NOTICES;
  }
  renderNotices();
}

function initNoticeControls() {
  const tabs = document.querySelectorAll(".notice-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      activeCategory = tab.dataset.cat;
      renderNotices();
    });
  });

  const searchInput = document.getElementById("noticeSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.trim();
      renderNotices();
    });
  }
}

// ==========================================================================
// DEPARTMENT FILTERING & SYLLABUS MODAL
// ==========================================================================
const DEPARTMENT_SYLLABUS_DATA = {
  cse: {
    name: "B.E. Computer Science and Engineering",
    category: "DEPARTMENT OF COMPUTING",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Equips students with rigorous mathematical foundations, systems software, scalable cloud architecture, AI algorithms, and enterprise security standards.",
    highlights: [
      "AI & Deep Learning Computing Cluster equipped with NVIDIA RTX workstations",
      "Full-Stack Software Engineering & Open Source DevOps Incubator",
      "Industry Capstone Projects co-evaluated with engineers from Amazon & TCS"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Foundational Engineering", subjects: "Linear Algebra, Engineering Physics, Python for Problem Solving, Data Structures, Digital Systems" },
      { sem: "Sem 3 & 4: Core Systems", subjects: "Design & Analysis of Algorithms, Database Systems, Computer Architecture, Operating Systems, Java Programming" },
      { sem: "Sem 5 & 6: Advanced Software & AI", subjects: "Artificial Intelligence & ML, Computer Networks, Theory of Computation, Cloud Computing, Compiler Design" },
      { sem: "Sem 7 & 8: Specialisation & Capstone", subjects: "Cybersecurity, Big Data Analytics, Deep Learning Elective, Industry Internship, Major Capstone Project" }
    ],
    careerRoles: "Software Development Engineer (SDE), Cloud Architect, Data Engineer, Full-Stack Developer, AI Researcher."
  },
  aids: {
    name: "B.Tech Artificial Intelligence & Data Science",
    category: "DEPARTMENT OF EMERGING TECHNOLOGIES",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Specialized cutting-edge curriculum focusing on predictive statistical modeling, generative AI, natural language processing, computer vision, and big data pipeline engineering.",
    highlights: [
      "High-Performance Tensor Computing and GPU Sandbox",
      "Industry partnered Kaggle Analytics and Hackathon Cell",
      "Hands-on projects with PyTorch, TensorFlow, HuggingFace, and Spark"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Mathematical Basics", subjects: "Probability & Statistics, Discrete Mathematics, Python & NumPy, Object-Oriented Programming" },
      { sem: "Sem 3 & 4: Foundations of Data", subjects: "Data Structures, Database Management Systems, Statistical Inference, Supervised Machine Learning" },
      { sem: "Sem 5 & 6: Advanced AI Modules", subjects: "Deep Learning, Natural Language Processing, Computer Vision, Big Data Engineering with Spark" },
      { sem: "Sem 7 & 8: Generative AI & Capstone", subjects: "Large Language Models & Prompt Eng, AI Ethics, Reinforcement Learning, Autonomous Industry Project" }
    ],
    careerRoles: "Machine Learning Engineer, Data Scientist, NLP Specialist, Computer Vision Engineer, Quantitative Analyst."
  },
  ece: {
    name: "B.E. Electronics and Communication Engineering",
    category: "DEPARTMENT OF CIRCUITS & COMMUNICATION",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Bridges cutting-edge semiconductor VLSI microchip design, 5G wireless protocols, embedded IoT architectures, and smart robotics.",
    highlights: [
      "DST-Supported Cadence & Synopsys VLSI Design EDA Suite",
      "Texas Instruments Embedded IoT & Wireless Sensor Network Lab",
      "Student Amateur Radio (HAM) Station & Autonomous Drone Club"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Physics & Electronics Core", subjects: "Circuit Theory, Semiconductor Physics, C Programming, Engineering Mathematics" },
      { sem: "Sem 3 & 4: Analog & Digital Design", subjects: "Electronic Circuits, Digital Logic Design, Signals & Systems, Microprocessors & Microcontrollers" },
      { sem: "Sem 5 & 6: Communication & VLSI", subjects: "VLSI Design, Digital Signal Processing, RF & Microwave Engineering, Embedded Linux" },
      { sem: "Sem 7 & 8: Wireless & System Design", subjects: "5G Cellular Communication, Optical Networks, IoT System Architecture, Final Year Prototype Project" }
    ],
    careerRoles: "VLSI Verification Engineer, Embedded Firmware Developer, RF Engineer, IoT Solutions Architect, Telecom Specialist."
  },
  it: {
    name: "B.Tech Information Technology",
    category: "DEPARTMENT OF INFORMATION TECHNOLOGY",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Geared towards distributed computing, modern cloud networking, cybersecurity defenses, web application frameworks, and enterprise software delivery.",
    highlights: [
      "Cisco Networking Academy Lab with hardware routers and switches",
      "Web Technologies & Mobile App Design Studio (Flutter & React)",
      "High placement rate with top tier product and services IT firms"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Computing Fundamentals", subjects: "Problem Solving, C++, Discrete Structures, Engineering Graphics" },
      { sem: "Sem 3 & 4: Systems & Web", subjects: "Data Structures & Algorithms, Web Technologies, Database Systems, Computer Networks" },
      { sem: "Sem 5 & 6: Enterprise & Security", subjects: "Software Engineering & Agile, Information Security, Cloud Services (AWS/Azure), Mobile Computing" },
      { sem: "Sem 7 & 8: Distributed Systems", subjects: "DevOps Pipeline, Blockchain Technology, Enterprise Capstone Project, Industry Internship" }
    ],
    careerRoles: "Cloud DevOps Engineer, Information Security Analyst, Full-Stack Developer, Network Architect, IT Consultant."
  },
  mech: {
    name: "B.E. Mechanical Engineering",
    category: "DEPARTMENT OF MECHANICAL SCIENCES",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Synthesizes classical thermodynamics, machine design, smart robotics automation, electric vehicle technology, and computational fluid dynamics (CFD).",
    highlights: [
      "SolidWorks & ANSYS CAD/CAM Simulation Lab",
      "Mechatronics, CNC Robotics & Additive 3D Manufacturing Studio",
      "Formula SAE Racing Car student team with national accolades"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Mechanics & Workshop", subjects: "Engineering Mechanics, Workshop Practice, Material Science, Calculus" },
      { sem: "Sem 3 & 4: Thermal & Manufacturing", subjects: "Thermodynamics, Fluid Mechanics, Kinematics of Machinery, Manufacturing Technology" },
      { sem: "Sem 5 & 6: Design & Automation", subjects: "Design of Machine Elements, Heat & Mass Transfer, Mechatronics, CAD/CAM/CIM" },
      { sem: "Sem 7 & 8: Electric Mobility & Project", subjects: "Electric & Hybrid Vehicles, Computational Fluid Dynamics, Industrial Robotics, Major Capstone" }
    ],
    careerRoles: "Design Engineer, Automobile R&D Specialist, Thermal Analyst, Production Manager, Automation Engineer."
  },
  civil: {
    name: "B.E. Civil Engineering",
    category: "DEPARTMENT OF INFRASTRUCTURE & ENVIRONMENT",
    duration: "4 Years (8 Semesters) &bull; Autonomous Curriculum",
    overview: "Focuses on resilient structural analysis, smart green buildings, geotechnical foundations, environmental sustainability, and GIS highway design.",
    highlights: [
      "Heavy Structures Testing Bed and Non-Destructive Concrete Testing Lab",
      "Advanced Total Station GIS Surveying & Remote Sensing Centre",
      "Patented research in low-carbon geo-polymer concrete admixtures"
    ],
    semesters: [
      { sem: "Sem 1 & 2: Surveying & Geology", subjects: "Engineering Geology, Surveying Practices, Mechanics of Solids, Physics" },
      { sem: "Sem 3 & 4: Structures & Hydraulics", subjects: "Structural Analysis, Fluid Mechanics, Concrete Technology, Soil Mechanics" },
      { sem: "Sem 5 & 6: Design & Environmental", subjects: "Design of RC & Steel Elements, Environmental Engineering, Transportation Engineering, Foundation Design" },
      { sem: "Sem 7 & 8: Smart Cities & Project", subjects: "Smart Infrastructure Design, Construction Management, Earthquake Engineering, Major Project" }
    ],
    careerRoles: "Structural Engineer, Project Management Consultant, Geotechnical Specialist, Highway Engineer, GIS Analyst."
  }
};

function initDepartmentFeatures() {
  // Filter tabs
  const filterBtns = document.querySelectorAll("#deptFilterButtons .filter-btn");
  const cards = document.querySelectorAll("#deptCardsContainer .dept-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Syllabus Modal open
  const syllabusBtns = document.querySelectorAll(".btn-syllabus");
  const modal = document.getElementById("syllabusModal");
  const closeBtn = document.getElementById("closeSyllabusModal");
  const closeFooterBtn = document.getElementById("closeSyllabusBtn");
  const modalApplyBtn = document.getElementById("modalApplyBtn");

  syllabusBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const deptKey = btn.dataset.dept;
      const data = DEPARTMENT_SYLLABUS_DATA[deptKey];
      if (!data || !modal) return;

      document.getElementById("modalDeptCategory").textContent = data.category;
      document.getElementById("modalDeptTitle").textContent = data.name;

      const body = document.getElementById("modalDeptBody");
      body.innerHTML = `
        <p style="margin-bottom: 1.25rem; font-size: 1rem; color: var(--navy-950); font-weight: 500;">
          ${data.overview}
        </p>

        <h4 style="color: var(--navy-900); margin-bottom: 0.5rem; font-size: 0.95rem;">Key Department Highlights:</h4>
        <ul style="margin-bottom: 1.5rem; padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
          ${data.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>

        <h4 style="color: var(--navy-900); margin-bottom: 0.75rem; font-size: 0.95rem;">Autonomous Curriculum Overview:</h4>
        <div class="syllabus-semesters">
          ${data.semesters.map(s => `
            <div class="sem-block">
              <h4><span>${s.sem}</span></h4>
              <p style="font-size: 0.86rem; margin: 0; color: var(--text-secondary);">${s.subjects}</p>
            </div>
          `).join("")}
        </div>

        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(37, 99, 235, 0.08); border-radius: 8px;">
          <strong style="color: var(--blue-600); font-size: 0.85rem; display: block; margin-bottom: 0.2rem;">TARGET CAREER PATHWAYS:</strong>
          <span style="font-size: 0.88rem; color: var(--navy-950);">${data.careerRoles}</span>
        </div>
      `;

      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (modalApplyBtn) {
    modalApplyBtn.addEventListener("click", () => {
      closeModal();
    });
  }

  // Quick Apply button on card
  document.querySelectorAll(".btn-dept-apply").forEach(link => {
    link.addEventListener("click", () => {
      const deptName = link.dataset.deptName;
      const deptSelect = document.getElementById("department");
      if (deptSelect && deptName) {
        deptSelect.value = deptName;
      }
    });
  });
}

// ==========================================================================
// INTERACTIVE FEE & SCHOLARSHIP CALCULATOR
// ==========================================================================
function initFeeCalculator() {
  const deptSelect = document.getElementById("calcDept");
  const quotaSelect = document.getElementById("calcQuota");
  const marksInput = document.getElementById("calcMarks");
  const marksDisplay = document.getElementById("marksDisplay");
  const hostelCheck = document.getElementById("calcHostel");

  const outTuition = document.getElementById("outTuition");
  const outDiscount = document.getElementById("outDiscount");
  const outHostel = document.getElementById("outHostel");
  const outTotal = document.getElementById("outTotal");
  const hostelRow = document.getElementById("hostelRow");
  const discountRow = document.getElementById("discountRow");
  const btnApplyWithCalc = document.getElementById("btnApplyWithCalc");

  const BASE_FEES = {
    cse: 90000,
    aids: 90000,
    ece: 85000,
    it: 85000,
    mech: 75000,
    civil: 75000
  };

  function calculate() {
    const dept = deptSelect ? deptSelect.value : "cse";
    const quota = quotaSelect ? quotaSelect.value : "govt";
    const marks = marksInput ? parseInt(marksInput.value, 10) : 88;
    const hasHostel = hostelCheck ? hostelCheck.checked : false;

    if (marksDisplay) marksDisplay.textContent = `${marks}%`;

    let tuition = BASE_FEES[dept] || 85000;
    if (quota === "mgmt") tuition += 25000;
    if (quota === "lateral") tuition -= 10000;

    // Scholarship Discount Calculation
    let discountPercent = 0;
    let scholarshipName = "";
    if (marks >= 95) {
      discountPercent = 0.75;
      scholarshipName = "75% Founder's Super-Merit";
    } else if (marks >= 90) {
      discountPercent = 0.50;
      scholarshipName = "50% Academic Excellence";
    } else if (marks >= 80) {
      discountPercent = 0.25;
      scholarshipName = "25% Merit Encouragement";
    }

    const discountAmount = Math.round(tuition * discountPercent);
    const hostelFee = hasHostel ? 70000 : 0;
    const netTotal = (tuition - discountAmount) + hostelFee;

    if (outTuition) outTuition.textContent = `₹${tuition.toLocaleString("en-IN")}`;

    if (discountAmount > 0) {
      if (discountRow) discountRow.style.display = "flex";
      if (outDiscount) {
        discountRow.querySelector("span").textContent = `Scholarship Waiver (${scholarshipName}):`;
        outDiscount.textContent = `-₹${discountAmount.toLocaleString("en-IN")}`;
      }
    } else {
      if (discountRow) discountRow.style.display = "none";
    }

    if (hostelRow) hostelRow.style.display = hasHostel ? "flex" : "none";
    if (outHostel) outHostel.textContent = `₹${hostelFee.toLocaleString("en-IN")}`;
    if (outTotal) outTotal.textContent = `₹${netTotal.toLocaleString("en-IN")}`;
  }

  if (deptSelect) deptSelect.addEventListener("change", calculate);
  if (quotaSelect) quotaSelect.addEventListener("change", calculate);
  if (marksInput) marksInput.addEventListener("input", calculate);
  if (hostelCheck) hostelCheck.addEventListener("change", calculate);

  calculate();

  // Apply button inside calculator transfers values to admission form
  if (btnApplyWithCalc) {
    btnApplyWithCalc.addEventListener("click", () => {
      const formDept = document.getElementById("department");
      const formMarks = document.getElementById("marksPercentage");
      const formQuota = document.getElementById("quota");
      const formSection = document.getElementById("admissions");

      const selectedDeptMap = {
        cse: "Computer Science and Engineering",
        aids: "Artificial Intelligence and Data Science",
        ece: "Electronics and Communication Engineering",
        it: "Information Technology",
        mech: "Mechanical Engineering",
        civil: "Civil Engineering"
      };

      if (formDept && deptSelect) formDept.value = selectedDeptMap[deptSelect.value] || "";
      if (formMarks && marksInput) formMarks.value = marksInput.value;
      if (formQuota && quotaSelect) {
        if (quotaSelect.value === "lateral") formQuota.value = "Direct Lateral Entry (2nd Year)";
        else if (quotaSelect.value === "mgmt") formQuota.value = "Direct Management Quota";
        else formQuota.value = "TNEA Single Window Counseling";
      }

      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
      showToast("Calculator details applied to your admission form!", "✨");
    });
  }
}

// ==========================================================================
// ADMISSION FORM & SUBMISSION
// ==========================================================================
const FORM_VALIDATORS = {
  fullName: (val) => (val.trim().length >= 3 ? "" : "Please enter student's full name (at least 3 characters)."),
  email: (val) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? "" : "Please enter a valid email address."),
  phone: (val) => (/^[6-9]\d{9}$/.test(val.trim()) ? "" : "Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, 9)."),
  department: (val) => (val.trim() ? "" : "Please select your preferred engineering branch.")
};

function showFieldError(fieldName, msg) {
  const errEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  const inputEl = document.getElementById(fieldName);
  if (errEl) errEl.textContent = msg;
  if (inputEl) {
    if (msg) inputEl.classList.add("has-error");
    else inputEl.classList.remove("has-error");
  }
}

function validateAdmissionForm(form) {
  let isValid = true;
  Object.keys(FORM_VALIDATORS).forEach(field => {
    const input = form.elements[field];
    if (input) {
      const msg = FORM_VALIDATORS[field](input.value);
      showFieldError(field, msg);
      if (msg) isValid = false;
    }
  });
  return isValid;
}

function showConfirmModal(entry) {
  const modal = document.getElementById("confirmModal");
  const receipt = document.getElementById("confirmReceipt");
  if (!modal || !receipt) return;

  receipt.innerHTML = `
    <div class="confirm-receipt-row">
      <span>Application Ref:</span>
      <strong>${entry.applicationId || "ACET-2026-PENDING"}</strong>
    </div>
    <div class="confirm-receipt-row">
      <span>Candidate Name:</span>
      <strong>${entry.fullName}</strong>
    </div>
    <div class="confirm-receipt-row">
      <span>Branch:</span>
      <strong>${entry.department}</strong>
    </div>
    <div class="confirm-receipt-row">
      <span>Mobile / Email:</span>
      <strong>${entry.phone} &bull; ${entry.email}</strong>
    </div>
    <div class="confirm-receipt-row">
      <span>Submission Time:</span>
      <strong>${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} &bull; Today</strong>
    </div>
  `;

  modal.classList.add("is-active");
  modal.setAttribute("aria-hidden", "false");
}

async function submitAdmissionEnquiry(payload) {
  // 1. Try sending to backend API
  let apiSuccess = false;
  let result = null;

  try {
    const res = await fetch(`${API_BASE}/admissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      result = await res.json();
      apiSuccess = true;
    }
  } catch (err) {
    // API failed or offline - will use localStorage
  }

  // 2. Always persist locally in localStorage for 100% reliable offline / static demo
  const rawList = localStorage.getItem(LOCAL_STORAGE_ADMISSIONS_KEY);
  let admissionsList = rawList ? JSON.parse(rawList) : [];

  const entry = (apiSuccess && result && result.entry) ? result.entry : {
    id: Date.now(),
    applicationId: `ACET-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toISOString(),
    status: "Verified",
    ...payload,
    marksPercentage: payload.marksPercentage ? `${payload.marksPercentage}%` : "Not Provided"
  };

  admissionsList.unshift(entry);
  localStorage.setItem(LOCAL_STORAGE_ADMISSIONS_KEY, JSON.stringify(admissionsList));
  updateAdminCountBadge();

  return entry;
}

function initAdmissionForm() {
  const form = document.getElementById("enquiryForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");
  const closeConfirmBtn = document.getElementById("closeConfirmModal");
  const printReceiptBtn = document.getElementById("btnPrintReceipt");

  if (!form) return;

  // Clear errors on input
  ["fullName", "email", "phone", "department"].forEach(f => {
    const input = form.elements[f];
    if (input) {
      input.addEventListener("input", () => showFieldError(f, ""));
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formStatus) {
      formStatus.className = "form-status-alert";
      formStatus.textContent = "";
    }

    if (!validateAdmissionForm(form)) {
      if (formStatus) {
        formStatus.className = "form-status-alert is-error";
        formStatus.textContent = "Please correct the highlighted fields before submitting.";
      }
      return;
    }

    const payload = {
      fullName: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      department: form.elements.department.value,
      marksPercentage: form.elements.marksPercentage.value.trim(),
      quota: form.elements.quota.value,
      message: form.elements.message.value.trim()
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("btn--loading");
    }

    try {
      const entry = await submitAdmissionEnquiry(payload);
      form.reset();
      showConfirmModal(entry);
      showToast("Enquiry logged successfully into portal records!", "🎉");

      // Dispatch alert to meerananwer12@gmail.com via EmailJS
      sendEmailViaEmailJs({
        to_name: "Dean of Admissions",
        to_email: EMAILJS_CONFIG.targetEmail,
        from_name: payload.fullName,
        name: payload.fullName,
        from_email: payload.email,
        email: payload.email,
        reply_to: payload.email,
        phone: payload.phone,
        department: payload.department,
        marks: payload.marksPercentage ? `${payload.marksPercentage}%` : "Not Provided",
        quota: payload.quota,
        message: payload.message || "New admission enquiry submitted via online college portal.",
        application_id: entry.applicationId,
        form_type: "Admission Enquiry",
        received_at: new Date().toLocaleString("en-IN")
      });
    } catch (err) {
      if (formStatus) {
        formStatus.className = "form-status-alert is-error";
        formStatus.textContent = "Submission error. Please check your internet connection.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("btn--loading");
      }
    }
  });

  if (closeConfirmBtn) {
    closeConfirmBtn.addEventListener("click", () => {
      const modal = document.getElementById("confirmModal");
      if (modal) {
        modal.classList.remove("is-active");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

// ==========================================================================
// ADMIN ENQUIRIES REVIEW DRAWER (MENTOR DEMO TOOL)
// ==========================================================================
function updateAdminCountBadge() {
  const badge = document.getElementById("adminCountBadge");
  if (!badge) return;
  const rawList = localStorage.getItem(LOCAL_STORAGE_ADMISSIONS_KEY);
  const list = rawList ? JSON.parse(rawList) : [];
  badge.textContent = String(list.length);
}

function getStoredAdmissions() {
  const rawList = localStorage.getItem(LOCAL_STORAGE_ADMISSIONS_KEY);
  return rawList ? JSON.parse(rawList) : [];
}

function renderAdminTable(filterQuery = "") {
  const tbody = document.getElementById("adminTableBody");
  const counter = document.getElementById("recordsCounter");
  if (!tbody) return;

  let entries = getStoredAdmissions();

  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    entries = entries.filter(e => 
      (e.fullName && e.fullName.toLowerCase().includes(q)) ||
      (e.applicationId && e.applicationId.toLowerCase().includes(q)) ||
      (e.department && e.department.toLowerCase().includes(q)) ||
      (e.phone && e.phone.includes(q))
    );
  }

  if (counter) counter.textContent = `Showing ${entries.length} candidate record(s)`;

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No admission records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(e => `
    <tr>
      <td><strong>${e.applicationId || "ACET-2026-N/A"}</strong></td>
      <td><strong>${e.fullName}</strong></td>
      <td>${e.department}</td>
      <td><span style="font-weight: 700; color: var(--blue-600);">${e.marksPercentage || "N/A"}</span></td>
      <td>${e.phone}<br><small style="color: var(--text-muted);">${e.email}</small></td>
      <td><span class="status-chip ${e.status === 'Verified' ? 'verified' : 'new'}">${e.status || 'New'}</span></td>
      <td><small>${new Date(e.submittedAt || Date.now()).toLocaleDateString("en-IN")}</small></td>
    </tr>
  `).join("");
}

function exportAdmissionsToCsv() {
  const entries = getStoredAdmissions();
  if (entries.length === 0) {
    showToast("No admission records to export.", "⚠️");
    return;
  }

  const headers = ["Application ID", "Full Name", "Email", "Phone", "Department", "Score", "Quota", "Status", "Date"];
  const rows = entries.map(e => [
    `"${e.applicationId || ''}"`,
    `"${e.fullName || ''}"`,
    `"${e.email || ''}"`,
    `"${e.phone || ''}"`,
    `"${e.department || ''}"`,
    `"${e.marksPercentage || ''}"`,
    `"${e.quota || ''}"`,
    `"${e.status || ''}"`,
    `"${new Date(e.submittedAt || Date.now()).toLocaleDateString('en-IN')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `acet_admissions_report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast("CSV report generated and downloaded!", "📊");
}

function initAdminModal() {
  const modal = document.getElementById("adminModal");
  const openBtn = document.getElementById("openAdminBtn");
  const footerBtn = document.getElementById("footerAdminBtn");
  const closeBtn = document.getElementById("closeAdminModal");
  const closeFooterBtn = document.getElementById("closeAdminBtn");
  const searchInput = document.getElementById("adminSearchInput");
  const exportBtn = document.getElementById("btnExportCsv");
  const resetBtn = document.getElementById("btnResetDemoData");

  function openAdmin() {
    renderAdminTable();
    if (modal) {
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeAdmin() {
    if (modal) {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (openBtn) openBtn.addEventListener("click", openAdmin);
  if (footerBtn) footerBtn.addEventListener("click", openAdmin);
  if (closeBtn) closeBtn.addEventListener("click", closeAdmin);
  if (closeFooterBtn) closeFooterBtn.addEventListener("click", closeAdmin);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeAdmin();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderAdminTable(e.target.value.trim());
    });
  }

  if (exportBtn) exportBtn.addEventListener("click", exportAdmissionsToCsv);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset submissions to default demo records?")) {
        localStorage.removeItem(LOCAL_STORAGE_ADMISSIONS_KEY);
        initializeLocalStorageAdmissions();
        renderAdminTable();
        updateAdminCountBadge();
        showToast("Demo records reset to default.", "🔄");
      }
    });
  }
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("is-open");

      // Close other items
      document.querySelectorAll(".faq-item").forEach(other => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ==========================================================================
// NAVBAR & GENERAL UI INTERACTIONS
// ==========================================================================
function initNavAndScroll() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  const header = document.getElementById("siteHeader");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Mobile Menu Toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header blur & Scroll-To-Top button on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      if (header) header.classList.add("scrolled");
      if (scrollTopBtn) scrollTopBtn.classList.add("is-visible");
    } else {
      if (header) header.classList.remove("scrolled");
      if (scrollTopBtn) scrollTopBtn.classList.remove("is-visible");
    }
  });

  // Download Brochure button simulation
  const btnBrochure = document.getElementById("btnDownloadBrochure");
  if (btnBrochure) {
    btnBrochure.addEventListener("click", () => {
      showToast("Official Prospectus 2026-27 downloaded successfully! (3.4 MB PDF)", "📥");
    });
  }
}

// ==========================================================================
// LEADERSHIP SLIDER (AUTOMATIC CONTINUOUS MOTION + MOUSE WHEEL SCROLL)
// ==========================================================================
function initLeadershipSlider() {
  const slider = document.getElementById("leadershipSlider");
  const track = document.getElementById("leadershipTrack");
  if (!slider || !track) return;

  let isUserInteracting = false;
  let resumeTimeout = null;
  const autoScrollSpeed = 0.85; // Smooth calm velocity

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  function handleWrapAround() {
    const halfWidth = getHalfWidth();
    if (halfWidth <= 0) return;
    if (slider.scrollLeft >= halfWidth) {
      slider.scrollLeft -= halfWidth;
    } else if (slider.scrollLeft <= 0) {
      slider.scrollLeft += halfWidth;
    }
  }

  // Smooth continuous auto-scroll loop
  function autoScrollLoop() {
    if (!isUserInteracting) {
      slider.scrollLeft += autoScrollSpeed;
      handleWrapAround();
    }
    requestAnimationFrame(autoScrollLoop);
  }

  requestAnimationFrame(autoScrollLoop);

  // Mouse wheel scroll synchronization (user scrolls wheel -> profiles move horizontally)
  slider.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      isUserInteracting = true;
      slider.scrollLeft += e.deltaY * 1.25;
      handleWrapAround();

      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 1200);
    }
  }, { passive: false });

  // Pause on mouse hover so user can comfortably read bios
  slider.addEventListener("mouseenter", () => {
    isUserInteracting = true;
  });

  slider.addEventListener("mouseleave", () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    isUserInteracting = false;
  });

  // Mouse Drag & Touch Swipe support
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    isUserInteracting = true;
    startX = e.pageX - slider.offsetLeft;
    scrollStart = slider.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 1000);
    }
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollStart - walk;
    handleWrapAround();
  });

  // Touch swipe support for mobile/tablets
  slider.addEventListener("touchstart", () => {
    isUserInteracting = true;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 1200);
  }, { passive: true });
}

// ==========================================================================
// EMAILJS INITIALIZATION & DISPATCH ENGINE
// ==========================================================================
function initEmailJs() {
  const pubKey = localStorage.getItem("acet_emailjs_public_key") || EMAILJS_CONFIG.publicKey;
  if (window.emailjs && pubKey) {
    try {
      window.emailjs.init({ publicKey: pubKey });
      console.log("EmailJS initialized successfully.");
    } catch (e) {
      console.warn("EmailJS init note:", e);
    }
  }
}

async function sendEmailViaEmailJs(params) {
  const serviceId = EMAILJS_CONFIG.serviceID;
  const templateId = localStorage.getItem("acet_emailjs_template_id") || EMAILJS_CONFIG.templateID;
  const publicKey = localStorage.getItem("acet_emailjs_public_key") || EMAILJS_CONFIG.publicKey;

  if (!window.emailjs) {
    console.warn("EmailJS SDK not loaded.");
    return { success: false, reason: "sdk_not_loaded" };
  }

  if (!publicKey) {
    console.warn("EmailJS: Public Key is required to send real emails.");
    return { success: false, reason: "missing_public_key" };
  }

  try {
    const res = await window.emailjs.send(serviceId, templateId, params, publicKey);
    console.log("EmailJS SUCCESS:", res.status, res.text);
    return { success: true, res };
  } catch (err) {
    console.warn("EmailJS dispatch error:", err);
    return { success: false, error: err };
  }
}

// ==========================================================================
// CAMPUS CONTACT FORM & LOCAL STORAGE
// ==========================================================================
function getStoredContacts() {
  const raw = localStorage.getItem(LOCAL_STORAGE_CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [
    {
      id: 1725619300000,
      ticketId: "MSG-2026-0101",
      submittedAt: "2026-09-02T11:00:00.000Z",
      name: "Kavitha Sundaram",
      email: "kavitha.s@gmail.com",
      phone: "9840123456",
      subject: "Admissions Inquiry",
      message: "Could you provide information regarding the cutoff marks for AI & Data Science under government counseling?"
    }
  ];
}

function updateContactCounts() {
  const badge = document.getElementById("adminCountContacts");
  if (badge) {
    const contacts = getStoredContacts();
    badge.textContent = String(contacts.length);
  }
  const admBadge = document.getElementById("adminCountAdmissions");
  if (admBadge) {
    const adms = getStoredAdmissions();
    admBadge.textContent = String(adms.length);
  }
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const formStatus = document.getElementById("contactFormStatus");
  const copyBtn = document.getElementById("btnCopyAddress");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const address = "Anwer College of Engineering & Technology, NH-48, Chennai–Bengaluru Highway, Kanchipuram – 631 502, Tamil Nadu, India.";
      navigator.clipboard.writeText(address).then(() => {
        showToast("Campus Address copied to clipboard!", "📋");
      }).catch(() => {
        showToast("Address: NH-48, Kanchipuram - 631 502", "📍");
      });
    });
  }

  if (!form) return;

  // Clear errors on input
  ["contactName", "contactEmail", "contactSubject", "contactMessage"].forEach(f => {
    const input = form.elements[f];
    if (input) {
      input.addEventListener("input", () => showFieldError(f, ""));
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formStatus) {
      formStatus.className = "form-status-alert";
      formStatus.textContent = "";
    }

    const name = form.elements.contactName.value.trim();
    const email = form.elements.contactEmail.value.trim();
    const phone = form.elements.contactPhone ? form.elements.contactPhone.value.trim() : "";
    const subject = form.elements.contactSubject.value;
    const message = form.elements.contactMessage.value.trim();

    let hasError = false;
    if (name.length < 2) {
      showFieldError("contactName", "Please enter your full name (min 2 characters).");
      hasError = true;
    } else {
      showFieldError("contactName", "");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFieldError("contactEmail", "Please enter a valid email address.");
      hasError = true;
    } else {
      showFieldError("contactEmail", "");
    }

    if (!subject) {
      showFieldError("contactSubject", "Please select a query category.");
      hasError = true;
    } else {
      showFieldError("contactSubject", "");
    }

    if (message.length < 5) {
      showFieldError("contactMessage", "Message must be at least 5 characters.");
      hasError = true;
    } else {
      showFieldError("contactMessage", "");
    }

    if (hasError) {
      if (formStatus) {
        formStatus.className = "form-status-alert is-error";
        formStatus.textContent = "Please correct the highlighted fields before sending.";
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("btn--loading");
    }

    const ticketId = `MSG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const contactEntry = {
      id: Date.now(),
      ticketId,
      submittedAt: new Date().toISOString(),
      name,
      email,
      phone: phone || "Not Provided",
      subject,
      message
    };

    // 1. Try sending to backend API
    try {
      await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactEntry)
      });
    } catch (err) {
      // offline/static fallback
    }

    // 2. Persist in local storage
    const list = getStoredContacts();
    list.unshift(contactEntry);
    localStorage.setItem(LOCAL_STORAGE_CONTACTS_KEY, JSON.stringify(list));
    updateContactCounts();

    // 3. Dispatch via EmailJS to meerananwer12@gmail.com
    const emailRes = await sendEmailViaEmailJs({
      to_name: "Principal & Admin Office",
      to_email: EMAILJS_CONFIG.targetEmail,
      from_name: name,
      name: name,
      from_email: email,
      email: email,
      reply_to: email,
      phone: phone || "Not Provided",
      subject: `[Campus Enquiry] ${subject}`,
      message: message,
      ticket_id: ticketId,
      received_at: new Date().toLocaleString("en-IN")
    });

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn--loading");
    }

    form.reset();

    if (formStatus) {
      formStatus.className = "form-status-alert is-success";
      if (emailRes.success) {
        formStatus.innerHTML = `<strong>Message Dispatched Successfully!</strong><br>An email alert was delivered directly to <strong>${EMAILJS_CONFIG.targetEmail}</strong> via EmailJS (Ticket Ref: <code>${ticketId}</code>). Our administration will respond within 24 hours.`;
      } else {
        formStatus.innerHTML = `<strong>Message Logged Successfully!</strong><br>Ticket Reference: <code>${ticketId}</code>. Logged in college administration records and queued for dispatch to <strong>${EMAILJS_CONFIG.targetEmail}</strong>.`;
      }
    }

    showToast(`Official message logged! Ref: ${ticketId}`, "✉️");
  });
}

// ==========================================================================
// EMAILJS SETTINGS & LIVE TEST IN ADMIN DRAWER
// ==========================================================================
function initEmailJsAdminSettings() {
  const serviceInput = document.getElementById("emailJsServiceId");
  const templateInput = document.getElementById("emailJsTemplateId");
  const publicInput = document.getElementById("emailJsPublicKey");
  const saveBtn = document.getElementById("btnSaveEmailJs");
  const testBtn = document.getElementById("btnTestEmailJs");
  const testAlert = document.getElementById("emailJsTestAlert");

  const currentTemplate = localStorage.getItem("acet_emailjs_template_id") || "template_1n0155w";
  const currentPublic = localStorage.getItem("acet_emailjs_public_key") || "0WR6ahkACe6eHYlt0";

  if (templateInput) templateInput.value = currentTemplate;
  if (publicInput) publicInput.value = currentPublic;

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const tVal = templateInput ? templateInput.value.trim() : "";
      const pVal = publicInput ? publicInput.value.trim() : "";

      localStorage.setItem("acet_emailjs_template_id", tVal);
      localStorage.setItem("acet_emailjs_public_key", pVal);

      EMAILJS_CONFIG.templateID = tVal;
      EMAILJS_CONFIG.publicKey = pVal;
      initEmailJs();

      if (testAlert) {
        testAlert.className = "emailjs-alert success";
        testAlert.style.display = "block";
        testAlert.innerHTML = `Saved! Service: <code>${EMAILJS_CONFIG.serviceID}</code> | Gmail: <code>${EMAILJS_CONFIG.targetEmail}</code>`;
      }
      showToast("EmailJS keys saved successfully!", "✅");
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", async () => {
      const tVal = templateInput ? templateInput.value.trim() : "";
      const pVal = publicInput ? publicInput.value.trim() : "";

      if (!pVal) {
        if (testAlert) {
          testAlert.className = "emailjs-alert error";
          testAlert.style.display = "block";
          testAlert.innerHTML = "<strong>Public Key Required:</strong> In your EmailJS dashboard, open <em>Account &gt; API Keys</em>, copy your <strong>Public Key</strong>, paste it above and click Save.";
        }
        return;
      }

      testBtn.disabled = true;
      testBtn.textContent = "Sending Test...";

      const res = await sendEmailViaEmailJs({
        to_name: "Admin Office",
        to_email: EMAILJS_CONFIG.targetEmail,
        from_name: "ACET Portal Test",
        name: "ACET Portal Test",
        from_email: "test@acet.ac.in",
        email: "test@acet.ac.in",
        reply_to: "test@acet.ac.in",
        phone: "+91 44 2726 8900",
        subject: "EmailJS Service Test Ping",
        message: "Congratulations! Your EmailJS Gmail service (service_r67exzm) is connected and functioning on the Anwer College Portal.",
        ticket_id: "TEST-" + Math.floor(1000 + Math.random() * 9000),
        received_at: new Date().toLocaleString("en-IN")
      });

      testBtn.disabled = false;
      testBtn.textContent = "Send Test Email";

      if (testAlert) {
        testAlert.style.display = "block";
        if (res.success) {
          testAlert.className = "emailjs-alert success";
          testAlert.innerHTML = `✅ <strong>Success!</strong> Live test email delivered to <strong>${EMAILJS_CONFIG.targetEmail}</strong> via Service <code>${EMAILJS_CONFIG.serviceID}</code>.`;
          showToast("Live test email sent to Gmail!", "📬");
        } else {
          testAlert.className = "emailjs-alert error";
          testAlert.innerHTML = `⚠️ <strong>EmailJS Status:</strong> ${res.error?.text || res.error?.message || "Please verify your Template ID and Public Key in EmailJS dashboard."}`;
        }
      }
    });
  }
}

// ==========================================================================
// ADMIN TABS & CONTACT MESSAGES TABLE
// ==========================================================================
function renderAdminContactsTable(filterQuery = "") {
  const tbody = document.getElementById("adminContactsTableBody");
  if (!tbody) return;

  let entries = getStoredContacts();
  if (filterQuery) {
    const q = filterQuery.toLowerCase();
    entries = entries.filter(e =>
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.ticketId && e.ticketId.toLowerCase().includes(q)) ||
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      (e.email && e.email.toLowerCase().includes(q))
    );
  }

  if (entries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No campus contact messages found.</td></tr>`;
    return;
  }

  tbody.innerHTML = entries.map(e => `
    <tr>
      <td><strong>${e.ticketId}</strong></td>
      <td><strong>${e.name}</strong></td>
      <td><span style="font-weight: 600; color: var(--blue-600);">${e.subject}</span></td>
      <td>${e.phone}<br><small style="color: var(--text-muted);">${e.email}</small></td>
      <td style="max-width: 250px;"><small style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${e.message}</small></td>
      <td><span class="status-chip verified">Received</span></td>
      <td><small>${new Date(e.submittedAt || Date.now()).toLocaleDateString("en-IN")}</small></td>
    </tr>
  `).join("");
}

function initAdminTabs() {
  const tabAdmissions = document.getElementById("tabBtnAdmissions");
  const tabContacts = document.getElementById("tabBtnContacts");
  const tableAdmissions = document.getElementById("adminSubmissionsTable");
  const tableContacts = document.getElementById("adminContactsTable");
  const counter = document.getElementById("recordsCounter");

  if (!tabAdmissions || !tabContacts) return;

  tabAdmissions.addEventListener("click", () => {
    tabAdmissions.classList.add("is-active");
    tabContacts.classList.remove("is-active");
    if (tableAdmissions) tableAdmissions.style.display = "table";
    if (tableContacts) tableContacts.style.display = "none";
    renderAdminTable();
  });

  tabContacts.addEventListener("click", () => {
    tabContacts.classList.add("is-active");
    tabAdmissions.classList.remove("is-active");
    if (tableAdmissions) tableAdmissions.style.display = "none";
    if (tableContacts) tableContacts.style.display = "table";
    renderAdminContactsTable();
    if (counter) {
      counter.textContent = `Showing ${getStoredContacts().length} campus message(s)`;
    }
  });
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeLocalStorageAdmissions();
  initEmailJs();
  initNavAndScroll();
  initCountdown();
  initLeadershipSlider();
  loadNotices();
  initNoticeControls();
  initDepartmentFeatures();
  initFeeCalculator();
  initAdmissionForm();
  initContactForm();
  initAdminModal();
  initEmailJsAdminSettings();
  initAdminTabs();
  initFaqAccordion();
  updateAdminCountBadge();
  updateContactCounts();
});


