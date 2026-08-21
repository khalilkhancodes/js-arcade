// Quiz Master - Script
// Cognitive Clarity Design System

// State Management
const state = {
  quizData: null,
  currentScreen: 'start',
  selectedCategories: new Set(),
  currentQuestions: [],
  currentQuestionIndex: 0,
  answers: {},
  score: { correct: 0, incorrect: 0, skipped: 0 },
  timer: null,
  timeLeft: 15,
  questionsPerQuiz: 10
};

// DOM Elements
const elements = {
  // Screens
  screenStart: document.getElementById('screen-start'),
  screenQuestion: document.getElementById('screen-question'),
  screenResults: document.getElementById('screen-results'),
  screenSummary: document.getElementById('screen-summary'),

  // Start Screen
  categoryGrid: document.getElementById('category-grid'),
  questionCount: document.getElementById('question-count'),
  totalCategories: document.getElementById('total-categories'),
  selectedCount: document.getElementById('selected-count'),
  startBtn: document.getElementById('start-btn'),

  // Question Screen
  questionNumber: document.getElementById('question-number'),
  totalQuestions: document.getElementById('total-questions'),
  timer: document.getElementById('timer'),
  timerBar: document.getElementById('timer-bar'),
  timerText: document.getElementById('timer-text'),
  questionCategory: document.getElementById('question-category'),
  questionText: document.getElementById('question-text'),
  answersGrid: document.getElementById('answers-grid'),
  explanation: document.getElementById('explanation'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  submitBtn: document.getElementById('submit-btn'),

  // Results Screen
  resultsIcon: document.getElementById('results-icon'),
  resultsTitle: document.getElementById('results-title'),
  scorePercentage: document.getElementById('score-percentage'),
  correctCount: document.getElementById('correct-count'),
  incorrectCount: document.getElementById('incorrect-count'),
  skippedCount: document.getElementById('skipped-count'),
  performanceFill: document.getElementById('performance-fill'),
  categoryBreakdown: document.getElementById('category-breakdown'),
  summaryBtn: document.getElementById('summary-btn'),
  restartBtn: document.getElementById('restart-btn'),

  // Summary Screen
  summarySubtitle: document.getElementById('summary-subtitle'),
  summaryList: document.getElementById('summary-list'),
  shareBtn: document.getElementById('share-btn'),
  playAgainBtn: document.getElementById('play-again-btn')
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

function shuffleOptions(options) {
  const shuffled = [...options];
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
    initializeCategories();
  } catch (error) {
    console.error('Error loading quiz data:', error);
  }
}

// Initialize Categories
function initializeCategories() {
  elements.categoryGrid.innerHTML = '';
  state.quizData.categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-btn selected';
    button.dataset.categoryId = category.id;
    button.innerHTML = `
      <span class="category-icon">${category.icon}</span>
      <span class="category-name">${category.name}</span>
      <span class="category-check"></span>
    `;
    button.addEventListener('click', () => toggleCategory(category.id, button));
    elements.categoryGrid.appendChild(button);
  });

  elements.totalCategories.textContent = state.quizData.categories.length;
  state.selectedCategories = new Set(state.quizData.categories.map(c => c.id));
  updateSelectedCount();
}

// Toggle Category Selection
function toggleCategory(categoryId, button) {
  if (state.selectedCategories.has(categoryId)) {
    state.selectedCategories.delete(categoryId);
    button.classList.remove('selected');
  } else {
    state.selectedCategories.add(categoryId);
    button.classList.add('selected');
  }
  updateSelectedCount();
}

// Update Selected Count
function updateSelectedCount() {
  elements.selectedCount.textContent = state.selectedCategories.size;
  elements.startBtn.disabled = state.selectedCategories.size === 0;
}

// Select Random Questions
function selectRandomQuestions() {
  const allQuestions = state.quizData.questions.filter(q =>
    state.selectedCategories.has(q.category)
  );
  const shuffled = shuffleArray(allQuestions);
  state.currentQuestions = shuffled.slice(0, state.questionsPerQuiz);

  // Shuffle options for each question
  state.currentQuestions = state.currentQuestions.map(q => ({
    ...q,
    options: shuffleOptions(q.options)
  }));
}

// Screen Management
function showScreen(screenName) {
  state.currentScreen = screenName;

  // Hide all screens
  elements.screenStart.classList.remove('active');
  elements.screenQuestion.classList.remove('active');
  elements.screenResults.classList.remove('active');
  elements.screenSummary.classList.remove('active');

  // Show target screen
  switch (screenName) {
    case 'start':
      elements.screenStart.classList.add('active');
      break;
    case 'question':
      elements.screenQuestion.classList.add('active');
      break;
    case 'results':
      elements.screenResults.classList.add('active');
      break;
    case 'summary':
      elements.screenSummary.classList.add('active');
      break;
  }
}

// Initialize Quiz
function initializeQuiz() {
  selectRandomQuestions();
  state.currentQuestionIndex = 0;
  state.answers = {};
  state.score = { correct: 0, incorrect: 0, skipped: 0 };
  elements.totalQuestions.textContent = state.currentQuestions.length;
  showScreen('question');
  renderQuestion();
}

