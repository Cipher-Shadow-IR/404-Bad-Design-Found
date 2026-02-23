<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=30&duration=4000&color=FF6B35&center=true&vCenter=true&width=1100&height=70&lines=404%3A+Bad+Design+Found+%F0%9F%9A%80+%7C+Game+Server" alt="Typing SVG" />
</p>

<h2 align="center">🧩 A Full-Stack Web Design Challenge — Powered by Node.js & SQLite</h2>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Port-3000-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" />
</p>

---

### 🌟 About the Project

> *Drop the elements. Answer the quiz. Design the page. Win the challenge.*

The **404-Not-Found-Webapp** is the core game server for the **"404: Bad Design Found"** design challenge event. Teams log in, get assigned unique quiz questions (theory + puzzles), unlock UI elements by answering correctly, and drag-and-drop those elements onto a canvas to build a web page — all under a live timer.

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

- 🔐 **Auto-Register & Login System**  
  Teams log in with a name + phone number. New teams are auto-registered and their timer starts immediately.

- 🧩 **Dynamic Quiz Assignment**  
  Each team gets **11 unique questions** per session: 7 theory (60% easy, 30% medium, 10% hard) + 4 image puzzles (3×3, 3×3, 4×4, 5×5 grid). Questions are assigned server-side to prevent cheating.

- 🔓 **Element Unlock System**  
  There are **3 free** and **11 locked** UI elements. Answering a quiz question correctly unlocks the paired locked element on the drag-and-drop canvas.

- 🖼️ **Canvas-Based Web Builder**  
  Teams arrange unlocked UI assets (logo, navbar, slider, sale banners, category icons, etc.) on a live canvas to reconstruct a storefront page.

- 🚨 **Anti-Cheat Detection**  
  Switching tabs or windows triggers a cheat warning. At **3 violations**, the team is automatically **blocked/disqualified**.

- 📦 **Sealed Submissions**  
  Teams submit their final canvas layout as a JSON snapshot (positions, sizes, element list) along with quiz performance and time taken.

- 📊 **Admin API Endpoints**  
  Built-in admin routes expose all team data, submissions, and stats — consumed by the Admin-Webapp dashboard.

---

### ⚙️ How To Run

#### 🧰 Prerequisites
- Node.js `v18+`
- npm

#### 📦 Install Dependencies
```bash
git clone https://github.com/dev-sahani23/404-not-found.git
cd 404-not-found/404-Not-Found-Webapp
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

> Server starts at **http://localhost:3000**  
> Landing page redirects to `/Auth/login.html`

---

### 🗂 Folder Architecture

```
404-Not-Found-Webapp/
├── server.js              # Express app — all API routes
├── database.js            # SQLite schema + connection
├── db.sqlite              # Persistent local database
├── package.json
└── public/
    ├── Auth/
    │   └── login.html     # Team login / registration page
    ├── Main/
    │   ├── builder.html          # Canvas drag-and-drop builder
    │   ├── builder-scripts.js    # All builder interactions & quiz logic
    │   └── builder-styles.css    # Builder UI styles
    ├── Quizzes/
    │   └── quiz_ques.json # Question bank (easy/medium/hard/advanced)
    └── Assets/
        ├── Elements/
        │   ├── free_elements/     # logo_demo, profile_icon, searchbar
        │   └── locked_elements/   # buy_now, hamburger, slider, wishlist…
        └── Puzzles/               # Image puzzles (BurningCar, Paris…)
```

---

### 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Register or log in a team |
| `GET`  | `/elements` | List all free + locked UI elements |
| `GET`  | `/quiz/:team_id` | Get assigned questions for a team |
| `POST` | `/quiz/answer` | Submit a quiz answer (idempotent) |
| `POST` | `/cheat` | Register a tab-switch cheat event |
| `POST` | `/submit` | Submit final canvas layout + quiz data |
| `GET`  | `/admin/teams` | Admin: all teams with submission info |
| `GET`  | `/admin/submissions` | Admin: all submissions ordered by time |

---

### 🗄️ Database Schema

```
teams               → id, team_name, phone, start_time, submitted,
                      cheat_count, is_blocked, created_at

team_questions      → id, team_id, element_name, question_id,
                      type (theory/puzzle), grid_size, puzzle_image,
                      answered, correct

login_logs          → id, team_id, login_time

unlocks             → id, team_id, element_name  [UNIQUE per pair]

submissions         → id, team_id, layout_json, time_taken,
                      unlocked_count, created_at
```

---

### 🔧 Behind the Interface

- ⚡ **Express 5** — Modern routing with async/await support
- 🧩 **SQLite3** — Lightweight, file-based persistent store (`db.sqlite`)
- 🔄 **`db.serialize()`** — Prevents race conditions for concurrent teams
- 🎲 **Randomized Question Pool** — Shuffled per team; theory IDs tracked globally to minimize repeats
- 🛡️ **Idempotent `/quiz/answer`** — Double-submit protection via `answered` flag
- 🚫 **`/cheat` endpoint** — Automatically blocks team at 3 violations

---

### 🔮 What's Next?

- 📱 Mobile-responsive canvas builder
- ⏱️ Live countdown timer per team
- 🏆 Real-time leaderboard integration
- 🔒 Session tokens for proper auth
- 📷 Canvas screenshot export on submission
- 🧪 Automated test suite for API endpoints

---

### 📖 License & Usage

Licensed under the **ISC License**. For access or collaboration, visit the [GitHub repository](https://github.com/dev-sahani23/404-not-found).

---

<p align="center">
  <img src="https://img.icons8.com/color/48/rocket.png" /><br><br>
  <b>🚀 Build. Quiz. Submit. Win.</b><br>
  <i>~ 404: Bad Design Found</i>
</p>
