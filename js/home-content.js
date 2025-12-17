// ===================================
// HOME CONTENT LOADER
// Loads home page content from JSON (Netlify CMS)
// Supports visibility toggles for sections and cards
// ===================================

class HomeContentLoader {
  constructor() {
    this.content = null;
    this.init();
  }

  async init() {
    try {
      await this.loadContent();
      this.applyContent();
    } catch (error) {
      console.error('Error loading home content:', error);
      // Content will use HTML defaults if JSON fails
    }
  }

  async loadContent() {
    // Cache-bust to ensure fresh content
    const cacheBuster = `?v=${Date.now()}`;
    const response = await fetch('content/home/content.json' + cacheBuster);
    if (!response.ok) {
      throw new Error('Could not load home content');
    }
    this.content = await response.json();
  }

  applyContent() {
    if (!this.content) return;

    this.applyHero();
    this.applyAbout();
    this.applyPurpose();
    this.applyResources();
    this.applyContact();
  }

  applyHero() {
    const hero = this.content.hero;
    if (!hero) return;

    const heroSection = document.getElementById('hero');
    if (heroSection && hero.visible === false) {
      heroSection.style.display = 'none';
      return;
    }

    // Title
    const titleEl = document.querySelector('.hero-title .glitch');
    if (titleEl) {
      titleEl.textContent = hero.title;
      titleEl.setAttribute('data-text', hero.title);
    }

    // Subtitle
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl) subtitleEl.textContent = hero.subtitle;

    // Description
    const descEl = document.querySelector('.hero-description');
    if (descEl) descEl.textContent = hero.description;

    // Buttons
    if (hero.primaryButton) {
      const primaryBtn = document.querySelector('.hero-buttons .btn-primary');
      if (primaryBtn) {
        primaryBtn.textContent = hero.primaryButton.text;
        primaryBtn.href = hero.primaryButton.link;
      }
    }

    if (hero.secondaryButton) {
      const secondaryBtn = document.querySelector('.hero-buttons .btn-secondary');
      if (secondaryBtn) {
        secondaryBtn.textContent = hero.secondaryButton.text;
        secondaryBtn.href = hero.secondaryButton.link;
      }
    }
  }

  applyAbout() {
    const about = this.content.about;
    if (!about) return;

    const aboutSection = document.getElementById('about');
    if (aboutSection && about.visible === false) {
      aboutSection.style.display = 'none';
      return;
    }

    // Section title
    const titleEl = document.querySelector('#about .section-title');
    if (titleEl) {
      titleEl.innerHTML = `${about.sectionTitle} <span class="highlight">${about.sectionTitleHighlight}</span>`;
    }

    // Name and job title in intro text
    const nameEl = document.querySelector('#about [itemprop="name"]');
    if (nameEl) nameEl.textContent = about.name;

    const jobEl = document.querySelector('#about [itemprop="jobTitle"]');
    if (jobEl) jobEl.textContent = about.jobTitle;

    const orgEl = document.querySelector('#about [itemprop="affiliation"]');
    if (orgEl) orgEl.textContent = about.organization;

    // Profile image
    const imgEl = document.querySelector('#about .profile-img');
    if (imgEl && about.profileImage) {
      imgEl.src = about.profileImage;
    }

    // Stats - with visibility support
    if (about.stats && about.stats.length > 0) {
      const statItems = document.querySelectorAll('#about .stat-item');
      about.stats.forEach((stat, index) => {
        if (statItems[index]) {
          // Check visibility
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

  applyPurpose() {
    const purpose = this.content.purpose;
    if (!purpose) return;

    const purposeSection = document.getElementById('purpose');
    if (purposeSection && purpose.visible === false) {
      purposeSection.style.display = 'none';
      return;
    }

    // Section title
    const titleEl = document.querySelector('#purpose .section-title');
    if (titleEl) {
      titleEl.innerHTML = `${purpose.sectionTitle} <span class="highlight">${purpose.sectionTitleHighlight}</span>`;
    }

    // Description
    const descEl = document.querySelector('#purpose .section-description');
    if (descEl) descEl.textContent = purpose.description;

    // Cards - with visibility support
    if (purpose.cards && purpose.cards.length > 0) {
      const cardEls = document.querySelectorAll('#purpose .purpose-card');
      purpose.cards.forEach((card, index) => {
        if (cardEls[index]) {
          // Check visibility
          if (card.visible === false) {
            cardEls[index].style.display = 'none';
            return;
          }
          
          const titleEl = cardEls[index].querySelector('h3');
          const descEl = cardEls[index].querySelector('p');
          if (titleEl) titleEl.textContent = card.title;
          if (descEl) descEl.textContent = card.description;
        }
      });
    }
  }

  applyResources() {
    const resources = this.content.resources;
    if (!resources) return;

    const resourcesSection = document.getElementById('resources');
    if (resourcesSection && resources.visible === false) {
      resourcesSection.style.display = 'none';
      return;
    }

    // Section title
    const titleEl = document.querySelector('#resources .section-title');
    if (titleEl) {
      titleEl.innerHTML = `${resources.sectionTitle} <span class="highlight">${resources.sectionTitleHighlight}</span>`;
    }

    // Description
    const descEl = document.querySelector('#resources .section-description');
    if (descEl) descEl.textContent = resources.description;

    // Resource cards - with visibility support
    if (resources.cards && resources.cards.length > 0) {
      const cardEls = document.querySelectorAll('#resources .resource-card');
      resources.cards.forEach((card, index) => {
        if (cardEls[index]) {
          // Check visibility
          if (card.visible === false) {
            cardEls[index].style.display = 'none';
            return;
          }
          
          const titleEl = cardEls[index].querySelector('h3');
          const descEl = cardEls[index].querySelector('p');
          const linkEl = cardEls[index].querySelector('.resource-link');
          
          if (titleEl) titleEl.textContent = card.title;
          if (descEl) descEl.textContent = card.description;
          if (linkEl) linkEl.textContent = card.linkText;
          if (card.link) cardEls[index].href = card.link;
        }
      });
    }
  }

  applyContact() {
    const contact = this.content.contact;
    if (!contact) return;

    const contactSection = document.getElementById('contact');
    if (contactSection && contact.visible === false) {
      contactSection.style.display = 'none';
      return;
    }

    // Section title
    const titleEl = document.querySelector('#contact .section-title');
    if (titleEl) {
      titleEl.innerHTML = `${contact.sectionTitle} <span class="highlight">${contact.sectionTitleHighlight}</span>`;
    }

    // Description
    const descEl = document.querySelector('#contact .section-description');
    if (descEl) descEl.textContent = contact.description;

    // Email
    const emailBtn = document.querySelector('#contact .contact-email');
    if (emailBtn && contact.email) {
      emailBtn.href = `mailto:${contact.email}`;
      const emailText = emailBtn.querySelector('span:not(.btn-arrow)');
      if (emailText) emailText.textContent = contact.email;
    }

    // Social links
    if (contact.socialLinks) {
      const githubLink = document.querySelector('#contact a[href*="github"]');
      const linkedinLink = document.querySelector('#contact a[href*="linkedin"]');
      
      if (githubLink && contact.socialLinks.github) {
        githubLink.href = contact.socialLinks.github;
      }
      if (linkedinLink && contact.socialLinks.linkedin) {
        linkedinLink.href = contact.socialLinks.linkedin;
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on home page
  if (document.getElementById('hero')) {
    window.homeContentLoader = new HomeContentLoader();
  }
});
