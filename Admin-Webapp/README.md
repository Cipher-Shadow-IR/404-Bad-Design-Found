<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&size=30&duration=4000&color=6C63FF&center=true&vCenter=true&width=1100&height=70&lines=Admin+Dashboard+%7C+404%3A+Bad+Design+Found+%F0%9F%9B%A1%EF%B8%8F" alt="Typing SVG" />
</p>

<h2 align="center">📊 Real-Time Organizer Dashboard — Monitor, Review & Judge</h2>

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Version-1.1.0-6C63FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Port-4000-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Requires-404--NF--Webapp-FF6B35?style=for-the-badge" />
</p>

---

### 🌟 About the Project

The **Admin-Webapp** is the central control panel for **"404: Bad Design Found"**. It provides real-time oversight of all teams, their progress, and their creative output. 

By fetching data live from the game server, this dashboard ensures that organizers can monitor team activity, check for integrity violations, and judge final layouts without ever touching the database.

---

### 🧠 Key Features

- 📡 **10s Auto-Monitoring**  
  The dashboard automatically refreshes every 10 seconds, providing a continuous pulse on the event status.

- 🧮 **Mutual Exclusive Stats**  
  Refined logic ensures that "Pending", "Submitted", and "Disqualified" counts are mutually exclusive, providing an accurate audit of the field.

- 🎨 **High-Fidelity Preview**  
  The design preview modal renders teams' exact layouts, including their chosen canvas background colors, scaled perfectly to the viewing area.

- � **Live Team Table**  
  Filterable and searchable table showing quiz performance, unlocked elements, and a live ticking clock for active teams.

- � **Integrity Tracking**  
  Direct visibility into cheat counts and disqualification status.

---

### ⚙️ How To Run

#### 📦 Install Dependencies
```bash
cd 404-Bad-Design-Found/Admin-Webapp
npm install
```

#### ▶️ Execution
```bash
# Ensure 404-Not-Found-Webapp is running on port 3000
node server.js
```

> Admin Dashboard starts at **http://10.1.27.206:4000**

---

### 🔌 API Reference (Proxy)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/admin/api/teams` | All team data + submissions |
| `GET`  | `/admin/api/stats` | Accurately computed event stats |
| `GET`  | `/admin/api/submissions` | Timeline of all submitted entries |

---

### � Behind the Interface

- **Zero DB Footprint**: The admin app is a clean proxy. It holds no state, making it resilient and easy to deploy.
- **Proportional Scaling**: Elements are rendered using a scaling algorithm that maintains their relative positions from the original 16:9 canvas.
- **Glassmorphism UI**: Uses the same premium design language as the landing page, ensuring a cohesive ecosystem feel.

---

### 📖 License & Usage

Part of the **404-Bad-Design-Found** project. Created for TECHXTREME GU 2026.

---

<p align="center">
  <img src="https://img.icons8.com/color/48/combo-chart--v1.png" /><br><br>
  <b>📊 Monitor Every Move. Judge Every Design.</b><br>
  <i>~ 404: Bad Design Found — Admin Panel</i>
</p>
