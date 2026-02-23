document.addEventListener("DOMContentLoaded", () => {
  initSession(); // Start with session entry
  // Other inits moved inside initSession or triggered after fullscreen
});

/* =========================
   SESSION & FULLSCREEN
========================= */
function initSession() {
  const teamName = localStorage.getItem("team_name");
  if (!teamName) {
    window.location.href = "/Auth/login.html";
    return;
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "global-overlay";
  overlay.id = "session-overlay";
  overlay.innerHTML = `
    <div class="onboarding-card">
      <div class="security-icon" style="background:rgba(124,108,255,0.1); color:var(--primary); border-color:rgba(124,108,255,0.2)">
        <i class="fa-solid fa-expand"></i>
      </div>
      <h2>Secure Session Ready</h2>
      <p>To ensure a fair competition, the builder must be used in Fullscreen Mode. 
      Exiting fullscreen will lock the interface.</p>
      <button class="auth-btn" id="start-session-btn" style="width:auto; padding: 1rem 3rem;">
        Initialize Arena
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("start-session-btn").addEventListener("click", async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      overlay.classList.add("hidden");
      setTimeout(() => overlay.remove(), 300);
      
      // Start the app logic
      initApp();
    } catch (err) {
      console.error("Fullscreen failed", err);
      showSecurityWarning("ACTION REQUIRED", "Fullscreen mode is compulsory to enter the Arena. Please click the button again.");
    }
  });

  // Listen for fullscreen change
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      showEnforcementOverlay();
    } else {
      hideEnforcementOverlay();
    }
  });
}

function showEnforcementOverlay() {
  let overlay = document.getElementById("enforcement-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "global-overlay";
    overlay.id = "enforcement-overlay";
    overlay.innerHTML = `
      <div class="enforcement-message">
        <h1 style="color:#ff6b6b; font-size:3rem; margin-bottom:1rem;">🔒 ACCESS LOCKED</h1>
        <p>Fullscreen mode has been exited. Please re-enter to continue.</p>
        <button class="auth-btn" onclick="document.documentElement.requestFullscreen()" style="width:auto; padding: 1rem 2rem; margin-top:2rem">
          Re-enter Fullscreen
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  overlay.classList.remove("hidden");
  const wrapper = document.querySelector(".page-wrapper");
  if (wrapper) wrapper.style.filter = "blur(10px) grayscale(1)";
}

function hideEnforcementOverlay() {
  const overlay = document.getElementById("enforcement-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }
  const wrapper = document.querySelector(".page-wrapper");
  if (wrapper) wrapper.style.filter = "none";
}

function initApp() {
  initTopbar();
  loadElements();
  initCanvasDragDrop();
  initCanvasInteraction();
  initSecurity();
  loadQuizData();
}

/* =========================
   CUSTOM SECURITY WARNING UI
========================= */
function showSecurityWarning(title, message, callback) {
  // Remove any existing one
  const existing = document.getElementById("security-warning-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "security-modal";
  modal.id = "security-warning-modal";
  modal.innerHTML = `
    <div class="security-icon">
      <i class="fa-solid fa-triangle-exclamation"></i>
    </div>
    <h3>${title}</h3>
    <p>${message}</p>
    <button class="security-btn">Understood</button>
  `;
  document.body.appendChild(modal);

  // Trigger reflow for animation
  setTimeout(() => modal.classList.add("active"), 10);

  modal.querySelector(".security-btn").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
      if (callback) callback();
    }, 300);
  });
}


/* =========================
   TOPBAR (TEAM + TIMER)
   Auto-submit at 0, 2-min warning
========================= */
let warningShown = false;
let autoSubmitted = false;

