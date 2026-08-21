// IT Quiz Master - Complete Script

// State Management
const state = {
  quizData: null,
  selectedCategories: new Set(),
  currentQuestions: [],
  currentQuestionIndex: 0,
  answers: [],
  score: { correct: 0, wrong: 0, skipped: 0 },
  timer: null,
  timeLeft: 15,
  totalTime: 15
};

// DOM Elements
const el = {
  // Screens
  screenHome: document.getElementById('screen-home'),
  screenCategory: document.getElementById('screen-category'),
  screenQuiz: document.getElementById('screen-quiz'),
  screenResult: document.getElementById('screen-result'),

  // Home Screen
  startHomeBtn: document.getElementById('start-home-btn'),

  // Category Screen
  backToHome: document.getElementById('back-to-home'),
  categoryList: document.getElementById('category-list'),
  selectedCount: document.getElementById('selected-count'),
  totalCategories: document.getElementById('total-categories'),
  startQuizBtn: document.getElementById('start-quiz-btn'),

  // Quiz Screen
  progressFill: document.getElementById('progress-fill'),
  currentQuestion: document.getElementById('current-question'),
  totalQuestions: document.getElementById('total-questions'),
  timer: document.getElementById('timer'),
  timerRingProgress: document.getElementById('timer-ring-progress'),
  timerText: document.getElementById('timer-text'),
  badgeIcon: document.getElementById('badge-icon'),
  badgeText: document.getElementById('badge-text'),
  questionText: document.getElementById('question-text'),
  answersGrid: document.getElementById('answers-grid'),
  explanationBox: document.getElementById('explanation-box'),
  explanationText: document.getElementById('explanation-text'),
  nextBtn: document.getElementById('next-btn'),

  // Result Screen
  resultIcon: document.getElementById('result-icon'),
  resultTitle: document.getElementById('result-title'),
  resultSubtitle: document.getElementById('result-subtitle'),
  scoreNumber: document.getElementById('score-number'),
  scoreRingProgress: document.getElementById('score-ring-progress'),
  correctCount: document.getElementById('correct-count'),
  wrongCount: document.getElementById('wrong-count'),
  skippedCount: document.getElementById('skipped-count'),
  subjectBreakdown: document.getElementById('subject-breakdown'),
  playAgainBtn: document.getElementById('play-again-btn'),
  homeBtn: document.getElementById('home-btn')
};

// Utility Functions
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Load Quiz Data
async function loadQuizData() {
  try {
    const response = await fetch('data/quizData.json');
    state.quizData = await response.json();
    el.totalCategories.textContent = state.quizData.categories.length;
    renderCategories();
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

// Render Categories
function renderCategories() {
  el.categoryList.innerHTML = '';
  state.quizData.categories.forEach(category => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.id = category.id;
    card.innerHTML = `
      <div class="category-icon" style="background: ${category.color}20">
        <span>${category.icon}</span>
      </div>
      <div class="category-info">
        <div class="category-name">${category.name}</div>
        <div class="category-desc">${category.description}</div>
      </div>
      <div class="category-check"></div>
    `;
    card.addEventListener('click', () => toggleCategory(category.id, card));
    el.categoryList.appendChild(card);
  });
}

// Toggle Category
function toggleCategory(categoryId, card) {
  if (state.selectedCategories.has(categoryId)) {
    state.selectedCategories.delete(categoryId);
    card.classList.remove('selected');
  } else {
    state.selectedCategories.add(categoryId);
    card.classList.add('selected');
  }
  updateSelectedCount();
}

// Update Selected Count
function updateSelectedCount() {
  el.selectedCount.textContent = state.selectedCategories.size;
  el.startQuizBtn.disabled = state.selectedCategories.size === 0;
}

// Screen Management
function showScreen(screenName) {
  el.screenHome.classList.remove('active');
  el.screenCategory.classList.remove('active');
  el.screenQuiz.classList.remove('active');
  el.screenResult.classList.remove('active');

  switch (screenName) {
    case 'home':
      el.screenHome.classList.add('active');
      break;
    case 'category':
      el.screenCategory.classList.add('active');
      break;
    case 'quiz':
      el.screenQuiz.classList.add('active');
      break;
    case 'result':
      el.screenResult.classList.add('active');
      break;
  }
}

// Select Random Questions
function selectRandomQuestions() {
  const allQuestions = state.quizData.questions.filter(q =>
    state.selectedCategories.has(q.category)
  );
  const shuffled = shuffleArray(allQuestions);
  state.currentQuestions = shuffled.slice(0, state.quizData.questionsPerQuiz).map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));
}

