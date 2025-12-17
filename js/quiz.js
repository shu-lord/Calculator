// ===================================
// SIMPLE QUIZ SYSTEM
// Clean, minimal quiz functionality
// ===================================

class SimpleQuiz {
  constructor(quizData) {
    this.questions = quizData || [];
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.isComplete = false;
    
    this.init();
  }

  init() {
    this.container = document.getElementById('quizContainer');
    this.progressEl = document.getElementById('quizProgress');
    this.feedbackEl = document.getElementById('quizFeedback');
    this.feedbackTextEl = document.getElementById('feedbackText');
    this.submitBtn = document.getElementById('submitQuizBtn');
    this.nextBtn = document.getElementById('nextQuestionBtn');
    this.resultsEl = document.getElementById('quizResults');
    this.scoreTextEl = document.getElementById('scoreText');
    this.retryBtn = document.getElementById('retryQuizBtn');
    
    if (!this.container) return;
    
    this.bindEvents();
    this.updateProgress();
  }

  bindEvents() {
    // Clone and replace buttons to remove old event listeners
    if (this.submitBtn) {
      const newSubmitBtn = this.submitBtn.cloneNode(true);
      this.submitBtn.parentNode.replaceChild(newSubmitBtn, this.submitBtn);
      this.submitBtn = newSubmitBtn;
      this.submitBtn.addEventListener('click', () => this.submitAnswer());
    }
    
    if (this.nextBtn) {
      const newNextBtn = this.nextBtn.cloneNode(true);
      this.nextBtn.parentNode.replaceChild(newNextBtn, this.nextBtn);
      this.nextBtn = newNextBtn;
      this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }
    
    if (this.retryBtn) {
      const newRetryBtn = this.retryBtn.cloneNode(true);
      this.retryBtn.parentNode.replaceChild(newRetryBtn, this.retryBtn);
      this.retryBtn = newRetryBtn;
      this.retryBtn.addEventListener('click', () => this.retry());
    }

    // Handle option selection - only add listener if not already bound
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
      if (!option.dataset.bound) {
        option.dataset.bound = 'true';
        option.addEventListener('click', (e) => {
          const input = option.querySelector('input[type="radio"]');
          if (input && !this.isComplete) {
            input.checked = true;
            this.selectOption(option);
          }
        });
      }
    });
  }

  selectOption(selectedOption) {
    const questionContainer = selectedOption.closest('.quiz-question');
    const allOptions = questionContainer.querySelectorAll('.quiz-option');
    
    allOptions.forEach(opt => opt.classList.remove('selected'));
    selectedOption.classList.add('selected');
  }

  submitAnswer() {
    const currentQuestionEl = document.querySelector(`.quiz-question[data-question="${this.currentQuestion}"]`);
    if (!currentQuestionEl) return;
    
    const selectedOption = currentQuestionEl.querySelector('input[type="radio"]:checked');
    if (!selectedOption) {
      this.showMessage('Please select an answer');
      return;
    }
    
    const answerIndex = parseInt(selectedOption.value);
    const correctIndex = this.questions[this.currentQuestion]?.correctIndex ?? 0;
    const isCorrect = answerIndex === correctIndex;
    
    this.answers.push({
      question: this.currentQuestion,
      answer: answerIndex,
      correct: isCorrect
    });
    
    if (isCorrect) {
      this.score++;
    }
    
    this.showFeedback(isCorrect, this.questions[this.currentQuestion]?.explanation || '');
    this.highlightOptions(currentQuestionEl, answerIndex, correctIndex);
    
    // Hide submit, show next
    this.submitBtn.style.display = 'none';
    
    if (this.currentQuestion < this.questions.length - 1) {
      this.nextBtn.style.display = 'inline-block';
    } else {
      this.showResults();
    }
  }

  showFeedback(isCorrect, explanation) {
    this.feedbackEl.style.display = 'block';
    this.feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.feedbackTextEl.textContent = explanation || (isCorrect ? 'Correct!' : 'Incorrect.');
  }

  highlightOptions(questionEl, selectedIndex, correctIndex) {
    const options = questionEl.querySelectorAll('.quiz-option');
    
    options.forEach((option, index) => {
      const input = option.querySelector('input');
      if (!input) return;
      
      input.disabled = true;
      option.style.cursor = 'default';
      
      const optionIndex = parseInt(input.value);
      
      if (optionIndex === correctIndex) {
        option.classList.add('correct');
      } else if (optionIndex === selectedIndex && selectedIndex !== correctIndex) {
        option.classList.add('incorrect');
      }
    });
  }

  nextQuestion() {
    this.currentQuestion++;
    
    // Hide current question
    document.querySelectorAll('.quiz-question').forEach(q => {
      q.classList.remove('active');
    });
    
    // Show next question
    const nextQuestionEl = document.querySelector(`.quiz-question[data-question="${this.currentQuestion}"]`);
    if (nextQuestionEl) {
      nextQuestionEl.classList.add('active');
    }
    
    // Reset UI
    this.feedbackEl.style.display = 'none';
    this.submitBtn.style.display = 'inline-block';
    this.nextBtn.style.display = 'none';
    
    this.updateProgress();
  }

  showResults() {
    this.isComplete = true;
    
    // Hide question and feedback
    document.querySelectorAll('.quiz-question').forEach(q => {
      q.style.display = 'none';
    });
    this.feedbackEl.style.display = 'none';
    this.nextBtn.style.display = 'none';
    
    // Show results
    this.resultsEl.style.display = 'block';
    this.scoreTextEl.textContent = `You scored ${this.score} out of ${this.questions.length}`;
    
    // Store result in localStorage
    this.saveResult();
  }

  retry() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.isComplete = false;
    
    // Reset UI
    this.resultsEl.style.display = 'none';
    this.feedbackEl.style.display = 'none';
    this.submitBtn.style.display = 'inline-block';
    this.nextBtn.style.display = 'none';
    
    // Reset questions
    document.querySelectorAll('.quiz-question').forEach((q, index) => {
      q.style.display = '';
      q.classList.remove('active');
      if (index === 0) q.classList.add('active');
      
      // Reset options
      const options = q.querySelectorAll('.quiz-option');
      options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        opt.style.cursor = 'pointer';
        const input = opt.querySelector('input');
        if (input) {
          input.checked = false;
          input.disabled = false;
        }
      });
    });
    
    this.updateProgress();
  }

  updateProgress() {
    if (this.progressEl) {
      this.progressEl.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
    }
  }

  saveResult() {
    try {
      const courseId = new URLSearchParams(window.location.search).get('id') || 'unknown';
      const moduleIndex = window.currentModuleIndex || 0;
      const key = `quiz_${courseId}_${moduleIndex}`;
      
      const result = {
        score: this.score,
        total: this.questions.length,
        percentage: Math.round((this.score / this.questions.length) * 100),
        completedAt: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(result));
    } catch (error) {
      console.warn('Could not save quiz result:', error);
    }
  }

  showMessage(message) {
    // Simple alert for now - could be enhanced with a toast notification
    const existingMsg = document.querySelector('.quiz-message');
    if (existingMsg) existingMsg.remove();
    
    const msgEl = document.createElement('div');
    msgEl.className = 'quiz-message';
    msgEl.textContent = message;
    msgEl.style.cssText = `
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #ef4444;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    `;
    
    this.container.prepend(msgEl);
    
    setTimeout(() => msgEl.remove(), 3000);
  }
}

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Default quiz data (will be replaced by CMS data)
  const defaultQuizData = [
    {
      question: "What is the main goal of prompt engineering?",
      options: [
        "To confuse the AI",
        "To get better AI responses",
        "To make prompts longer",
        "To use technical jargon"
      ],
      correctIndex: 1,
      explanation: "Prompt engineering aims to craft inputs that elicit the best possible outputs from AI models."
    },
    {
      question: "Which is a key principle of effective prompts?",
      options: [
        "Ambiguity",
        "Clarity",
        "Complexity",
        "Verbosity"
      ],
      correctIndex: 1,
      explanation: "Clarity helps the AI understand exactly what you want, leading to better responses."
    },
    {
      question: "What does providing context in a prompt help with?",
      options: [
        "Making prompts longer",
        "Confusing the AI",
        "Helping AI understand your needs",
        "Reducing response quality"
      ],
      correctIndex: 2,
      explanation: "Context provides relevant background information that helps the AI better understand and respond to your needs."
    }
  ];
  
  // Check if quiz data is loaded from CMS
  const quizData = window.currentQuizData || defaultQuizData;
  
  // Initialize quiz if quiz section exists
  if (document.getElementById('quizSection')) {
    window.simpleQuiz = new SimpleQuiz(quizData);
  }
});
