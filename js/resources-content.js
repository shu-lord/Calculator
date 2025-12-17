// ===================================
// RESOURCES CONTENT LOADER
// Loads resources content from JSON with visibility support
// ===================================

class ResourcesContentLoader {
  constructor() {
    this.content = null;
    this.init();
  }

  async init() {
    try {
      await this.loadContent();
      this.applyContent();
    } catch (error) {
      console.error('Error loading resources content:', error);
    }
  }

  async loadContent() {
    const response = await fetch('content/resources/content.json');
    if (!response.ok) {
      throw new Error('Could not load resources content');
    }
    this.content = await response.json();
  }

  applyContent() {
    if (!this.content) return;
    
    this.applyHero();
    this.applyCategories();
  }

  applyHero() {
    const hero = this.content.hero;
    if (!hero) return;

    const titleEl = document.querySelector('.page-title');
    if (titleEl) {
      titleEl.innerHTML = `${hero.title} <span class="highlight">${hero.titleHighlight}</span>`;
    }

    const descEl = document.querySelector('.resources-hero .section-description');
    if (descEl) {
      descEl.textContent = hero.description;
    }
  }

  applyCategories() {
    if (!this.content.categories) return;

    const categorySections = document.querySelectorAll('.resource-category');
    this.content.categories.forEach((category, index) => {
      if (categorySections[index]) {
        if (category.visible === false) {
          categorySections[index].style.display = 'none';
          return;
        }

        const titleEl = categorySections[index].querySelector('.category-title');
        if (titleEl) titleEl.textContent = category.title;

        // Apply resources in this category
        if (category.resources) {
          const resourceCards = categorySections[index].querySelectorAll('.resource-card');
          category.resources.forEach((resource, rIndex) => {
            if (resourceCards[rIndex]) {
              if (resource.visible === false) {
                resourceCards[rIndex].style.display = 'none';
                return;
              }
              
              const titleEl = resourceCards[rIndex].querySelector('h3');
              const descEl = resourceCards[rIndex].querySelector('p');
              const linkEl = resourceCards[rIndex].querySelector('.resource-link');
              
              if (titleEl) titleEl.textContent = resource.title;
              if (descEl) descEl.textContent = resource.description;
              if (linkEl) linkEl.textContent = resource.linkText;
              if (resource.link) resourceCards[rIndex].href = resource.link;
            }
          });
        }
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.resources-page')) {
    window.resourcesContentLoader = new ResourcesContentLoader();
  }
});
