const quizGrid = document.getElementById('quiz-grid');
const statsBadge = document.getElementById('stats-badge');

function loadQuiz() {
    try {
        console.log('Loading quiz data from data.js...');
        if (typeof QUIZ_DATA === 'undefined') {
            throw new Error('QUIZ_DATA not found. Make sure data.js is loaded.');
        }
        renderQuiz(QUIZ_DATA);
    } catch (error) {
        console.error('Error:', error);
        quizGrid.innerHTML = `
            <div class="loader">
                <p>Error loading quiz data!</p>
                <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.7;">${error.message}</p>
                <p style="font-size: 0.8rem; margin-top: 20px; color: var(--accent-blue);">Make sure data.js is included in index.html before main.js.</p>
            </div>`;
    }
}

function renderQuiz(data) {
    const questions = data.questions || [];
    statsBadge.textContent = `${questions.length} Questions Loaded`;
    quizGrid.innerHTML = '';

    if (questions.length === 0) {
        quizGrid.innerHTML = '<div class="loader">No questions found!</div>';
        return;
    }

    const fragment = document.createDocumentFragment();

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        
        const optionsHtml = q.options.map((opt, i) => {
            const label = String.fromCharCode(65 + i);
            const isCorrect = opt === q.answer;
            return `
                <div class="option ${isCorrect ? 'correct' : ''}">
                    <span class="option-label">${label}</span>
                    <span>${escapeHtml(opt)}</span>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="card-header">
                <span class="q-number">Question #${index + 1}</span>
                ${q.level ? `<span class="level-badge level-${q.level.toLowerCase()}">${q.level}</span>` : ''}
            </div>
            <h2 class="question-text">${escapeHtml(q.question)}</h2>
            <div class="options-list">
                ${optionsHtml}
            </div>
        `;
        fragment.appendChild(card);
    });

    quizGrid.appendChild(fragment);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initial load
document.addEventListener('DOMContentLoaded', loadQuiz);
