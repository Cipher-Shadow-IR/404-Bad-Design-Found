# 404: Bad Design Found (404BDF)

Welcome to the **404: Bad Design Found** ecosystem—a high-stakes UI/UX design challenge built for **TECHXTREME 2026**. This project transforms the concept of "bad design" into a strategic game, challenging designers to master antipatterns while solving complex puzzles.

## 🚀 Project Overview

The ecosystem consists of three main components:

- **[404-Not-Found-Webapp](./404-Not-Found-Webapp)**: The core game engine. Includes the team portal, login system, quiz/puzzle engine, and the creative canvas builder.
- **[Admin-Webapp](./Admin-Webapp)**: The command center for event organizers. Provides real-time stats, team monitoring, and high-fidelity design previews.
- **[404BDF-Landing-Page](./404BDF-Landing-Page)**: A high-end, animated portal that introduces the challenge and the masters behind it.

## 🛠️ Key Features

- **Strategic Canvas Builder**: A flexible arena where teams manifest their chaotic designs using unlocked elements.
- **Dynamic Lock System**: Elements are locked behind MCQ and jigsaw puzzles to ensure a competitive progression.
- **Session Persistence**: Robust auto-save/resume logic ensuring no work is lost during the event.
- **Anti-Cheat Enforcement**: Window-wide security protocols with a 3-strike system and automated submission.
- **Admin Real-time Sync**: Organizers can see exactly what teams are building as they build it.

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Cipher-Shadow-IR/404-Bad-Design-Found.git
   cd 404-Bad-Design-Found
   ```

2. Setup the Game Server:
   ```bash
   cd 404-Not-Found-Webapp
   npm install
   node server.js
   ```

3. Setup the Admin Panel:
   ```bash
   cd ../Admin-Webapp
   npm install
   node server.js
   ```

4. Access the Landing Page:
   Simply open `404BDF-Landing-Page/index.html` in any modern browser.

## 🧑‍💻 Primary Developer
**Ishaan Ray** — Full Stack Engineer / UI Designer

---
*Created for TECHXTREME GU 2026.*