function initTopbar() {
  const teamName = localStorage.getItem("team_name");
  const startTime = localStorage.getItem("start_time");

  const teamEl = document.getElementById("team-name");
  const timerEl = document.getElementById("timer");

  if (!teamName || !startTime) {
    window.location.href = "/Auth/login.html";
    return;
  }

  teamEl.textContent = teamName;

  const totalTime = 20 * 60; // 20 minutes in seconds
  const WARNING_AT = 2 * 60;  // show warning at 2 minutes remaining

  function updateTimer() {
    const now = Date.now();
    const elapsed = Math.floor((now - parseInt(startTime)) / 1000);
    const remaining = totalTime - elapsed;

    // ── Time's up → auto-submit ──
    if (remaining <= 0) {
      timerEl.textContent = "00:00";
      if (!autoSubmitted) {
        autoSubmitted = true;
        showSecurityWarning(
          "⏰ TIME'S UP",
          "Your 20 minutes are over. Your design is being auto-submitted now.",
          () => { submitDesign(true); }
        );
        // Fallback: force submit after 4 seconds even if modal isn't dismissed
        setTimeout(() => { submitDesign(true); }, 4000);
      }
      return;
    }

    const mins = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const secs = (remaining % 60)
      .toString()
      .padStart(2, "0");

    timerEl.textContent = `${mins}:${secs}`;

    // ── Last 2 minutes → red timer + warning banner ──
    if (remaining <= WARNING_AT) {
      timerEl.style.color = "#ff4d6a";
      timerEl.style.animation = "pulse-text 1s ease-in-out infinite";

      if (!warningShown) {
        warningShown = true;
        showTimerWarning();
      }
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 2-minute warning banner */
function showTimerWarning() {
  // Remove existing warning if any
  const existing = document.getElementById("timer-warning-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "timer-warning-banner";
  banner.innerHTML = `
    <span class="warning-pulse">⚠️</span>
    <span><b>2 minutes remaining!</b> Hurry up — your design will be auto-submitted when time runs out.</span>
    <button id="dismiss-timer-warning">✕</button>
  `;

  Object.assign(banner.style, {
    position: "fixed",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "10000",
    background: "linear-gradient(135deg, #ff4d6a, #ff6b35)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 8px 32px rgba(255,77,106,0.4)",
    animation: "slideDown 0.4s ease-out, pulse-banner 2s ease-in-out infinite",
    maxWidth: "600px",
    width: "90%",
  });

  // Inject keyframes if not already present
  if (!document.getElementById("timer-warning-styles")) {
    const style = document.createElement("style");
    style.id = "timer-warning-styles";
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to   { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes pulse-banner {
        0%, 100% { box-shadow: 0 8px 32px rgba(255,77,106,0.4); }
        50% { box-shadow: 0 8px 48px rgba(255,77,106,0.7); }
      }
      @keyframes pulse-text {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .warning-pulse {
        animation: pulse-text 1s ease-in-out infinite;
        font-size: 18px;
      }
      #dismiss-timer-warning {
        background: rgba(255,255,255,0.2);
        border: none;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        border-radius: 6px;
        padding: 4px 8px;
        margin-left: auto;
      }
      #dismiss-timer-warning:hover { background: rgba(255,255,255,0.35); }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(banner);

  banner.querySelector("#dismiss-timer-warning").addEventListener("click", () => {
    banner.style.animation = "none";
    banner.style.opacity = "0";
    banner.style.transform = "translateX(-50%) translateY(-100%)";
    banner.style.transition = "all 0.3s ease-in";
    setTimeout(() => banner.remove(), 300);
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (banner.parentNode) {
      banner.style.opacity = "0";
      banner.style.transform = "translateX(-50%) translateY(-100%)";
      banner.style.transition = "all 0.3s ease-in";
      setTimeout(() => banner.remove(), 300);
    }
  }, 10000);
}

/* =========================
   LOAD ELEMENTS
========================= */
async function loadElements() {
  const container = document.getElementById("elements-container");
  container.innerHTML = "";

  try {
    const res = await fetch("/elements");
    const items = await res.json();

    // Separate free & locked
    const freeItems = items.filter(i => !i.locked);
    const lockedItems = items.filter(i => i.locked);

    // Free section label
    if (freeItems.length) {
      const freeLabel = document.createElement("div");
      freeLabel.className = "section-label free-label";
      freeLabel.textContent = "Free Elements";
      container.appendChild(freeLabel);

      const freeGrid = document.createElement("div");
      freeGrid.className = "elements-grid";
      freeItems.forEach(item => {
        freeGrid.appendChild(createElementCard(item, false));
      });
      container.appendChild(freeGrid);
    }

    // Locked section label
    if (lockedItems.length) {
      const lockedLabel = document.createElement("div");
      lockedLabel.className = "section-label locked-label";
      lockedLabel.textContent = "Locked Elements";
      container.appendChild(lockedLabel);

      const lockedGrid = document.createElement("div");
      lockedGrid.className = "elements-grid";
      lockedItems.forEach(item => {
        lockedGrid.appendChild(createElementCard(item, true));
      });
      container.appendChild(lockedGrid);
    }

  } catch (err) {
    console.error("Element load failed", err);
  }
}

function createElementCard(item, isLocked) {
  const div = document.createElement("div");
  div.className = "element" + (isLocked ? " locked" : "");
  div.draggable = !isLocked;
  div.dataset.src = item.src;
  div.dataset.locked = isLocked ? "true" : "false";
  div.dataset.elementName = item.name || elementNameFromSrc(item.src);

  const name = formatName(item.src);

  div.innerHTML = `
    <img src="${item.src}" alt="${name}" draggable="false" />
    <div class="element-name">${name}</div>
    ${isLocked ? '<div class="lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
  `;

  // Locked element click → quiz popup for this specific element
  if (isLocked) {
    div.addEventListener("click", () => {
      showQuizPopup(item, div);
    });
  }

  return div;
}

function elementNameFromSrc(src) {
  return src.split("/").pop().replace(/\.(png|jpe?g|gif|svg|webp)$/i, "");
}

function formatName(file) {
  return file
    .split("/").pop()
    .replace("_demo.png", "")
    .replace(".png", "")
    .replace(".jpeg", "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

/* =========================
   QUIZ DATA & STATE (SERVER-ASSIGNED)
   Each locked element gets its own unique question.
========================= */
let quizByElement = {};  // { element_name: questionRow }
let quizAttempted = 0;
let quizTotal = 11;
let quizCorrect = 0;
let quizWrong = 0;

async function loadQuizData() {
  const teamId = localStorage.getItem("team_id");
  if (!teamId) return;

  try {
    const res = await fetch(`/quiz/${teamId}`);
    const data = await res.json();

    // Build element_name → question mapping
    quizByElement = {};
    data.forEach(q => {
      if (q.element_name) {
        quizByElement[q.element_name] = q;
      }
    });

    quizTotal = data.length;
    quizAttempted = data.filter(q => q.answered).length;
    quizCorrect = data.filter(q => q.answered && q.correct).length;
    quizWrong = data.filter(q => q.answered && !q.correct).length;

    updateQuizCounter();

    // Restore element states for already-answered questions
    restoreElementStates();
  } catch (err) {
    console.error("Failed to load quiz data", err);
  }
}

function restoreElementStates() {
  // For each answered question, update the corresponding element card
  document.querySelectorAll(".element.locked").forEach(card => {
    const elName = card.dataset.elementName;
    const q = quizByElement[elName];
    if (q && q.answered) {
      if (q.correct) {
        unlockElement(card);
      } else {
        lockElementPermanently(card);
      }
    }
  });
}

function getQuestionForElement(elementName) {
  return quizByElement[elementName] || null;
}

function updateQuizCounter() {
  const attemptedEl = document.getElementById("quiz-attempted");
  const pendingEl = document.getElementById("quiz-pending");
  if (attemptedEl) attemptedEl.textContent = quizAttempted;
  if (pendingEl) pendingEl.textContent = quizTotal - quizAttempted;
}

// Load quiz data handled in initApp()



/* =========================
   QUIZ POPUP (LOCKED ELEMENTS)
========================= */
function showQuizPopup(item, elementCard) {
  // Remove any existing popup
  const existing = document.querySelector(".quiz-popup-overlay");
  if (existing) existing.remove();

  // Find the question assigned to THIS specific element
  const elName = elementCard.dataset.elementName || elementNameFromSrc(item.src);
  const questionRow = getQuestionForElement(elName);

  const overlay = document.createElement("div");
  overlay.className = "quiz-popup-overlay";

  if (!questionRow) {
    // No question for this element (shouldn't happen normally)
    overlay.innerHTML = `
      <div class="quiz-popup">
        <div class="quiz-popup-header">
          <span class="quiz-popup-icon">📋</span>
          <h3>No Question Available</h3>
        </div>
        <div class="quiz-popup-body">
          <p class="quiz-popup-message">No quiz question is assigned to this element.</p>
        </div>
        <div class="quiz-popup-actions">
          <button class="quiz-popup-close">Close</button>
        </div>
      </div>
    `;
    overlay.querySelector(".quiz-popup-close").addEventListener("click", () => {
      overlay.classList.add("closing");
      setTimeout(() => overlay.remove(), 200);
    });
    document.body.appendChild(overlay);
    return;
  }

  // If already answered, don't show popup again
  if (questionRow.answered) {
    return;
  }

  if (questionRow.type === "theory") {
    showTheoryPopup(overlay, questionRow, item, elementCard);
  } else {
    showPuzzlePopup(overlay, questionRow, item, elementCard);
  }

  // Click overlay background to close (only if not yet answered)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay && !overlay.dataset.answered) {
      overlay.classList.add("closing");
      setTimeout(() => overlay.remove(), 200);
    }
  });

  document.body.appendChild(overlay);
}

/* =========================
   THEORY MCQ POPUP
========================= */
function showTheoryPopup(overlay, questionRow, item, elementCard) {
  const question = questionRow.questionData;
  if (!question) return;

  const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

  overlay.innerHTML = `
    <div class="quiz-popup">
      <div class="quiz-popup-header">
        <span class="quiz-popup-icon">🧠</span>
        <h3>Unlock: ${formatName(item.src)}</h3>
      </div>
      <div class="quiz-popup-body">
        <div class="quiz-question-badge">${question.level.toUpperCase()}</div>
        <p class="quiz-question-text">${question.question}</p>
        <div class="quiz-options">
          ${shuffledOptions.map((opt, i) => `
            <button class="quiz-option" data-answer="${opt}">
              <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="quiz-option-text">${opt}</span>
            </button>
          `).join("")}
        </div>
        <div class="quiz-feedback" style="display:none;"></div>
      </div>
    </div>
  `;

  const optionBtns = overlay.querySelectorAll(".quiz-option");
  const feedbackEl = overlay.querySelector(".quiz-feedback");

  optionBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      if (overlay.dataset.answered) return;
      overlay.dataset.answered = "true";

      const selected = btn.dataset.answer;
      const isCorrect = selected === question.answer;

      // Record answer on server
      await recordAnswer(questionRow.id, isCorrect);
      questionRow.answered = 1;
      questionRow.correct = isCorrect ? 1 : 0;
      quizAttempted++;
      updateQuizCounter();

      // Disable all buttons
      optionBtns.forEach(b => {
        b.classList.add("disabled");
        if (b.dataset.answer === question.answer) {
          b.classList.add("correct");
        }
      });

      if (isCorrect) {
        quizCorrect++;
        btn.classList.add("correct");
        feedbackEl.innerHTML = `<span class="feedback-correct">✅ Correct! Element unlocked.</span>`;
        feedbackEl.style.display = "block";

        setTimeout(() => {
          unlockElement(elementCard);
          overlay.classList.add("closing");
          setTimeout(() => overlay.remove(), 200);
        }, 1200);
      } else {
        quizWrong++;
        btn.classList.add("wrong");
        feedbackEl.innerHTML = `<span class="feedback-wrong">❌ Wrong! This element is now permanently locked.</span>`;
        feedbackEl.style.display = "block";

        lockElementPermanently(elementCard);

        setTimeout(() => {
          overlay.classList.add("closing");
          setTimeout(() => overlay.remove(), 200);
        }, 2000);
      }
    });
  });
}

/* =========================
   PUZZLE POPUP (3x3 or 5x5)
========================= */
function showPuzzlePopup(overlay, questionRow, item, elementCard) {
  const gridSize = questionRow.grid_size;
  const puzzleImage = questionRow.puzzle_image;

  overlay.innerHTML = `
    <div class="quiz-popup puzzle-popup">
      <div class="quiz-popup-header">
        <span class="quiz-popup-icon">🧩</span>
        <h3>Puzzle: Unlock ${formatName(item.src)}</h3>
      </div>
      <div class="quiz-popup-body">
        <div class="quiz-question-badge">${gridSize}×${gridSize} PUZZLE</div>
        <p class="quiz-question-text">Rearrange the tiles to complete the image. Click two tiles to swap them.</p>
        <div class="puzzle-container" id="puzzle-container" style="--grid-size: ${gridSize};"></div>
        <div class="puzzle-actions">
          <button class="security-btn" id="puzzle-check-btn" style="background:var(--primary);">Check Solution</button>
        </div>
        <div class="quiz-feedback" style="display:none;"></div>
      </div>
    </div>
  `;

  const container = overlay.querySelector("#puzzle-container");
  const feedbackEl = overlay.querySelector(".quiz-feedback");

  // Load image, slice it, shuffle
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const tileW = Math.floor(img.width / gridSize);
    const tileH = Math.floor(img.height / gridSize);
    const pieces = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const canvas = document.createElement("canvas");
        canvas.width = tileW;
        canvas.height = tileH;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, col * tileW, row * tileH, tileW, tileH, 0, 0, tileW, tileH);

        pieces.push({
          correctIndex: row * gridSize + col,
          dataUrl: canvas.toDataURL()
        });
      }
    }

    // Shuffle pieces
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Render tiles
    let selectedTile = null;
    shuffled.forEach((piece, idx) => {
      const tile = document.createElement("div");
      tile.className = "puzzle-tile";
      tile.dataset.currentIndex = idx;
      tile.dataset.correctIndex = piece.correctIndex;
      tile.innerHTML = `<img src="${piece.dataUrl}" draggable="false" />`;

      tile.addEventListener("click", () => {
        if (overlay.dataset.answered) return;

        if (selectedTile === null) {
          selectedTile = tile;
          tile.classList.add("puzzle-tile-selected");
        } else if (selectedTile === tile) {
          selectedTile = null;
          tile.classList.remove("puzzle-tile-selected");
        } else {
          // Swap
          const tempHTML = tile.innerHTML;
          const tempCorrect = tile.dataset.correctIndex;
          tile.innerHTML = selectedTile.innerHTML;
          tile.dataset.correctIndex = selectedTile.dataset.correctIndex;
          selectedTile.innerHTML = tempHTML;
          selectedTile.dataset.correctIndex = tempCorrect;

          selectedTile.classList.remove("puzzle-tile-selected");
          selectedTile = null;
        }
      });

      container.appendChild(tile);
    });

    // Check solution
    overlay.querySelector("#puzzle-check-btn").addEventListener("click", async () => {
      if (overlay.dataset.answered) return;

      const tiles = container.querySelectorAll(".puzzle-tile");
      let correct = true;
      tiles.forEach((tile, idx) => {
        if (parseInt(tile.dataset.correctIndex) !== idx) {
          correct = false;
        }
      });

      overlay.dataset.answered = "true";
      await recordAnswer(questionRow.id, correct);
      questionRow.answered = 1;
      questionRow.correct = correct ? 1 : 0;
      quizAttempted++;
      updateQuizCounter();

      if (correct) {
        quizCorrect++;
        feedbackEl.innerHTML = `<span class="feedback-correct">✅ Puzzle solved! Element unlocked.</span>`;
        feedbackEl.style.display = "block";

        setTimeout(() => {
          unlockElement(elementCard);
          overlay.classList.add("closing");
          setTimeout(() => overlay.remove(), 200);
        }, 1200);
      } else {
        quizWrong++;
        feedbackEl.innerHTML = `<span class="feedback-wrong">❌ Incorrect arrangement! Element permanently locked.</span>`;
        feedbackEl.style.display = "block";

        lockElementPermanently(elementCard);

        setTimeout(() => {
          overlay.classList.add("closing");
          setTimeout(() => overlay.remove(), 200);
        }, 2000);
      }
    });
  };

  img.src = puzzleImage;
}

