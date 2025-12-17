// ===================================
// COURSE LOADER
// Loads course content from JSON files (Netlify CMS)
// ===================================

class CourseLoader {
  constructor() {
    this.courseId = this.getCourseId();
    this.moduleIndex = this.getModuleIndex();
    this.lessonIndex = this.getLessonIndex(); // -1 means show module intro/overview
    this.courseData = null;
    this.progress = new LearningProgress();
    
    this.init();
  }

  getCourseId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'prompt-engineering';
  }

  getModuleIndex() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('module') || '0');
  }

  getLessonIndex() {
    const params = new URLSearchParams(window.location.search);
    const lesson = params.get('lesson');
    return lesson !== null ? parseInt(lesson) : -1; // -1 = module overview
  }

  async init() {
    try {
      await this.loadCourse();
      this.renderCourse();
      this.bindEvents();
      this.updateProgress();
    } catch (error) {
      console.error('Error loading course:', error);
      this.showError('Could not load course content.');
    }
  }

  async loadCourse() {
    const response = await fetch(`content/courses/${this.courseId}.json`);
    if (!response.ok) {
      throw new Error(`Course not found: ${this.courseId}`);
    }
    this.courseData = await response.json();
    
    // Check if course is enabled
    if (this.courseData.enabled === false) {
      this.showCourseDisabled();
      throw new Error('Course is disabled');
    }
    
    // Check if course is Coming Soon
    if (this.courseData.comingSoon === true) {
      this.showComingSoon();
      throw new Error('Course is coming soon');
    }
  }

  showComingSoon() {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = `
        <div class="error-message" style="
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        ">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🚀</div>
          <h2 style="color: var(--primary-red); margin-bottom: 1rem;">Coming Soon!</h2>
          <p style="margin-bottom: 2rem;">This course is currently being developed. Check back soon for updates!</p>
          <a href="learning.html" class="btn btn-primary">
            ← Browse Available Courses
          </a>
        </div>
      `;
    }
    
    // Hide sidebar content for coming soon courses
    const sidebar = document.querySelector('.course-sidebar-clean');
    if (sidebar) {
      sidebar.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
          <p>🚀 Coming Soon</p>
        </div>
      `;
    }
  }

  showCourseDisabled() {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = `
        <div class="error-message" style="
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
        ">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
          <h2 style="color: var(--primary-red); margin-bottom: 1rem;">Course Unavailable</h2>
          <p style="margin-bottom: 2rem;">This course is currently not available. Please check back later or explore our other courses.</p>
          <a href="learning.html" class="btn btn-primary">
            ← Browse Available Courses
          </a>
        </div>
      `;
    }
    
    // Hide sidebar content for disabled courses
    const sidebar = document.querySelector('.course-sidebar-clean');
    if (sidebar) {
      sidebar.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
          <p>Course unavailable</p>
        </div>
      `;
    }
  }

  renderCourse() {
    if (!this.courseData) return;

    // Update breadcrumb
    const breadcrumbCourse = document.getElementById('breadcrumbCourse');
    if (breadcrumbCourse) {
      breadcrumbCourse.textContent = this.courseData.title;
    }

    // Update sidebar header
    const sidebarTitle = document.getElementById('sidebarCourseTitle');
    if (sidebarTitle) {
      sidebarTitle.textContent = this.courseData.title;
    }

    const sidebarDifficulty = document.getElementById('sidebarDifficulty');
    if (sidebarDifficulty) {
      sidebarDifficulty.textContent = this.courseData.difficulty;
      sidebarDifficulty.className = `difficulty-badge ${this.courseData.difficulty}`;
    }

    // Render module list
    this.renderModuleList();

    // Render current module content
    this.renderModule(this.moduleIndex);
  }

  renderModuleList() {
    const moduleList = document.getElementById('moduleList');
    if (!moduleList || !this.courseData.modules) return;

    const completedModules = this.progress.getProgress(this.courseId).completedModules || [];

    moduleList.innerHTML = this.courseData.modules.map((module, index) => {
      const isActive = index === this.moduleIndex;
      const isCompleted = completedModules.includes(index);
      const checkSymbol = isCompleted ? '✓' : '○';
      const hasLessons = module.lessons && module.lessons.length > 0;
      const isExpanded = isActive && hasLessons;
      
      // Build lessons HTML if module has lessons
      let lessonsHtml = '';
      if (hasLessons) {
        lessonsHtml = `
          <ul class="lesson-list ${isExpanded ? 'expanded' : ''}">
            ${module.lessons.map((lesson, lessonIndex) => {
              const isLessonActive = isActive && this.lessonIndex === lessonIndex;
              return `
              <li class="lesson-item ${isLessonActive ? 'active' : ''}" data-lesson="${lessonIndex}">
                <span class="lesson-icon">${this.getLessonIcon(lesson.type)}</span>
                <span class="lesson-title">${lesson.title}</span>
                ${lesson.duration ? `<span class="lesson-duration">${lesson.duration}</span>` : ''}
              </li>
            `}).join('')}
          </ul>
        `;
      }
      
      return `
        <li class="module-item-wrapper ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
            data-module="${index}">
          <div class="module-item-clean ${hasLessons ? 'has-lessons' : ''}">
            <span class="module-check">${checkSymbol}</span>
            <span class="module-title">${index + 1}. ${module.title}</span>
            ${hasLessons ? `<span class="module-expand-icon ${isExpanded ? 'expanded' : ''}">▼</span>` : ''}
          </div>
          ${lessonsHtml}
        </li>
      `;
    }).join('');

    // Bind click events for modules
    moduleList.querySelectorAll('.module-item-wrapper').forEach(wrapper => {
      const moduleItem = wrapper.querySelector('.module-item-clean');
      const lessonList = wrapper.querySelector('.lesson-list');
      
      moduleItem.addEventListener('click', (e) => {
        const moduleIdx = parseInt(wrapper.getAttribute('data-module'));
        const hasLessons = moduleItem.classList.contains('has-lessons');
        
        // If module has lessons, toggle expand on click, otherwise navigate
        if (hasLessons && lessonList) {
          this.toggleModuleLessons(wrapper, moduleIdx);
        } else {
          this.loadModule(moduleIdx);
        }
      });
    });

    // Bind click events for lessons
    moduleList.querySelectorAll('.lesson-item').forEach(lesson => {
      lesson.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger module click
        const wrapper = lesson.closest('.module-item-wrapper');
        const moduleIdx = parseInt(wrapper.getAttribute('data-module'));
        const lessonIdx = parseInt(lesson.getAttribute('data-lesson'));
        this.loadModuleLesson(moduleIdx, lessonIdx);
      });
    });
  }

  // Get icon for lesson type
  getLessonIcon(type) {
    const icons = {
      'video': '📹',
      'reading': '📖',
      'quiz': '❓',
      'lab': '💻',
      'assignment': '📝',
      'discussion': '💬'
    };
    return icons[type] || '📄';
  }

  // Toggle expand/collapse for module lessons
  toggleModuleLessons(wrapper, moduleIdx) {
    const lessonList = wrapper.querySelector('.lesson-list');
    const expandIcon = wrapper.querySelector('.module-expand-icon');
    
    if (lessonList) {
      const isExpanded = lessonList.classList.contains('expanded');
      
      // Collapse all other modules first
      document.querySelectorAll('.lesson-list.expanded').forEach(list => {
        if (list !== lessonList) {
          list.classList.remove('expanded');
          const otherIcon = list.closest('.module-item-wrapper').querySelector('.module-expand-icon');
          if (otherIcon) otherIcon.classList.remove('expanded');
        }
      });
      
      // Toggle current module
      lessonList.classList.toggle('expanded');
      if (expandIcon) expandIcon.classList.toggle('expanded');
      
      // If expanding, also navigate to this module
      if (!isExpanded) {
        this.loadModule(moduleIdx);
      }
    }
  }

  // Load a specific lesson within a module (shows lesson's own content)
  loadModuleLesson(moduleIdx, lessonIdx) {
    this.moduleIndex = moduleIdx;
    this.lessonIndex = lessonIdx;
    
    // Update URL to include lesson parameter
    const url = new URL(window.location);
    url.searchParams.set('module', moduleIdx);
    url.searchParams.set('lesson', lessonIdx);
    window.history.pushState({}, '', url);
    
    // Render the specific lesson content
    this.renderLesson(moduleIdx, lessonIdx);
    this.renderModuleList();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render a specific lesson's content
  renderLesson(moduleIdx, lessonIdx) {
    const module = this.courseData.modules[moduleIdx];
    if (!module || !module.lessons || !module.lessons[lessonIdx]) return;
    
    const lesson = module.lessons[lessonIdx];
    window.currentModuleIndex = moduleIdx;
    window.currentLessonIndex = lessonIdx;

    // Update header
    const moduleTitle = document.getElementById('moduleTitle');
    if (moduleTitle) {
      moduleTitle.textContent = lesson.title;
    }

    const moduleDescription = document.getElementById('moduleDescription');
    if (moduleDescription) {
      // Show breadcrumb-style path
      moduleDescription.innerHTML = `<span class="lesson-breadcrumb">Module ${moduleIdx + 1}: ${module.title}</span> • ${lesson.type} • ${lesson.duration}`;
    }

    // Render lesson content
    const moduleContent = document.getElementById('moduleContent');
    if (moduleContent && lesson.content) {
      moduleContent.innerHTML = this.renderMarkdown(lesson.content);
    }

    // Show quiz if this lesson has one
    if (lesson.quiz) {
      this.renderQuiz(lesson.quiz);
    } else {
      // Hide quiz if lesson doesn't have one
      const quizSection = document.getElementById('quizSection');
      if (quizSection) {
        quizSection.style.display = 'none';
      }
    }

    // Update navigation for lesson context
    this.updateLessonNavigation(moduleIdx, lessonIdx);

    // Update page title
    document.title = `${lesson.title} - ${this.courseData.title} | AI RedCell`;
  }

  // Update navigation buttons for lesson context
  updateLessonNavigation(moduleIdx, lessonIdx) {
    const prevBtn = document.getElementById('prevModule');
    const nextBtn = document.getElementById('nextModule');
    const module = this.courseData.modules[moduleIdx];
    const totalLessons = module?.lessons?.length || 0;
    const totalModules = this.courseData.modules.length;

    if (prevBtn) {
      // Can go to previous lesson, or previous module's last lesson
      if (lessonIdx > 0) {
        prevBtn.disabled = false;
        prevBtn.textContent = '← Previous Lesson';
      } else if (moduleIdx > 0) {
        prevBtn.disabled = false;
        prevBtn.textContent = '← Previous Module';
      } else {
        prevBtn.disabled = true;
      }
    }

    if (nextBtn) {
      // Can go to next lesson, or next module, or show quiz
      if (lessonIdx < totalLessons - 1) {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Next Lesson →';
      } else if (module?.quiz) {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Take Quiz →';
      } else if (moduleIdx < totalModules - 1) {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Next Module →';
      } else {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Course Complete!';
      }
    }
  }

  renderModule(index) {
    const module = this.courseData.modules[index];
    if (!module) return;

    // If there's a lesson index set, render that lesson instead
    if (this.lessonIndex >= 0) {
      this.renderLesson(index, this.lessonIndex);
      return;
    }

    window.currentModuleIndex = index;
    window.currentLessonIndex = -1;

    // Update module header
    const moduleTitle = document.getElementById('moduleTitle');
    if (moduleTitle) {
      moduleTitle.textContent = `Module ${index + 1}: ${module.title}`;
    }

    const moduleDescription = document.getElementById('moduleDescription');
    if (moduleDescription) {
      moduleDescription.textContent = module.description || '';
    }

    // Build module overview content with lesson list
    const moduleContent = document.getElementById('moduleContent');
    if (moduleContent) {
      let overviewHtml = `
        <h2>Module Overview</h2>
        <p>${module.description}</p>
        <h3>📚 Lessons in this Module</h3>
        <div class="lesson-cards">
      `;
      
      if (module.lessons && module.lessons.length > 0) {
        module.lessons.forEach((lesson, lessonIdx) => {
          overviewHtml += `
            <div class="lesson-card" data-module="${index}" data-lesson="${lessonIdx}">
              <span class="lesson-card-icon">${this.getLessonIcon(lesson.type)}</span>
              <div class="lesson-card-info">
                <h4>${lesson.title}</h4>
                <span class="lesson-card-meta">${lesson.type} • ${lesson.duration}</span>
              </div>
              <span class="lesson-card-arrow">→</span>
            </div>
          `;
        });
      }
      
      overviewHtml += '</div>';
      
      // Add quiz info if available
      if (module.quiz && module.quiz.questions) {
        overviewHtml += `
          <div class="module-quiz-info">
            <span class="quiz-info-icon">❓</span>
            <span>Module Quiz: ${module.quiz.questions.length} questions</span>
          </div>
        `;
      }
      
      moduleContent.innerHTML = overviewHtml;
      
      // Bind click events to lesson cards
      moduleContent.querySelectorAll('.lesson-card').forEach(card => {
        card.addEventListener('click', () => {
          const modIdx = parseInt(card.getAttribute('data-module'));
          const lesIdx = parseInt(card.getAttribute('data-lesson'));
          this.loadModuleLesson(modIdx, lesIdx);
        });
      });
    }

    // Hide quiz for module overview
    const quizSection = document.getElementById('quizSection');
    if (quizSection) {
      quizSection.style.display = 'none';
    }

    // Update navigation buttons
    this.updateNavigation(index);

    // Update page title
    document.title = `${module.title} - ${this.courseData.title} | AI RedCell`;
  }

  renderMarkdown(content) {
    // Process tables FIRST before escaping HTML
    let html = content;
    
    // Parse markdown tables
    const tableRegex = /\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g;
    html = html.replace(tableRegex, (match, headerRow, bodyRows) => {
      // Parse header
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
      let tableHtml = '<table class="markdown-table"><thead><tr>';
      headers.forEach(h => {
        tableHtml += `<th>${h}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      
      // Parse body rows
      const rows = bodyRows.trim().split('\n');
      rows.forEach(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c);
        tableHtml += '<tr>';
        cells.forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      });
      
      tableHtml += '</tbody></table>';
      return tableHtml;
    });
    
    // Now do other markdown conversions
    html = html
      // Escape HTML (but not our table tags)
      .replace(/&(?!amp;|lt;|gt;)/g, '&amp;')
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Unordered lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    // Clean up nested ul tags
    html = html.replace(/<\/ul><ul>/g, '');
    
    return `<p>${html}</p>`;
  }

  renderQuiz(quiz) {
    const quizSection = document.getElementById('quizSection');
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      if (quizSection) quizSection.style.display = 'none';
      return;
    }

    if (quizSection) quizSection.style.display = 'block';
    
    // Store quiz data for quiz.js
    window.currentQuizData = quiz.questions;

    // Render quiz questions with fresh HTML
    if (quizContainer) {
      const questionsHtml = quiz.questions.map((q, qIndex) => `
        <div class="quiz-question ${qIndex === 0 ? 'active' : ''}" data-question="${qIndex}">
          <p class="question-text">${q.question}</p>
          <div class="quiz-options">
            ${q.options.map((opt, optIndex) => `
              <label class="quiz-option">
                <input type="radio" name="q${qIndex}" value="${optIndex}">
                <span class="option-text">${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Build the complete quiz container HTML with reset state
      quizContainer.innerHTML = `
        ${questionsHtml}
        <div id="quizFeedback" class="quiz-feedback" style="display: none;">
          <p id="feedbackText"></p>
        </div>
        <div class="quiz-actions">
          <button id="submitQuizBtn" class="btn btn-primary">Submit Answer</button>
          <button id="nextQuestionBtn" class="btn btn-secondary" style="display: none;">Next Question</button>
        </div>
        <div id="quizResults" class="quiz-results" style="display: none;">
          <h3>Quiz Complete!</h3>
          <p id="scoreText"></p>
          <button id="retryQuizBtn" class="btn btn-secondary">Try Again</button>
        </div>
      `;
    }

    // Update progress
    const progressEl = document.getElementById('quizProgress');
    if (progressEl) {
      progressEl.textContent = `Question 1 of ${quiz.questions.length}`;
    }

    // Always initialize quiz with the correct questions data
    window.currentQuizData = quiz.questions;
    window.simpleQuiz = new SimpleQuiz(quiz.questions);
  }

  updateNavigation(index) {
    const prevBtn = document.getElementById('prevModule');
    const nextBtn = document.getElementById('nextModule');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    
    const totalModules = this.courseData.modules.length;
    const completedModules = this.progress.getProgress(this.courseId).completedModules || [];
    const isCompleted = completedModules.includes(index);

    if (prevBtn) {
      prevBtn.disabled = index === 0;
    }

    if (nextBtn) {
      nextBtn.disabled = index >= totalModules - 1;
    }

    if (markCompleteBtn) {
      if (isCompleted) {
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.classList.add('completed');
      } else {
        markCompleteBtn.textContent = 'Mark as Complete ✓';
        markCompleteBtn.classList.remove('completed');
      }
    }
  }

  // Show quiz for the current module (after completing lessons)
  showModuleQuiz() {
    const module = this.courseData.modules[this.moduleIndex];
    if (!module || !module.quiz) return;

    // Update header
    const moduleTitle = document.getElementById('moduleTitle');
    if (moduleTitle) {
      moduleTitle.textContent = `Quiz: ${module.title}`;
    }

    const moduleDescription = document.getElementById('moduleDescription');
    if (moduleDescription) {
      moduleDescription.textContent = `Test your knowledge from Module ${this.moduleIndex + 1}`;
    }

    // Clear content and show quiz
    const moduleContent = document.getElementById('moduleContent');
    if (moduleContent) {
      moduleContent.innerHTML = '<p>Complete the quiz below to finish this module.</p>';
    }

    // Show and render quiz
    this.renderQuiz(module.quiz);

    // Update navigation
    const prevBtn = document.getElementById('prevModule');
    const nextBtn = document.getElementById('nextModule');
    
    if (prevBtn) {
      prevBtn.disabled = false;
      prevBtn.textContent = '← Back to Lessons';
    }
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Complete Quiz First';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadModule(index) {
    this.moduleIndex = index;
    this.lessonIndex = -1; // Reset to module overview
    
    // Update URL (remove lesson param when viewing module overview)
    const url = new URL(window.location);
    url.searchParams.set('module', index);
    url.searchParams.delete('lesson'); // Remove lesson param
    window.history.pushState({}, '', url);
    
    // Render new module
    this.renderModule(index);
    this.renderModuleList();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  bindEvents() {
    // Previous module/lesson button
    const prevBtn = document.getElementById('prevModule');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        // If viewing a lesson, go to previous lesson or module
        if (this.lessonIndex > 0) {
          this.loadModuleLesson(this.moduleIndex, this.lessonIndex - 1);
        } else if (this.lessonIndex === 0) {
          // At first lesson, go back to module overview
          this.loadModule(this.moduleIndex);
        } else if (this.moduleIndex > 0) {
          // At module overview, go to previous module
          this.loadModule(this.moduleIndex - 1);
        }
      });
    }

    // Next module/lesson button
    const nextBtn = document.getElementById('nextModule');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const module = this.courseData.modules[this.moduleIndex];
        const totalLessons = module?.lessons?.length || 0;
        const totalModules = this.courseData.modules.length;
        
        if (this.lessonIndex >= 0) {
          // Currently on a lesson
          if (this.lessonIndex < totalLessons - 1) {
            // Go to next lesson
            this.loadModuleLesson(this.moduleIndex, this.lessonIndex + 1);
          } else if (module?.quiz) {
            // Show quiz
            this.showModuleQuiz();
          } else if (this.moduleIndex < totalModules - 1) {
            // Go to next module
            this.loadModule(this.moduleIndex + 1);
          }
        } else {
          // On module overview - go to first lesson
          if (totalLessons > 0) {
            this.loadModuleLesson(this.moduleIndex, 0);
          } else if (this.moduleIndex < totalModules - 1) {
            this.loadModule(this.moduleIndex + 1);
          }
        }
      });
    }

    // Mark complete button
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    if (markCompleteBtn) {
      markCompleteBtn.addEventListener('click', () => {
        this.progress.markModuleComplete(this.courseId, this.moduleIndex);
        this.renderModuleList();
        this.updateNavigation(this.moduleIndex);
        this.updateProgress();
      });
    }
  }

  updateProgress() {
    const totalModules = this.courseData?.modules?.length || 1;
    const completedModules = this.progress.getProgress(this.courseId).completedModules || [];
    const percentage = Math.round((completedModules.length / totalModules) * 100);

    const progressPercent = document.getElementById('progressPercent');
    const progressFill = document.getElementById('progressFill');

    if (progressPercent) {
      progressPercent.textContent = `${percentage}%`;
    }

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  }

  showError(message) {
    const content = document.getElementById('moduleContent');
    if (content) {
      content.innerHTML = `
        <div class="error-message" style="
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        ">
          <h2>Oops!</h2>
          <p>${message}</p>
          <a href="learning.html" class="btn btn-primary" style="margin-top: 1rem;">
            Back to Courses
          </a>
        </div>
      `;
    }
  }
}

// LearningProgress class (if not already loaded)
if (typeof LearningProgress === 'undefined') {
  class LearningProgress {
    constructor() {
      this.storageKey = 'aiRedCellProgress';
      this.progress = this.loadProgress();
    }

    loadProgress() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
      } catch (error) {
        console.warn('Could not load progress:', error);
        return {};
      }
    }

    saveProgress() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
      } catch (error) {
        console.warn('Could not save progress:', error);
      }
    }

    markModuleComplete(courseId, moduleIndex) {
      if (!this.progress[courseId]) {
        this.progress[courseId] = { completedModules: [], lastAccessed: Date.now() };
      }
      
      if (!this.progress[courseId].completedModules.includes(moduleIndex)) {
        this.progress[courseId].completedModules.push(moduleIndex);
      }
      
      this.progress[courseId].lastAccessed = Date.now();
      this.saveProgress();
    }

    getProgress(courseId) {
      return this.progress[courseId] || { completedModules: [], lastAccessed: null };
    }
  }
  
  window.LearningProgress = LearningProgress;
}

// Initialize course loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on course page
  if (document.querySelector('.course-container')) {
    window.courseLoader = new CourseLoader();
    
    // Mobile Sidebar Toggle
    initMobileSidebar();
  }
});

// Mobile Sidebar Toggle Functionality
function initMobileSidebar() {
  const toggleBtn = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('courseSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (!toggleBtn || !sidebar) return;
  
  // Toggle sidebar open/close
  function toggleSidebar() {
    const isOpen = sidebar.classList.contains('active');
    
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  function openSidebar() {
    sidebar.classList.add('active');
    toggleBtn.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    toggleBtn.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Toggle button click
  toggleBtn.addEventListener('click', toggleSidebar);
  
  // Overlay click closes sidebar
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar when clicking on a module item
  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.module-item-clean')) {
      // Close after a small delay to allow navigation
      setTimeout(closeSidebar, 300);
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
}
