// ===================================
// SITE LOADER
// Loads navigation and footer from JSON
// ===================================

class SiteLoader {
  constructor() {
    this.config = null;
    this.init();
  }

  async init() {
    try {
      await this.loadConfig();
      this.applyNavigation();
      this.applyFooter();
    } catch (error) {
      console.error('Error loading site config:', error);
    }
  }

  async loadConfig() {
    // Cache-bust to ensure fresh content
    const cacheBuster = `?v=${Date.now()}`;
    const response = await fetch('content/settings/site.json' + cacheBuster);
    if (!response.ok) {
      throw new Error('Could not load site config');
    }
    this.config = await response.json();
  }

  applyNavigation() {
    if (!this.config || !this.config.navigation) return;

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Clear existing links
    navLinks.innerHTML = '';

    // Add visible pages only
    this.config.navigation.pages
      .filter(page => page.visible !== false)
      .forEach(page => {
        const link = document.createElement('a');
        link.href = page.link;
        link.className = 'nav-link';
        link.textContent = page.name;
        
        // Mark current page as active
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (page.link === currentPage || 
            (page.link === 'index.html' && currentPage === '') ||
            (page.link.startsWith('#') && currentPage === 'index.html')) {
          link.classList.add('active');
        }
        
        navLinks.appendChild(link);
      });
  }

  applyFooter() {
    if (!this.config) return;

    // Apply brand tagline
    if (this.config.brand) {
      const taglineEl = document.querySelector('.footer-brand > p');
      if (taglineEl) {
        taglineEl.textContent = this.config.brand.tagline;
      }
    }

    // Apply footer contact info
    if (this.config.footer && this.config.footer.contact) {
      const contact = this.config.footer.contact;
      const contactDiv = document.querySelector('.footer-contact');
      if (contactDiv) {
        const emailLink = contactDiv.querySelector('a[href^="mailto:"]');
        if (emailLink) {
          emailLink.href = `mailto:${contact.email}`;
          emailLink.innerHTML = `📧 ${contact.email}`;
        }
        
        const paragraphs = contactDiv.querySelectorAll('p');
        paragraphs.forEach(p => {
          if (p.textContent.includes('📍')) {
            p.textContent = `📍 ${contact.location}`;
          }
          if (p.textContent.includes('🕒')) {
            p.textContent = `🕒 ${contact.hours}`;
          }
        });
      }
    }

    // Apply quick links (same as navigation but filtered)
    if (this.config.navigation) {
      const quickLinks = document.querySelector('.footer-links');
      if (quickLinks) {
        const linksContainer = quickLinks.querySelector('h4');
        if (linksContainer) {
          // Remove existing links after h4
          const existingLinks = quickLinks.querySelectorAll('a');
          existingLinks.forEach(link => link.remove());
          
          // Add visible pages
          this.config.navigation.pages
            .filter(page => page.visible !== false)
            .forEach(page => {
              const link = document.createElement('a');
              link.href = page.link;
              link.textContent = page.name;
              quickLinks.appendChild(link);
            });
        }
      }
    }

    // Apply copyright
    if (this.config.footer && this.config.footer.copyright) {
      const copyrightEl = document.querySelector('.footer-bottom p');
      if (copyrightEl) {
        copyrightEl.innerHTML = this.config.footer.copyright;
      }
    }

    // Apply social links
    if (this.config.footer && this.config.footer.social) {
      const social = this.config.footer.social;
      const githubLink = document.querySelector('.footer-social a[aria-label="GitHub"]');
      const linkedinLink = document.querySelector('.footer-social a[aria-label="LinkedIn"]');
      
      if (githubLink && social.github) {
        githubLink.href = social.github;
      }
      if (linkedinLink && social.linkedin) {
        linkedinLink.href = social.linkedin;
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.siteLoader = new SiteLoader();
});