/* =========================
   HELPER: UNLOCK / LOCK / RECORD
========================= */
function unlockElement(elementCard) {
  elementCard.classList.remove("locked");
  elementCard.draggable = true;
  elementCard.dataset.locked = "false";
  const lockOverlay = elementCard.querySelector(".lock-overlay");
  if (lockOverlay) lockOverlay.remove();
  const newCard = elementCard.cloneNode(true);
  elementCard.parentNode.replaceChild(newCard, elementCard);
}

function lockElementPermanently(elementCard) {
  elementCard.classList.add("failed");
  elementCard.style.opacity = "0.4";
  elementCard.style.pointerEvents = "none";
}

async function recordAnswer(questionRowId, isCorrect) {
  const teamId = localStorage.getItem("team_id");
  try {
    await fetch("/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team_id: teamId, question_row_id: questionRowId, is_correct: isCorrect })
    });
  } catch (err) {
    console.error("Failed to record answer", err);
  }
}


/* =========================
   CANVAS DRAG & DROP
========================= */

let selectedElement = null;

function updateProgress() {
  const dropZone = document.getElementById("drop-zone");
  const wrappers = dropZone.querySelectorAll(".canvas-el-wrapper");
  const countEl = document.getElementById("placed-count");
  const fillEl = document.getElementById("progress-fill");

  const MAX_ELEMENTS = 15;

  // Count unique element sources (not total wrappers)
  const uniqueSrcs = new Set();
  wrappers.forEach(w => {
    const img = w.querySelector("img");
    if (img && img.src) {
      // Normalize: strip origin to get relative path
      const rel = img.src.replace(window.location.origin, "");
      uniqueSrcs.add(rel);
    }
  });
  const count = uniqueSrcs.size;

  if (countEl) countEl.textContent = count;
  if (fillEl) {
    const pct = Math.min(100, Math.round((count / MAX_ELEMENTS) * 100));
    fillEl.style.width = pct + "%";
  }

  // Show/hide hint
  if (wrappers.length > 0) {
    dropZone.classList.add("has-elements");
  } else {
    dropZone.classList.remove("has-elements");
  }
}

