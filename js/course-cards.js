// ===================================
// COURSE CARDS LOADER
// Dynamically loads course cards from JSON
// ===================================

class CourseCardsLoader {
  constructor() {
    this.coursesGrid = document.getElementById('coursesGrid');
    this.courses = [];
    this.currentFilter = 'all';
    
    if (this.coursesGrid) {
      this.init();
    }
  }

  async init() {
    try {
      await this.loadCourses();
      this.renderCourses();
      this.bindFilters();
      this.updateStats();
    } catch (error) {
      console.error('Error loading courses:', error);
      this.showError();
    }
  }

  async loadCourses() {
    try {
      // Step 1: Load course list from index.json (editable in CMS)
      const indexResponse = await fetch('content/courses/index.json');
      if (!indexResponse.ok) {
        throw new Error('Could not load course index');
      }
      const indexData = await indexResponse.json();
      const courseSlugs = indexData.courses.map(c => c.slug);

      // Step 2: Load full course data from individual JSON files
      const coursePromises = courseSlugs.map(async (slug) => {
        try {
          const response = await fetch(`content/courses/${slug}.json`);
          if (!response.ok) return null;
          return await response.json();
        } catch {
          return null;
        }
      });

      const allCourses = await Promise.all(coursePromises);
      
      // Filter out nulls and disabled courses
      this.courses = allCourses.filter(course => {
        if (!course) return false;
        // Only show enabled courses (default to true if not set)
        return course.enabled !== false;
      });
    } catch (error) {
      console.error('Error loading courses:', error);
      this.courses = [];
    }
  }

  renderCourses(filter = 'all') {
    if (!this.coursesGrid) return;

    const filteredCourses = filter === 'all' 
      ? this.courses 
      : this.courses.filter(c => c.difficulty === filter);

    this.coursesGrid.innerHTML = filteredCourses.map(course => this.createCourseCard(course)).join('');
    
    // Add animation class
    const cards = this.coursesGrid.querySelectorAll('.course-card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('fade-in');
    });
  }

  createCourseCard(course) {
    const difficultyLabels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    };

    // Check if course is Coming Soon
    const isComingSoon = course.comingSoon === true;
    const cardClass = isComingSoon ? 'course-card coming-soon' : 'course-card';
    const buttonHtml = isComingSoon 
      ? `<span class="btn btn-disabled course-btn">Coming Soon</span>`
      : `<a href="course.html?id=${course.slug}" class="btn btn-primary course-btn">
          Start Learning
          <span class="btn-arrow">→</span>
        </a>`;
    const comingSoonBadge = isComingSoon 
      ? `<span class="coming-soon-badge">Coming Soon</span>` 
      : '';

    return `
      <div class="${cardClass}" data-difficulty="${course.difficulty}" data-course-id="${course.slug}">
        <div class="course-thumbnail">
          ${comingSoonBadge}
          <img 
            src="${course.thumbnail}" 
            alt="${course.title}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
          />
          <div class="thumbnail-placeholder" style="display: none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="course-overlay"></div>
        </div>
        <div class="course-content">
          <div class="course-meta">
            <span class="difficulty-badge ${course.difficulty}">${difficultyLabels[course.difficulty] || course.difficulty}</span>
            <span class="duration">${course.duration}</span>
          </div>
          <h3>${course.title}</h3>
          <p class="course-description">${course.description}</p>
          <div class="course-info">
            <span class="module-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
              </svg>
              ${course.moduleCount} Modules
            </span>
            <span class="course-level">${course.level}</span>
          </div>
          ${buttonHtml}
        </div>
      </div>
    `;
  }

  bindFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        this.currentFilter = filter;
        this.renderCourses(filter);
      });
    });
  }

  updateStats() {
    // Update stats in hero section
    const courseCountEl = document.querySelector('.stat-badge:first-child .stat-number');
    const moduleCountEl = document.querySelector('.stat-badge:nth-child(2) .stat-number');
    
    if (courseCountEl) {
      courseCountEl.textContent = this.courses.length;
    }
    
    if (moduleCountEl) {
      const totalModules = this.courses.reduce((sum, c) => sum + (c.moduleCount || 0), 0);
      moduleCountEl.textContent = totalModules;
    }
  }

  showError() {
    if (this.coursesGrid) {
      this.coursesGrid.innerHTML = `
        <div class="error-message" style="
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: var(--text-secondary);
        ">
          <h3>Could not load courses</h3>
          <p>Please try refreshing the page.</p>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on learning page
  if (document.getElementById('coursesGrid')) {
    window.courseCardsLoader = new CourseCardsLoader();
  }
});

// Add fade-in animation CSS and Coming Soon styles
const style = document.createElement('style');
style.textContent = `
  .course-card.fade-in {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Coming Soon Styles */
  .course-card.coming-soon {
    opacity: 0.75;
  }
  
  .course-card.coming-soon:hover {
    transform: none;
    box-shadow: none;
  }
  
  .coming-soon-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: linear-gradient(135deg, #ff6b35, #ff0040);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 10;
    box-shadow: 0 4px 15px rgba(255, 0, 64, 0.4);
  }
  
  .btn.btn-disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .btn.btn-disabled:hover {
    transform: none;
    box-shadow: none;
  }
`;
document.head.appendChild(style);
