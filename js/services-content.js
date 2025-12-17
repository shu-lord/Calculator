// ===================================
// SERVICES CONTENT LOADER
// Loads services content from JSON with visibility support
// ===================================

class ServicesContentLoader {
  constructor() {
    this.content = null;
    this.init();
  }

  async init() {
    try {
      await this.loadContent();
      this.applyContent();
    } catch (error) {
      console.error('Error loading services content:', error);
    }
  }

  async loadContent() {
    const response = await fetch('content/services/content.json');
    if (!response.ok) {
      throw new Error('Could not load services content');
    }
    this.content = await response.json();
  }

  applyContent() {
    if (!this.content) return;
    
    this.applyHero();
    this.applyServices();
    this.applyCTA();
  }

  applyHero() {
    const hero = this.content.hero;
    if (!hero) return;

    const titleEl = document.querySelector('.page-title');
    if (titleEl) {
      titleEl.innerHTML = `${hero.title} <span class="highlight">${hero.titleHighlight}</span>`;
    }

    const descEl = document.querySelector('.services-hero .section-description');
    if (descEl) {
      descEl.textContent = hero.description;
    }
  }

  applyServices() {
    if (!this.content.services) return;

    this.content.services.forEach(service => {
      const section = document.getElementById(service.id);
      if (!section) return;

      // Check visibility
      if (service.visible === false) {
        section.style.display = 'none';
        return;
      }

      // Title
      const titleEl = section.querySelector('.service-detail-title');
      if (titleEl) {
        titleEl.innerHTML = `${service.title} <span class="highlight">${service.titleHighlight}</span>`;
      }

      // Description
      const descEl = section.querySelector('.service-detail-description');
      if (descEl) {
        descEl.textContent = service.description;
      }

      // Features
      if (service.features) {
        const featuresList = section.querySelector('.service-features');
        if (featuresList) {
          featuresList.innerHTML = service.features
            .map(feature => `<li>${feature}</li>`)
            .join('');
        }
      }

      // Stats
      if (service.stats) {
        const statsContainer = section.querySelector('.service-stats');
        if (statsContainer) {
          statsContainer.innerHTML = service.stats
            .map(stat => `
              <div class="service-stat">
                <div class="service-stat-number">${stat.number}</div>
                <div class="service-stat-label">${stat.label}</div>
              </div>
            `)
            .join('');
        }
      }
    });
  }

  applyCTA() {
    const cta = this.content.cta;
    if (!cta) return;

    const titleEl = document.querySelector('.cta-title');
    if (titleEl) titleEl.textContent = cta.title;

    const descEl = document.querySelector('.cta-description');
    if (descEl) descEl.textContent = cta.description;

    if (cta.primaryButton) {
      const btn = document.querySelector('.cta-buttons .btn-primary');
      if (btn) {
        btn.textContent = cta.primaryButton.text;
        btn.href = cta.primaryButton.link;
      }
    }

    if (cta.secondaryButton) {
      const btn = document.querySelector('.cta-buttons .btn-secondary');
      if (btn) {
        btn.textContent = cta.secondaryButton.text;
        btn.href = cta.secondaryButton.link;
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.services-hero')) {
    window.servicesContentLoader = new ServicesContentLoader();
  }
});