/* =========================
   Z-INDEX / LAYER CONTROLS
========================= */
let nextZIndex = 10;

function bringToFront(wrapper) {
  nextZIndex++;
  wrapper.style.zIndex = nextZIndex;
}

function sendToBack(wrapper) {
  // Set to 1, push everything else up
  wrapper.style.zIndex = 1;
}

function bringForward(wrapper) {
  const cur = parseInt(wrapper.style.zIndex) || 1;
  wrapper.style.zIndex = cur + 1;
  nextZIndex = Math.max(nextZIndex, cur + 1);
}

function sendBackward(wrapper) {
  const cur = parseInt(wrapper.style.zIndex) || 1;
  wrapper.style.zIndex = Math.max(1, cur - 1);
}

function selectElement(wrapper) {
  // Deselect all
  document.querySelectorAll(".canvas-el-wrapper.selected").forEach(el => {
    el.classList.remove("selected");
  });

  // Remove existing layer toolbar
  const existingToolbar = document.getElementById("layer-toolbar");
  if (existingToolbar) existingToolbar.remove();

  // Select this one
  if (wrapper) {
    wrapper.classList.add("selected");
    selectedElement = wrapper;
    showLayerToolbar(wrapper);
  } else {
    selectedElement = null;
  }
}

function showLayerToolbar(wrapper) {
  const existing = document.getElementById("layer-toolbar");
  if (existing) existing.remove();

  // Inject styles once
  if (!document.getElementById("layer-toolbar-styles")) {
    const style = document.createElement("style");
    style.id = "layer-toolbar-styles";
    style.textContent = `
      #layer-toolbar {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        background: rgba(20, 16, 40, 0.95);
        backdrop-filter: blur(12px);
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid rgba(124,108,255,0.3);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 99999;
        animation: fadeUp 0.2s ease-out;
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      .layer-btn {
        background: rgba(124,108,255,0.15);
        border: 1px solid rgba(124,108,255,0.25);
        color: #c4b8ff;
        font-size: 12px;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
        font-family: 'Inter', sans-serif;
      }
      .layer-btn:hover {
        background: rgba(124,108,255,0.35);
        color: #fff;
        border-color: rgba(124,108,255,0.5);
      }
    `;
    document.head.appendChild(style);
  }

  const toolbar = document.createElement("div");
  toolbar.id = "layer-toolbar";
  toolbar.innerHTML = `
    <button class="layer-btn" data-action="back" title="Send to Back">⬇⬇ Back</button>
    <button class="layer-btn" data-action="backward" title="Send Backward">⬇ Backward</button>
    <button class="layer-btn" data-action="forward" title="Bring Forward">⬆ Forward</button>
    <button class="layer-btn" data-action="front" title="Bring to Front">⬆⬆ Front</button>
  `;

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest(".layer-btn");
    if (!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;
    if (action === "front")    bringToFront(wrapper);
    if (action === "forward")  bringForward(wrapper);
    if (action === "backward") sendBackward(wrapper);
    if (action === "back")     sendToBack(wrapper);
  });

  document.body.appendChild(toolbar);
}

