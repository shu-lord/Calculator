// ===================================
// ABOUT CONTENT LOADER
// Loads about page content from JSON with visibility support
// ===================================

class AboutContentLoader {
  constructor() {
    this.content = null;
    this.init();
  }

  async init() {
    try {
      await this.loadContent();
      this.applyContent();
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  }

  async loadContent() {
    const response = await fetch('content/about/content.json');
    if (!response.ok) {
      throw new Error('Could not load about content');
    }
    this.content = await response.json();
  }

  applyContent() {
    if (!this.content) return;
    
    this.applyHero();
    this.applyFounder();
    this.applyMission();
    this.applyValues();
  }

  applyHero() {
    const hero = this.content.hero;
    if (!hero) return;

    const titleEl = document.querySelector('.page-title');
    if (titleEl) {
      titleEl.innerHTML = `${hero.title} <span class="highlight">${hero.titleHighlight}</span>`;
    }

    const descEl = document.querySelector('.hero-section .section-description');
    if (descEl) {
      descEl.textContent = hero.description;
    }
  }

  applyFounder() {
    const founder = this.content.founder;
    if (!founder) return;

    const founderSection = document.querySelector('.founder-section');
    if (founderSection && founder.visible === false) {
      founderSection.style.display = 'none';
      return;
    }

    const nameEl = document.querySelector('.founder-name');
    if (nameEl) nameEl.textContent = founder.name;

    const titleEl = document.querySelector('.founder-title');
    if (titleEl) titleEl.textContent = founder.title;

    const bioEl = document.querySelector('.founder-bio');
    if (bioEl) bioEl.textContent = founder.bio;

    const imgEl = document.querySelector('.founder-image img');
    if (imgEl && founder.image) {
      imgEl.src = founder.image;
    }

    // Stats
    if (founder.stats) {
      const statItems = document.querySelectorAll('.founder-stats .stat-item');
      founder.stats.forEach((stat, index) => {
        if (statItems[index]) {
          if (stat.visible === false) {
            statItems[index].style.display = 'none';
            return;
          }
          const numEl = statItems[index].querySelector('.stat-number');
          const labelEl = statItems[index].querySelector('.stat-label');
          if (numEl) numEl.textContent = stat.number;
          if (labelEl) labelEl.textContent = stat.label;
        }
      });
    }
  }

  applyMission() {
    const mission = this.content.mission;
    if (!mission) return;

    const missionSection = document.querySelector('.mission-section');
    if (missionSection && mission.visible === false) {
      missionSection.style.display = 'none';
      return;
    }

    const titleEl = document.querySelector('.mission-title');
    if (titleEl) titleEl.textContent = mission.title;

    const descEl = document.querySelector('.mission-description');
    if (descEl) descEl.textContent = mission.description;
  }

  applyValues() {
    if (!this.content.values) return;

    const valuesGrid = document.querySelector('.values-grid');
    if (!valuesGrid) return;

    const valueCards = valuesGrid.querySelectorAll('.value-card');
    this.content.values.forEach((value, index) => {
      if (valueCards[index]) {
        if (value.visible === false) {
          valueCards[index].style.display = 'none';
          return;
        }
        const titleEl = valueCards[index].querySelector('h3');
        const descEl = valueCards[index].querySelector('p');
        if (titleEl) titleEl.textContent = value.title;
        if (descEl) descEl.textContent = value.description;
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.about-page')) {
    window.aboutContentLoader = new AboutContentLoader();
  }
});