// Initialize Quiz
function initQuiz() {
  selectRandomQuestions();
  state.currentQuestionIndex = 0;
  state.answers = [];
  state.score = { correct: 0, wrong: 0, skipped: 0 };
  el.totalQuestions.textContent = state.currentQuestions.length;
  showScreen('quiz');
  renderQuestion();
}

// Render Question
function renderQuestion() {
  const question = state.currentQuestions[state.currentQuestionIndex];
  const category = state.quizData.categories.find(c => c.id === question.category);

  // Update progress
  el.currentQuestion.textContent = state.currentQuestionIndex + 1;
  const progress = ((state.currentQuestionIndex) / state.currentQuestions.length) * 100;
  el.progressFill.style.width = `${progress}%`;

  // Update category badge
  el.badgeIcon.textContent = category.icon;
  el.badgeText.textContent = category.name;

  // Update question
  el.questionText.textContent = question.question;

  // Update answers
  const answerBtns = el.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach((btn, index) => {
    const option = question.options[index];
    btn.dataset.option = index;
    btn.querySelector('.answer-text').textContent = option.text;
    btn.classList.remove('selected', 'correct', 'incorrect');
    btn.disabled = false;
  });

  // Hide explanation
  el.explanationBox.classList.remove('show');

  // Update next button
  if (state.currentQuestionIndex === state.currentQuestions.length - 1) {
    el.nextBtn.textContent = 'Finish Quiz';
  } else {
    el.nextBtn.textContent = 'Next Question';
  }
  el.nextBtn.disabled = true;

  // Start timer
  startTimer();
}

// Handle Answer Selection
function handleAnswer(optionIndex) {
  const question = state.currentQuestions[state.currentQuestionIndex];
  const selectedOption = question.options[optionIndex];
  const correctOption = question.options.find(o => o.isCorrect);

  // Store answer
  state.answers[state.currentQuestionIndex] = optionIndex;

  // Update button states
  const answerBtns = el.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach((btn, index) => {
    btn.disabled = true;
    if (index === optionIndex) {
      if (selectedOption.isCorrect) {
        btn.classList.add('correct');
        state.score.correct++;
      } else {
        btn.classList.add('incorrect');
        state.score.wrong++;
      }
    } else if (question.options[index].isCorrect) {
      btn.classList.add('correct');
    }
  });

  // Show explanation
  el.explanationText.textContent = question.explanation;
  el.explanationBox.classList.add('show');

  // Enable next button
  el.nextBtn.disabled = false;

  // Stop timer
  stopTimer();
}

// Timer Functions
function startTimer() {
  state.timeLeft = state.totalTime;
  updateTimerDisplay();

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  el.timerText.textContent = state.timeLeft;
  const progress = (state.timeLeft / state.totalTime) * 100;
  el.timerRingProgress.style.strokeDashoffset = 100 - progress;

  el.timer.classList.remove('warning', 'danger');
  if (state.timeLeft <= 5) {
    el.timer.classList.add('danger');
  } else if (state.timeLeft <= 10) {
    el.timer.classList.add('warning');
  }
}

function stopTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function handleTimeout() {
  const question = state.currentQuestions[state.currentQuestionIndex];

  // Mark as skipped
  state.answers[state.currentQuestionIndex] = -1;
  state.score.skipped++;

  // Show correct answer
  const answerBtns = el.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach((btn, index) => {
    btn.disabled = true;
    if (question.options[index].isCorrect) {
      btn.classList.add('correct');
    }
  });

  // Show explanation
  el.explanationText.textContent = `Time's up! ${question.explanation}`;
  el.explanationBox.classList.add('show');

  // Enable next button
  el.nextBtn.disabled = false;
}