function createCanvasElement(src, x, y) {
  const dropZone = document.getElementById("drop-zone");

  const wrapper = document.createElement("div");
  wrapper.className = "canvas-el-wrapper";
  wrapper.style.left = x + "px";
  wrapper.style.top = y + "px";
  wrapper.style.width = "120px";
  wrapper.style.height = "80px";

  const img = document.createElement("img");
  img.src = src;
  img.draggable = false;

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.className = "canvas-el-delete";
  delBtn.innerHTML = "×";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.remove();
    if (selectedElement === wrapper) selectedElement = null;
    updateProgress();
  });

  // Resize handles — 4 corners + 4 edges for free stretch
  const handles = ["tl", "tr", "bl", "br", "t", "r", "b", "l"];
  handles.forEach(pos => {
    const handle = document.createElement("div");
    handle.className = `resize-handle ${pos}`;
    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      initResize(wrapper, pos, e);
    });
    wrapper.appendChild(handle);
  });

  wrapper.appendChild(img);
  wrapper.appendChild(delBtn);

  // Click to select
  wrapper.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resize-handle")) return;
    e.stopPropagation();
    selectElement(wrapper);
    initMove(wrapper, e);
  });

  dropZone.appendChild(wrapper);
  selectElement(wrapper);
  updateProgress();
}

