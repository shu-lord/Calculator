// ===================================
// LEARNING PLATFORM JAVASCRIPT
// ===================================

// Course Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const courseCards = document.querySelectorAll(".course-card");

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      // Filter courses
      courseCards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        } else {
          const difficulty = card.getAttribute("data-difficulty");
          if (difficulty === filter) {
            card.style.display = "flex";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        }
      });
    });
  });
}

// Progress Tracking (localStorage)
class LearningProgress {
  constructor() {
    this.storageKey = "aiRedCellProgress";
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Could not load progress from localStorage:', error);
      return {};
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (error) {
      console.warn('Could not save progress to localStorage:', error);
    }
  }

  markModuleComplete(courseId, moduleIndex) {
    if (!this.progress[courseId]) {
      this.progress[courseId] = {
        completedModules: [],
        lastAccessed: Date.now(),
      };
    }

    if (!this.progress[courseId].completedModules.includes(moduleIndex)) {
      this.progress[courseId].completedModules.push(moduleIndex);
    }

    this.progress[courseId].lastAccessed = Date.now();
    this.saveProgress();
    this.updateProgressDisplay(courseId);
  }

  getProgress(courseId) {
    return (
      this.progress[courseId] || { completedModules: [], lastAccessed: null }
    );
  }

  getProgressPercentage(courseId, totalModules) {
    const courseProgress = this.getProgress(courseId);
    return Math.round(
      (courseProgress.completedModules.length / totalModules) * 100
    );
  }

  updateProgressDisplay(courseId) {
    const progressBar = document.querySelector(".progress-fill");
    const progressText = document.querySelector(".progress-percentage");

    if (progressBar && progressText) {
      const totalModules = document.querySelectorAll(".module-item").length;
      const percentage = this.getProgressPercentage(courseId, totalModules);

      progressBar.style.width = percentage + "%";
      progressText.textContent = percentage + "%";
    }

    // Update module checkmarks
    const moduleItems = document.querySelectorAll(".module-item");
    const courseProgress = this.getProgress(courseId);

    moduleItems.forEach((item, index) => {
      if (courseProgress.completedModules.includes(index)) {
        item.classList.add("completed");
      }
    });
  }

  isCourseComplete(courseId, totalModules) {
    return this.getProgressPercentage(courseId, totalModules) === 100;
  }
}

// Initialize progress tracker
const progressTracker = new LearningProgress();

// Module Navigation
const moduleItems = document.querySelectorAll(".module-item");
let currentModuleIndex = 0;

if (moduleItems.length > 0) {
  // Get course ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const moduleParam = urlParams.get("module");

  if (moduleParam) {
    currentModuleIndex = parseInt(moduleParam);
  }

  // Load progress for this course
  if (courseId) {
    progressTracker.updateProgressDisplay(courseId);
  }

  moduleItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      loadModule(index);
    });

    // Set active module
    if (index === currentModuleIndex) {
      item.classList.add("active");
    }
  });

  // Mark Complete Button
  const markCompleteBtn = document.getElementById("markCompleteBtn");
  if (markCompleteBtn && courseId) {
    markCompleteBtn.addEventListener("click", () => {
      progressTracker.markModuleComplete(courseId, currentModuleIndex);
      markCompleteBtn.textContent = "✓ Completed";
      markCompleteBtn.disabled = true;

      // Check if course is complete
      if (progressTracker.isCourseComplete(courseId, moduleItems.length)) {
        showCertificateModal(courseId);
      }
    });

    // Check if already completed
    const courseProgress = progressTracker.getProgress(courseId);
    if (courseProgress.completedModules.includes(currentModuleIndex)) {
      markCompleteBtn.textContent = "✓ Completed";
      markCompleteBtn.disabled = true;
    }
  }
}

// Load Module Content
function loadModule(index) {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (courseId) {
    // Add smooth fade-out transition
    const courseMain = document.querySelector('.course-main');
    if (courseMain) {
      courseMain.style.opacity = '0';
      courseMain.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        window.location.href = `course.html?id=${courseId}&module=${index}`;
      }, 300);
    } else {
      window.location.href = `course.html?id=${courseId}&module=${index}`;
    }
  }
}