// Render Question
function renderQuestion() {
  const question = state.currentQuestions[state.currentQuestionIndex];
  const category = state.quizData.categories.find(c => c.id === question.category);

  // Update header
  elements.questionNumber.textContent = state.currentQuestionIndex + 1;

  // Update category
  elements.questionCategory.textContent = category.name;
  elements.questionCategory.style.background = `${category.color}20`;
  elements.questionCategory.style.color = category.color;

  // Update question text
  elements.questionText.textContent = question.question;

  // Update answers
  const answerBtns = elements.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach((btn, index) => {
    const option = question.options[index];
    btn.dataset.option = option.id;
    btn.querySelector('.answer-text').textContent = option.text;
    btn.classList.remove('selected', 'correct', 'incorrect');
    btn.disabled = false;

    // Check if already answered
    if (state.answers[state.currentQuestionIndex]) {
      const selectedOption = state.answers[state.currentQuestionIndex];
      if (option.id === selectedOption) {
        btn.classList.add('selected');
        btn.disabled = true;
      }
    }
  });

  // Hide explanation
  elements.explanation.classList.remove('show');
  elements.explanation.textContent = '';

  // Update navigation
  elements.prevBtn.disabled = state.currentQuestionIndex === 0;

  if (state.currentQuestionIndex === state.currentQuestions.length - 1) {
    elements.nextBtn.style.display = 'none';
    elements.submitBtn.style.display = 'block';
  } else {
    elements.nextBtn.style.display = 'block';
    elements.submitBtn.style.display = 'none';
  }

  // Start timer
  startTimer();
}

// Handle Answer Selection
function handleAnswer(optionId) {
  const question = state.currentQuestions[state.currentQuestionIndex];
  const selectedOption = question.options.find(o => o.id === optionId);

  // Store answer
  state.answers[state.currentQuestionIndex] = optionId;

  // Update button states
  const answerBtns = elements.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    const option = question.options.find(o => o.id === btn.dataset.option);
    btn.classList.remove('selected', 'correct', 'incorrect');
    btn.disabled = true;

    if (btn.dataset.option === optionId) {
      btn.classList.add('selected');
      if (selectedOption.isCorrect) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('incorrect');
      }
    }
  });

  // Show correct answer if wrong
  if (!selectedOption.isCorrect) {
    const correctBtn = elements.answersGrid.querySelector(
      `[data-option="${question.options.find(o => o.isCorrect).id}"]`
    );
    correctBtn.classList.add('correct');
  }

  // Show explanation
  elements.explanation.textContent = question.explanation;
  elements.explanation.classList.add('show');

  // Stop timer
  stopTimer();
}

// Timer Functions
function startTimer() {
  state.timeLeft = 15;
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
  elements.timerText.textContent = state.timeLeft;
  const progress = (state.timeLeft / 15) * 100;
  elements.timerBar.style.strokeDashoffset = 100 - progress;

  // Update timer color
  elements.timer.classList.remove('warning', 'danger');
  if (state.timeLeft <= 5) {
    elements.timer.classList.add('danger');
  } else if (state.timeLeft <= 10) {
    elements.timer.classList.add('warning');
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
  const correctOption = question.options.find(o => o.isCorrect);

  // Mark as skipped
  state.answers[state.currentQuestionIndex] = 'timeout';

  // Show correct answer
  const answerBtns = elements.answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.option === correctOption.id) {
      btn.classList.add('correct');
    }
  });

  // Show explanation
  elements.explanation.textContent = `Time's up! ${question.explanation}`;
  elements.explanation.classList.add('show');
}

// Navigation
function goToNextQuestion() {
  if (state.currentQuestionIndex < state.currentQuestions.length - 1) {
    state.currentQuestionIndex++;
    renderQuestion();
  }
}

function goToPreviousQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    renderQuestion();
  }
}

// Calculate Score
function calculateScore() {
  state.score = { correct: 0, incorrect: 0, skipped: 0 };

  state.currentQuestions.forEach((question, index) => {
    const answer = state.answers[index];
    if (!answer || answer === 'timeout') {
      state.score.skipped++;
    } else {
      const selectedOption = question.options.find(o => o.id === answer);
      if (selectedOption.isCorrect) {
        state.score.correct++;
      } else {
        state.score.incorrect++;
      }
    }
  });
}

// Calculate Category Scores
function calculateCategoryScores() {
  const categoryScores = {};

  state.currentQuestions.forEach((question, index) => {
    if (!categoryScores[question.category]) {
      categoryScores[question.category] = { correct: 0, total: 0 };
    }
    categoryScores[question.category].total++;

    const answer = state.answers[index];
    if (answer && answer !== 'timeout') {
      const selectedOption = question.options.find(o => o.id === answer);
      if (selectedOption.isCorrect) {
        categoryScores[question.category].correct++;
      }
    }
  });

  return categoryScores;
}

