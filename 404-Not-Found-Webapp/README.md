<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=30&duration=4000&color=FF6B35&center=true&vCenter=true&width=1100&height=70&lines=404%3A+Bad+Design+Found+%F0%9F%9A%80+%7C+Game+Server" alt="Typing SVG" />
</p>

<h2 align="center">🧩 A Full-Stack Web Design Challenge — Powered by Node.js & SQLite</h2>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Version-1.1.0-orange?style=for-the-badge" />
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
  Each team gets a unique mix of theory questions and image puzzles (assigned server-side).

- 🔓 **Element Unlock System**  
  Answering quiz questions correctly unlocks specific UI elements on the drag-and-drop canvas.

- 🖼️ **Canvas-Based Web Builder**  
  Teams arrange unlocked assets on a live canvas. Features include rotation, scaling, and z-index layering.

- 💾 **Session Persistence (Drafting)**  
  Real-time auto-saving of the canvas state. Teams can log out and resume exactly where they left off.

- 🚨 **Global Anti-Cheat Security**  
  Window-wide detection for right-clicking, copying, or tab-switching. At **3 violations**, the team is auto-submitted and blocked.

- 🎨 **Fidelity Submissions**  
  Captures canvas background color and precise element coordinates for perfect admin previews.

---

### ⚙️ How To Run

#### 🧰 Prerequisites
- Node.js `v18+`
- npm

#### 📦 Install Dependencies
```bash
git clone https://github.com/Cipher-Shadow-IR/404-Bad-Design-Found.git
cd 404-Bad-Design-Found/404-Not-Found-Webapp
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

---

### 🗂 Folder Architecture

```
404-Not-Found-Webapp/
├── server.js              # Express app — core API logic
├── database.js            # SQLite schema + connection
├── db.sqlite              # Persistent local database
├── package.json
└── public/
    ├── Auth/
    │   └── login.html     # Team login / registration page
    ├── Main/
    │   ├── builder.html          # Canvas drag-and-drop builder
    │   ├── builder-scripts.js    # All builder interactions & persistence
    │   └── builder-styles.css    # Builder UI styles
    ├── Quizzes/
    │   └── quiz_ques.json # Global question bank
    └── Assets/
        ├── Elements/      # free_elements & locked_elements
        └── Puzzles/       # Jigsaw puzzle images
```

---

### 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Register or log in a team |
| `GET`  | `/elements` | List all free + locked UI elements |
| `GET`  | `/quiz/:team_id` | Get assigned questions for a team |
| `POST` | `/quiz/answer` | Submit a quiz answer |
| `POST` | `/draft` | Save canvas draft (Persistence) |
| `GET`  | `/draft/:team_id` | Retrieve saved canvas draft |
| `POST` | `/cheat` | Register a security violation strike |
| `POST` | `/submit` | Final submission with full design specs |

---

### 🗄️ Database Schema

```
teams               → id, team_name, phone, start_time, submitted,
                       cheat_count, is_blocked, created_at

team_questions      → id, team_id, element_name, question_id,
                       type, grid_size, puzzle_image, answered, correct

drafts              → team_id (PK), layout_json, updated_at

submissions         → id, team_id, layout_json, canvas_bg_color,
                       time_taken, unlocked_count, created_at
```

---

### 🛡️ Security Protocol

- **3 Strikes System**: Any attempt to right-click, copy, cut, or switch tabs counts as a violation.
- **Auto-Submission**: On the 3rd violation, the team is disqualified and their current draft is forcibly submitted as the final entry.
- **Persistence**: Even during crashes or logouts, the `drafts` table ensures designers can continue their work.

---

### 📖 License & Usage

Licensed under the **ISC License**. Created for TECHXTREME GU 2026.

---

<p align="center">
  <img src="https://img.icons8.com/color/48/rocket.png" /><br><br>
  <b>🚀 Build. Quiz. Submit. Win.</b><br>
  <i>~ 404: Bad Design Found</i>
</p>