// Next Question
function nextQuestion() {
  if (state.currentQuestionIndex < state.currentQuestions.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion();
  } else {
    showResults();
  }
}

// Show Results
function showResults() {
  stopTimer();

  const total = state.currentQuestions.length;
  const percentage = Math.round((state.score.correct / total) * 100);

  // Update result header
  if (percentage >= 80) {
    el.resultIcon.textContent = '🎉';
    el.resultTitle.textContent = 'Excellent!';
    el.resultSubtitle.textContent = 'You really know your IT stuff!';
  } else if (percentage >= 60) {
    el.resultIcon.textContent = '👍';
    el.resultTitle.textContent = 'Good Job!';
    el.resultSubtitle.textContent = 'Keep learning and improving!';
  } else if (percentage >= 40) {
    el.resultIcon.textContent = '📚';
    el.resultTitle.textContent = 'Keep Learning!';
    el.resultSubtitle.textContent = 'Practice makes perfect!';
  } else {
    el.resultIcon.textContent = '💪';
    el.resultTitle.textContent = 'Try Again!';
    el.resultSubtitle.textContent = 'Review the topics and come back stronger!';
  }

  // Update score
  el.scoreNumber.textContent = percentage;
  el.scoreRingProgress.style.strokeDashoffset = 283 - (percentage * 2.83);

  // Update stats
  el.correctCount.textContent = state.score.correct;
  el.wrongCount.textContent = state.score.wrong;
  el.skippedCount.textContent = state.score.skipped;

  // Update subject breakdown
  renderSubjectBreakdown();

  showScreen('result');
}

// Render Subject Breakdown
function renderSubjectBreakdown() {
  el.subjectBreakdown.innerHTML = '';

  const categoryScores = {};
  state.currentQuestions.forEach((q, index) => {
    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { correct: 0, total: 0 };
    }
    categoryScores[q.category].total++;
    if (state.answers[index] !== -1 && state.answers[index] !== undefined) {
      if (q.options[state.answers[index]].isCorrect) {
        categoryScores[q.category].correct++;
      }
    }
  });

  Object.entries(categoryScores).forEach(([catId, scores]) => {
    const category = state.quizData.categories.find(c => c.id === catId);
    const percentage = Math.round((scores.correct / scores.total) * 100);

    const item = document.createElement('div');
    item.className = 'subject-item';
    item.innerHTML = `
      <div class="subject-icon">${category.icon}</div>
      <div class="subject-info">
        <div class="subject-name">${category.name}</div>
        <div class="subject-score">${scores.correct}/${scores.total} correct</div>
      </div>
      <div class="subject-bar">
        <div class="subject-bar-fill" style="width: ${percentage}%"></div>
      </div>
    `;
    el.subjectBreakdown.appendChild(item);
  });
}

// Reset to Home
function resetToHome() {
  state.selectedCategories.clear();
  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.remove('selected');
  });
  updateSelectedCount();
  showScreen('home');
}

// Event Listeners
function initEventListeners() {
  // Home Screen
  el.startHomeBtn.addEventListener('click', () => showScreen('category'));

  // Category Screen
  el.backToHome.addEventListener('click', resetToHome);
  el.startQuizBtn.addEventListener('click', initQuiz);

  // Quiz Screen
  el.answersGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (btn && !btn.disabled) {
      handleAnswer(parseInt(btn.dataset.option));
    }
  });

  el.nextBtn.addEventListener('click', nextQuestion);

  // Result Screen
  el.playAgainBtn.addEventListener('click', () => showScreen('category'));
  el.homeBtn.addEventListener('click', resetToHome);
}

// Initialize App
function init() {
  loadQuizData();
  initEventListeners();
}

init();