// Next/Previous Module Navigation
const nextModuleBtn = document.getElementById("nextModule");
const prevModuleBtn = document.getElementById("prevModule");

if (nextModuleBtn) {
  nextModuleBtn.addEventListener("click", () => {
    if (currentModuleIndex < moduleItems.length - 1) {
      loadModule(currentModuleIndex + 1);
    }
  });
}

if (prevModuleBtn) {
  prevModuleBtn.addEventListener("click", () => {
    if (currentModuleIndex > 0) {
      loadModule(currentModuleIndex - 1);
    }
  });
}

// Certificate Generation
function showCertificateModal(courseId) {
  const modal = document.createElement("div");
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;

  const content = document.createElement("div");
  content.style.cssText = `
        background: linear-gradient(135deg, var(--darker-bg), var(--dark-bg));
        padding: 3rem;
        border-radius: 20px;
        border: 2px solid var(--primary-red);
        text-align: center;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(255, 0, 64, 0.5);
    `;

  content.innerHTML = `
        <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 1rem; background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🎉 Congratulations!
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            You've completed this course! Your certificate is ready.
        </p>
        <button onclick="downloadCertificate('${courseId}')" class="btn btn-primary" style="margin-right: 1rem;">
            Download Certificate
        </button>
        <button onclick="this.closest('div').parentElement.remove()" class="btn btn-secondary">
            Close
        </button>
    `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
  document.head.appendChild(style);
}

function downloadCertificate(courseId) {
  // This is a simple implementation - you could enhance with actual PDF generation
  const courseName =
    document.querySelector(".course-header h1")?.textContent || "Course";
  const userName = prompt("Enter your name for the certificate:") || "Student";

  alert(
    `Certificate for ${courseName} will be generated for ${userName}. This is a demo - in production, you would generate a PDF certificate here.`
  );
}

// Smooth Scroll Animations for Learning Pages
const learnObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

// Observe course cards for animation
courseCards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  learnObserver.observe(card);
});

// Bookmark Feature
class BookmarkManager {
  constructor() {
    this.storageKey = "aiRedCellBookmarks";
    this.bookmarks = this.loadBookmarks();
  }

  loadBookmarks() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Could not load bookmarks from localStorage:', error);
      return [];
    }
  }

  saveBookmarks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bookmarks));
    } catch (error) {
      console.warn('Could not save bookmarks to localStorage:', error);
    }
  }

  toggleBookmark(courseId, moduleIndex) {
    const bookmarkId = `${courseId}-${moduleIndex}`;
    const index = this.bookmarks.indexOf(bookmarkId);

    if (index > -1) {
      this.bookmarks.splice(index, 1);
      return false; // Removed
    } else {
      this.bookmarks.push(bookmarkId);
      return true; // Added
    }
  }

  isBookmarked(courseId, moduleIndex) {
    return this.bookmarks.includes(`${courseId}-${moduleIndex}`);
  }
}

const bookmarkManager = new BookmarkManager();

// Add bookmark button functionality
const bookmarkBtn = document.getElementById("bookmarkBtn");
if (bookmarkBtn) {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");
  const moduleIndex = currentModuleIndex;

  // Set initial state
  if (bookmarkManager.isBookmarked(courseId, moduleIndex)) {
    bookmarkBtn.innerHTML = "★ Bookmarked";
  } else {
    bookmarkBtn.innerHTML = "☆ Bookmark";
  }

  bookmarkBtn.addEventListener("click", () => {
    const isBookmarked = bookmarkManager.toggleBookmark(courseId, moduleIndex);
    bookmarkManager.saveBookmarks();

    if (isBookmarked) {
      bookmarkBtn.innerHTML = "★ Bookmarked";
    } else {
      bookmarkBtn.innerHTML = "☆ Bookmark";
    }
  });
}

// Console Easter Egg (Development Only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log(
    "%c📚 AI RedCell Learning Hub",
    "color: #ff0040; font-size: 20px; font-weight: bold;"
  );
  console.log(
    "%c🎓 Master AI Security Skills",
    "color: #ff6b35; font-size: 14px;"
  );
}
