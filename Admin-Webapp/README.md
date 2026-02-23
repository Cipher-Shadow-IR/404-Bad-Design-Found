<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=30&duration=4000&color=6C63FF&center=true&vCenter=true&width=1100&height=70&lines=Admin+Dashboard+%7C+404%3A+Bad+Design+Found+%F0%9F%9B%A1%EF%B8%8F" alt="Typing SVG" />
</p>

<h2 align="center">📊 Real-Time Organizer Dashboard — Monitor, Review & Judge</h2>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Version-1.0.0-6C63FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Port-4000-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Requires-404--NF--Webapp-FF6B35?style=for-the-badge" />
</p>

---

### 🌟 About the Project

> *One glance. Every team. Full control.*

The **Admin-Webapp** is the organizer-facing control panel for the **"404: Bad Design Found"** event. It connects to the game server (`404-Not-Found-Webapp`) and gives event organizers a live view of all participating teams — their current status, quiz performance, cheat history, time taken, and a **visual preview of every team's final canvas design submission**.

No database needed here. It's a clean, stylish **proxy dashboard** that talks to the game server.

---

### 👥 Development Team

| Role | Name |
|------|------|
| 🎨 **Project Coordinator & Designer** | Kavya Patel |
| ⚙️ **Full-Stack Dev — Backend + Canvas/Dragger Frontend** | Ishaan Ray |
| 🎨 **Frontend Dev — 404 Not Found Webapp** | Rishi Prajapati |
| 🔧 **Backend Dev — Admin Webapp** | Dev Sahani |
| 🖥️ **Frontend Dev — Admin Webapp** | Prit Sahani |

---

### 🧠 Key Features

- 📡 **Live Auto-Refresh**  
  Dashboard polls the game server every **10 seconds** and updates all stats automatically.

- 🧮 **Stats Overview Cards**  
  At a glance: total registered teams, submitted count, pending teams, and disqualified teams.

- 📋 **Filterable Team Table**  
  - Filter by **All / Submitted / Pending** via tab bar  
  - **Search** teams by name or phone number in real time  
  - Shows quiz score, elements unlocked, time taken (live for active teams), and submission status

- 🎨 **Canvas Design Preview Modal**  
  Click "View" on any submitted team to open a **scaled preview** of their exact canvas layout — elements are rendered at the same relative positions as submitted, pulled live from the game server.

- 🚩 **Integrity Badges**  
  Each team's detail view shows:  
  - ✅ `Fair Play` — no cheating detected  
  - ⚠️ `X warning(s)` — tab-switch violations recorded  
  - ❌ `DISQUALIFIED` — team was blocked (3+ violations)

- 🕐 **Live Clock**  
  Real-time clock displayed in the topbar, localized to Indian time.

---

### ⚙️ How To Run

#### 🧰 Prerequisites
- Node.js `v18+`
- npm
- **`404-Not-Found-Webapp` must be running on port `3000`** (Admin-Webapp is a proxy — it depends on the game server)

#### 📦 Install Dependencies
```bash
cd 404-not-found/Admin-Webapp
npm install
```

#### ▶️ Development Mode (with auto-reload)
```bash
npm run dev
```

#### 🚀 Production Mode
```bash
npm start
```

> Admin Dashboard starts at **http://localhost:4000**

---

### 🗂 Folder Architecture

```
Admin-Webapp/
├── server.js       # Express proxy server — all /admin/api/* routes
├── index.html      # Single-page dashboard UI (HTML + inline JS)
├── styles.css      # Full custom CSS — dark theme, glass cards, modals
└── package.json
```

---

### 🔌 API Reference (Proxy Routes)

All routes proxy data from the game server at `http://localhost:3000`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/admin/api/teams` | Fetch all teams + submission data |
| `GET`  | `/admin/api/teams/:id` | Fetch a single team's detail |
| `GET`  | `/admin/api/stats` | Computed stats: total / submitted / pending |
| `GET`  | `/admin/api/submissions` | All submissions ordered by time |

---

### 🖥️ Dashboard Sections


| Section                            | UI Elements                                                                                          | Description                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Topbar**                         | Brand • Live Clock (IST) • Team Count • Refresh                                                      | Dashboard header bar for quick context + manual refresh.                                                                   |
| **Stats Row**                      | Total Teams • Submitted • Pending • Disqualified                                                     | At-a-glance event summary with live computed counts.                                                                       |
| **Main Panel — Submission Review** | Tabs: All / Submitted / Pending • Search (team/phone) • Table                                        | Core judging area: filter teams, search instantly, review progress & submissions.                                          |
| **Teams Table**                    | # • Team • Phone • Quiz • Unlocked • Time • Status • Preview                                         | Shows live status and performance. Time updates live for active teams; status uses colored pills.                          |
| **Design Preview Modal**           | Team avatar/name/phone • Quiz Score • Elements Used • Time • Scaled Canvas Preview • Integrity Badge | Opens on **View** click. Renders exact submission layout with scaled coordinates and integrity state (Fair / Warned / DQ). |



---

### 🔧 Behind the Interface

- 🔄 **Proxy Architecture** — Admin-Webapp has no database of its own; all data is fetched live from the game server (`localhost:3000`).
- 🎨 **Custom Dark UI** — Fully hand-crafted CSS with glassmorphism cards, colored stat chips, status pills, and responsive modals. No external UI library.
- 📐 **Scaled Canvas Preview** — Submission coordinates are scaled proportionally from the original 960×540 canvas to the modal's display width, preserving the exact visual layout.
- ⏱️ **Live Timer** — Active (non-submitted) teams show a live elapsed counter that ticks in the table.
- 🔁 **Auto-Refresh Loop** — `setInterval(loadAll, 10000)` keeps data fresh every 10 seconds without manual intervention.

---

### 🔮 What's Next?

- 🏆 Leaderboard view with ranking by quiz score + time taken
- 📥 CSV / JSON export of all submissions
- 🔐 Password-protected admin login page
- 🔔 Browser notifications on new submissions
- 🧩 Detailed per-element breakdown in the design preview
- 📱 Mobile-friendly responsive layout

---

### 🔗 Related

> This dashboard is part of the **404-not-found** monorepo.  
> See also: [`404-Not-Found-Webapp`](../404-Not-Found-Webapp/README.md) — the game server this dashboard connects to.

---

### 📖 License & Usage

Part of the **404-not-found** project — ISC License. For access or collaboration, visit the [GitHub repository](https://github.com/dev-sahani23/404-not-found).

---

<p align="center">
  <img src="https://img.icons8.com/color/48/combo-chart--v1.png" /><br><br>
  <b>📊 Monitor Every Move. Judge Every Design.</b><br>
  <i>~ 404: Bad Design Found — Admin Panel</i>
</p>