// Show Results
function showResults() {
  calculateScore();
  const totalQuestions = state.currentQuestions.length;
  const percentage = Math.round((state.score.correct / totalQuestions) * 100);

  // Update results header
  if (percentage >= 80) {
    elements.resultsIcon.textContent = '🎉';
    elements.resultsTitle.textContent = 'Excellent!';
  } else if (percentage >= 60) {
    elements.resultsIcon.textContent = '👍';
    elements.resultsTitle.textContent = 'Good Job!';
  } else if (percentage >= 40) {
    elements.resultsIcon.textContent = '📚';
    elements.resultsTitle.textContent = 'Keep Learning!';
  } else {
    elements.resultsIcon.textContent = '💪';
    elements.resultsTitle.textContent = 'Try Again!';
  }

  // Update score display
  elements.scorePercentage.textContent = `${percentage}%`;
  elements.correctCount.textContent = state.score.correct;
  elements.incorrectCount.textContent = state.score.incorrect;
  elements.skippedCount.textContent = state.score.skipped;

  // Update performance bar
  elements.performanceFill.style.width = `${percentage}%`;

  // Update category breakdown
  const categoryScores = calculateCategoryScores();
  elements.categoryBreakdown.innerHTML = '';

  state.quizData.categories.forEach(category => {
    if (state.selectedCategories.has(category.id) && categoryScores[category.id]) {
      const score = categoryScores[category.id];
      const percentage = Math.round((score.correct / score.total) * 100);

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'category-result';
      categoryDiv.innerHTML = `
        <span class="category-result-icon">${category.icon}</span>
        <div class="category-result-info">
          <div class="category-result-name">${category.name}</div>
          <div class="category-result-score">${score.correct}/${score.total} correct</div>
        </div>
        <div class="category-result-bar">
          <div class="category-result-fill" style="width: ${percentage}%; background: ${category.color}"></div>
        </div>
      `;
      elements.categoryBreakdown.appendChild(categoryDiv);
    }
  });

  showScreen('results');
}

// Show Summary
function showSummary() {
  const totalQuestions = state.currentQuestions.length;
  const percentage = Math.round((state.score.correct / totalQuestions) * 100);
  elements.summarySubtitle.textContent = `You scored ${percentage}% (${state.score.correct}/${totalQuestions})`;

  elements.summaryList.innerHTML = '';

  state.currentQuestions.forEach((question, index) => {
    const answer = state.answers[index];
    const category = state.quizData.categories.find(c => c.id === question.category);
    const correctOption = question.options.find(o => o.isCorrect);
    let statusClass = 'skipped';
    let statusText = 'Skipped';

    if (answer && answer !== 'timeout') {
      const selectedOption = question.options.find(o => o.id === answer);
      if (selectedOption.isCorrect) {
        statusClass = 'correct';
        statusText = 'Correct';
      } else {
        statusClass = 'incorrect';
        statusText = 'Incorrect';
      }
    } else if (answer === 'timeout') {
      statusClass = 'incorrect';
      statusText = 'Time Out';
    }

    const summaryItem = document.createElement('div');
    summaryItem.className = `summary-item ${statusClass}`;
    summaryItem.innerHTML = `
      <div class="summary-question">${index + 1}. ${question.question}</div>
      <div class="summary-answer">
        ${answer && answer !== 'timeout' ?
          `Your answer: <strong>${question.options.find(o => o.id === answer).text}</strong>` :
          'No answer provided'
        }
        ${statusClass === 'incorrect' ?
          `<br>Correct answer: <strong>${correctOption.text}</strong>` : ''
        }
      </div>
    `;
    elements.summaryList.appendChild(summaryItem);
  });

  showScreen('summary');
}

// Share Results
function shareResults() {
  const totalQuestions = state.currentQuestions.length;
  const percentage = Math.round((state.score.correct / totalQuestions) * 100);

  const shareText = `Quiz Master Results!\n` +
    `Score: ${percentage}%\n` +
    `Correct: ${state.score.correct}/${totalQuestions}\n` +
    `Categories: ${Array.from(state.selectedCategories).join(', ')}\n` +
    `#QuizMaster #CognitiveClarity`;

  if (navigator.share) {
    navigator.share({
      title: 'Quiz Master Results',
      text: shareText
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Results copied to clipboard!');
    });
  }
}

// Event Listeners
function setupEventListeners() {
  // Start button
  elements.startBtn.addEventListener('click', initializeQuiz);

  // Answer buttons
  elements.answersGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (btn && !btn.disabled) {
      handleAnswer(btn.dataset.option);
    }
  });

  // Navigation
  elements.nextBtn.addEventListener('click', goToNextQuestion);
  elements.prevBtn.addEventListener('click', goToPreviousQuestion);
  elements.submitBtn.addEventListener('click', showResults);

  // Results actions
  elements.summaryBtn.addEventListener('click', showSummary);
  elements.restartBtn.addEventListener('click', () => {
    showScreen('start');
  });

  // Summary actions
  elements.shareBtn.addEventListener('click', shareResults);
  elements.playAgainBtn.addEventListener('click', () => {
    showScreen('start');
  });
}

// Initialize App
function init() {
  loadQuizData();
  setupEventListeners();
}

// Start the app
init();