function initCanvasDragDrop() {
  const dropZone = document.getElementById("drop-zone");

  // Drag start from sidebar — only free elements
  document.addEventListener("dragstart", e => {
    const el = e.target.closest(".element");
    if (el && el.dataset.locked !== "true") {
      const src = el.dataset.src;
      e.dataTransfer.setData("text/plain", src);
      e.dataTransfer.effectAllowed = "copy";
    } else if (el && el.dataset.locked === "true") {
      e.preventDefault();
    }
  });

  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove("dragover");
    }
  });

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const src = e.dataTransfer.getData("text/plain");
    if (!src) return;

    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left - 60;
    const y = e.clientY - rect.top - 40;

    createCanvasElement(src, Math.max(0, x), Math.max(0, y));
  });
}

/* =========================
   MOVE ELEMENTS ON CANVAS
========================= */
function initMove(wrapper, startEvent) {
  const dropZone = document.getElementById("drop-zone");
  const rect = dropZone.getBoundingClientRect();

  const startX = startEvent.clientX;
  const startY = startEvent.clientY;
  const origLeft = parseInt(wrapper.style.left) || 0;
  const origTop = parseInt(wrapper.style.top)  || 0;

  function onMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newLeft = origLeft + dx;
    let newTop  = origTop + dy;

    // Clamp to drop zone bounds
    const maxLeft = rect.width - wrapper.offsetWidth;
    const maxTop  = rect.height - wrapper.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop  = Math.max(0, Math.min(newTop, maxTop));

    wrapper.style.left = newLeft + "px";
    wrapper.style.top  = newTop + "px";
  }

  function onUp() {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

/* =========================
   RESIZE (FREE STRETCH)
   — corners + edges, NO aspect-ratio lock
========================= */
function initResize(wrapper, handlePos, startEvent) {
  const startX = startEvent.clientX;
  const startY = startEvent.clientY;
  const startW = wrapper.offsetWidth;
  const startH = wrapper.offsetHeight;
  const startLeft = parseInt(wrapper.style.left) || 0;
  const startTop  = parseInt(wrapper.style.top)  || 0;

  const MIN_SIZE = 30;

  function onMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newW = startW;
    let newH = startH;
    let newLeft = startLeft;
    let newTop = startTop;

    // Horizontal component
    if (handlePos.includes("r")) {
      newW = Math.max(MIN_SIZE, startW + dx);
    } else if (handlePos.includes("l")) {
      newW = Math.max(MIN_SIZE, startW - dx);
      newLeft = startLeft + (startW - newW);
    }

    // Vertical component
    if (handlePos.includes("b")) {
      newH = Math.max(MIN_SIZE, startH + dy);
    } else if (handlePos.includes("t")) {
      newH = Math.max(MIN_SIZE, startH - dy);
      newTop = startTop + (startH - newH);
    }

    wrapper.style.width  = newW + "px";
    wrapper.style.height = newH + "px";
    wrapper.style.left   = newLeft + "px";
    wrapper.style.top    = newTop + "px";
  }

  function onUp() {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

/* =========================
   CANVAS INTERACTION
========================= */
function initCanvasInteraction() {
  const dropZone = document.getElementById("drop-zone");

  // Click empty canvas → deselect all
  dropZone.addEventListener("mousedown", (e) => {
    if (e.target === dropZone || e.target.closest(".drop-zone-hint")) {
      selectElement(null);
    }
  });

  // Delete key removes selected element
  document.addEventListener("keydown", (e) => {
    if (e.key === "Delete" && selectedElement) {
      selectedElement.remove();
      selectedElement = null;
      const tb = document.getElementById("layer-toolbar");
      if (tb) tb.remove();
      updateProgress();
    }
  });
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.clear();
  window.location.href = "/Auth/login.html";
}

document.getElementById("logout-btn")?.addEventListener("click", logout);

/* =========================
   SECURITY (RIGHT-CLICK + COPY) — ANTI-CHEAT WITH 3 STRIKES
========================= */
function initSecurity() {
  // Helper: report cheat to server
  async function reportCheat(violationType) {
    const teamId = localStorage.getItem("team_id");
    if (!teamId) return;

    try {
      const res = await fetch("/cheat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId })
      });
      const data = await res.json();

      if (data.is_blocked) {
        showSecurityWarning(
          "🚫 ACCOUNT BLOCKED",
          `You have been blocked for repeated violations (${data.cheat_count} strikes). Your work will be auto-submitted.`,
          () => { submitDesign(true); }
        );
      } else {
        const remaining = 3 - data.cheat_count;
        showSecurityWarning(
          `⚠️ Strike ${data.cheat_count} / 3`,
          `${violationType} is not allowed! You have ${remaining} chance${remaining !== 1 ? 's' : ''} remaining before your account is blocked.`
        );
      }
    } catch (err) {
      console.error("Cheat report failed", err);
    }
  }

  // 1. Right Click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    reportCheat("Right-clicking");
  });

  // 2. Prevent Copy/Cut
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    reportCheat("Copying content");
  });

  document.addEventListener("cut", (e) => {
    e.preventDefault();
    reportCheat("Cutting content");
  });

  // 3. Prevent Dragging text/images out
  document.addEventListener("dragstart", (e) => {
    if (e.target.nodeName === "IMG" && !e.target.closest(".element")) {
      e.preventDefault();
    }
  });
}

