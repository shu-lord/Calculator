/**
 * Highlighted Projects - 3D Carousel
 * Creates perspective carousel with center focus, blurred side cards
 */

document.addEventListener('DOMContentLoaded', function() {
  loadHighlightedProjects();
});

let currentIndex = 0;
let projectsData = [];

async function loadHighlightedProjects() {
  const carousel = document.getElementById('projects-carousel');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!carousel) return;
  
  try {
    const response = await fetch('content/projects/index.json');
    if (!response.ok) throw new Error('Failed to load projects');
    
    const data = await response.json();
    projectsData = data.projects;
    
    // Update section title and description if elements exist
    const titleEl = document.querySelector('.projects-section .section-title');
    const descEl = document.querySelector('.projects-section .section-description');
    
    if (titleEl && data.sectionTitle) {
      titleEl.innerHTML = data.sectionTitle.replace('Projects', '<span class="highlight">Projects</span>');
    }
    if (descEl && data.sectionSubtitle) {
      descEl.textContent = data.sectionSubtitle;
    }
    
    // Render project cards
    carousel.innerHTML = projectsData.map((project, index) => createProjectCard(project, index)).join('');
    
    // Add click handlers to cards for navigation
    carousel.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const cardIndex = parseInt(card.dataset.index);
        if (cardIndex !== currentIndex) {
          goToProject(cardIndex);
        }
      });
    });
    
    // Create carousel dots
    if (dotsContainer && projectsData.length > 0) {
      dotsContainer.innerHTML = projectsData.map((_, index) => 
        `<button class="carousel-dot${index === 0 ? ' active' : ''}" data-index="${index}" aria-label="Go to project ${index + 1}"></button>`
      ).join('');
      
      // Add dot click handlers
      dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => goToProject(parseInt(dot.dataset.index)));
      });
    }
    
    // Setup carousel navigation
    setupCarouselNavigation();
    
    // Initial state
    updateCarouselState();
    
    // Setup intersection observer for entry animation
    setupEntryAnimation();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
    
    // Add touch/swipe support
    setupTouchNavigation(carousel);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    carousel.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">Projects loading...</p>';
  }
}

function createProjectCard(project, index) {
  const tagsHtml = project.tags.map(tag => 
    `<span class="project-tag">${tag}</span>`
  ).join('');
  
  // Create client HTML - make it a link if there's a valid link
  const clientHtml = project.link && project.link !== '#' 
    ? `<a href="${project.link}" class="project-client-link" target="_blank" rel="noopener noreferrer">${project.client}</a>`
    : project.client;
  
  return `
    <article class="project-card ${index === 0 ? 'active' : 'hidden'}" data-index="${index}" data-project-id="${project.id}">
      <div class="project-card-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="project-card-content">
        <span class="project-category">${project.category}</span>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-client">${clientHtml}</p>
        <p class="project-description">${project.description}</p>
        <div class="project-impact">
          <p class="project-impact-label">Impact</p>
          <p class="project-impact-value">${project.impact}</p>
        </div>
        <div class="project-tags">${tagsHtml}</div>
      </div>
    </article>
  `;
}

function setupCarouselNavigation() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigateCarousel(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigateCarousel(1));
  }
}

function navigateCarousel(direction) {
  const totalProjects = projectsData.length;
  const previousIndex = currentIndex;
  currentIndex = (currentIndex + direction + totalProjects) % totalProjects;
  updateCarouselState(direction);
}

function goToProject(index) {
  const direction = index > currentIndex ? 1 : -1;
  currentIndex = index;
  updateCarouselState(direction);
}

function updateCarouselState(direction = 0) {
  const cards = document.querySelectorAll('.project-card');
  const dots = document.querySelectorAll('.carousel-dot');
  const total = projectsData.length;
  const isMobile = window.innerWidth <= 700;
  
  cards.forEach((card, index) => {
    // Remove all state classes
    card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden', 'slide-from-left', 'slide-from-right');
    
    // Calculate position relative to current
    let diff = index - currentIndex;
    
    // Handle wrapping for circular carousel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    
    // Apply appropriate class based on position
    if (diff === 0) {
      card.classList.add('active');
      
      // Add mobile direction animation class
      if (isMobile && direction !== 0) {
        if (direction > 0) {
          card.classList.add('slide-from-right');
        } else {
          card.classList.add('slide-from-left');
        }
      }
    } else if (diff === -1) {
      card.classList.add('prev');
    } else if (diff === 1) {
      card.classList.add('next');
    } else if (diff === -2) {
      card.classList.add('far-prev');
    } else if (diff === 2) {
      card.classList.add('far-next');
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function setupEntryAnimation() {
  const section = document.querySelector('.projects-section');
  if (!section) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(section);
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const section = document.querySelector('.projects-section');
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      if (e.key === 'ArrowLeft') {
        navigateCarousel(-1);
      } else if (e.key === 'ArrowRight') {
        navigateCarousel(1);
      }
    }
  });
}

function setupTouchNavigation(carousel) {
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        navigateCarousel(1); // Swipe left = next
      } else {
        navigateCarousel(-1); // Swipe right = prev
      }
    }
  }
}

// Auto-play (optional - uncomment to enable)
// setInterval(() => navigateCarousel(1), 5000);