/* =========================
   SUBMISSION
========================= */
async function submitDesign(isForced = false) {
  const teamId = localStorage.getItem("team_id");
  const teamName = localStorage.getItem("team_name");
  const startTime = parseInt(localStorage.getItem("start_time"));
  if (!teamId) return;

  const now = Date.now();
  const timeTakenSeconds = Math.floor((now - startTime) / 1000);

  const dropZone = document.getElementById("drop-zone");
  const canvasElements = dropZone.querySelectorAll(".canvas-el-wrapper");
  const dropRect = dropZone.getBoundingClientRect();

  const canvas_elements = Array.from(canvasElements).map(el => ({
    element_src: el.querySelector("img").src.replace(window.location.origin, ""),
    x_coordinate: parseInt(el.style.left) || 0,
    y_coordinate: parseInt(el.style.top) || 0,
    width: parseInt(el.style.width) || el.offsetWidth || 120,
    height: parseInt(el.style.height) || el.offsetHeight || 80
  }));

  const payload = {
    team_id: teamId,
    team_name: teamName,
    submission_timestamp: now,
    submitted: true,
    time_taken_seconds: timeTakenSeconds,
    canvas_width: dropRect.width,
    canvas_height: dropRect.height,
    quiz: {
      total_attempted: quizAttempted,
      total_correct: quizCorrect
    },
    canvas_elements: canvas_elements
  };

  try {
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      // Lock the entire interface
      lockInterface();

      if (!isForced) {
        showSecurityWarning(
          "✅ SUBMISSION SUCCESSFUL",
          `Your design has been submitted! Time taken: ${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s. Quiz: ${quizCorrect}/${quizAttempted} correct. Thank you for participating!`,
          () => { logout(); }
        );
      } else {
        logout();
      }
    } else {
      const data = await res.json();
      showSecurityWarning("SUBMISSION ERROR", data.message || "Failed to submit design. Please contact staff.", () => {
        if (isForced) logout();
      });
    }
  } catch (err) {
    console.error("Submission error", err);
    if (isForced) logout();
  }
}

/* =========================
   POST-SUBMISSION LOCKDOWN
========================= */
function lockInterface() {
  // Disable drag and drop
  const elements = document.querySelectorAll(".element");
  elements.forEach(el => {
    el.draggable = false;
    el.style.pointerEvents = "none";
  });

  // Disable canvas interaction
  const dropZone = document.getElementById("drop-zone");
  if (dropZone) {
    dropZone.style.pointerEvents = "none";
  }

  // Disable submit button
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.pointerEvents = "none";
  }

  // Disable sidebar panels
  const panels = document.querySelectorAll(".panel-body");
  panels.forEach(p => { p.style.pointerEvents = "none"; p.style.opacity = "0.5"; });
}

/* =========================
   SUBMIT BUTTON WITH CUSTOM CONFIRM
========================= */
document.getElementById("submit-btn")?.addEventListener("click", () => {
  // Custom confirm dialog instead of browser confirm()
  const existing = document.getElementById("security-warning-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "security-modal";
  modal.id = "security-warning-modal";
  modal.innerHTML = `
    <div class="security-icon">
      <i class="fa-solid fa-paper-plane"></i>
    </div>
    <h3>Confirm Submission</h3>
    <p>Are you sure you want to submit your design? You will not be able to edit it afterwards.</p>
    <div style="display:flex; gap:12px; margin-top:1rem;">
      <button class="security-btn" id="confirm-submit-yes" style="flex:1; background: linear-gradient(135deg, #7c6cff, #9b8cff);">Submit</button>
      <button class="security-btn" id="confirm-submit-no" style="flex:1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("active"), 10);

  modal.querySelector("#confirm-submit-yes").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 300);
    submitDesign();
  });

  modal.querySelector("#confirm-submit-no").addEventListener("click", () => {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 300);
  });
});

