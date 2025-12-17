# 🔴 AI RedCell - Website Documentation

> **Sri Lanka's First AI Red Teaming & Vulnerability Research Agency**  
> Website: [airedcell.dev](https://www.airedcell.dev)  
> Founder: Shehan Nilukshan  
> Location: Sri Lanka

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Features & Functionality](#2-features--functionality)
3. [Tech Stack](#3-tech-stack)
4. [File & Folder Structure](#4-file--folder-structure)
5. [Design System](#5-design-system)
6. [SEO Configuration](#6-seo-configuration)
7. [Content System (Netlify CMS)](#7-content-system-netlify-cms)
8. [Templates & Layouts](#8-templates--layouts)
9. [JavaScript Logic Deep Dive](#9-javascript-logic-deep-dive)
10. [Performance & Optimization](#10-performance--optimization)
11. [Deployment Notes](#11-deployment-notes)
12. [Troubleshooting Guide](#12-troubleshooting-guide)
13. [Future Improvements](#13-future-improvements)
14. [Licenses & Credits](#14-licenses--credits)

---

# 1. Project Overview

## Project Name

**AI RedCell** - Sri Lanka's First AI Red Teaming & Vulnerability Research Agency

## What We Are

AI RedCell is Sri Lanka's pioneering AI red teaming agency, providing:

- **AI Red Teaming Services**: Adversarial testing of AI systems for enterprises
- **Vulnerability Research**: Discovering security weaknesses in LLMs and AI models
- **Prompt Injection Defense**: Helping teams build more secure AI systems
- **Security Consulting**: Expert guidance for AI model trainers and creators
- **Educational Courses**: Free learning resources on AI security

## Purpose & Goals

AI RedCell serves as both a professional agency and learning platform:

- Providing AI red teaming solutions to model trainers, creators, and enterprises
- Researching AI vulnerabilities through ethical jailbreaking and security testing
- Educating the community on AI security best practices
- Building a safer AI ecosystem through responsible disclosure

## Target Audience

| Audience               | Needs Addressed                                 |
| ---------------------- | ----------------------------------------------- |
| AI Model Trainers      | Security testing, vulnerability assessment      |
| AI Creators & Startups | Red teaming solutions, prompt injection defense |
| Enterprises            | AI security consulting, compliance testing      |
| Security Researchers   | Research resources, methodology guides          |
| Students               | Free courses, learning paths, certifications    |

## Core Value Proposition

> "Sri Lanka's first AI red teaming agency - we discover AI vulnerabilities before malicious actors can exploit them."

**Problems Solved:**

- Organizations need AI security testing before deployment
- Lack of specialized AI red teaming services in the region
- Gap between AI development and security awareness
- Need for structured education on AI security

---

# 2. Features & Functionality

## 2.1 Frontend UI Components

### Navigation Bar

| Feature          | Description                           | File             |
| ---------------- | ------------------------------------- | ---------------- |
| Fixed navbar     | Stays at top on scroll                | `css/styles.css` |
| Logo             | Text-based "AI RedCell" with gradient | `index.html`     |
| Nav links        | Home, About, Resources, Learning      | All HTML files   |
| Mobile hamburger | Animated toggle button                | `js/script.js`   |

### Hero Section

| Feature               | Description                      | File                           |
| --------------------- | -------------------------------- | ------------------------------ |
| Matrix rain animation | Canvas-based falling characters  | `js/script.js`, `js/matrix.js` |
| Glitch text effect    | CSS animation on title           | `css/styles.css`               |
| CTA buttons           | "Start Learning", "Get Involved" | `index.html`                   |
| Scroll indicator      | Animated mouse icon              | `css/styles.css`               |

### Content Sections

| Section   | Purpose                             | CMS Editable |
| --------- | ----------------------------------- | ------------ |
| About Me  | Personal bio, stats, profile image  | ✅ Yes       |
| Purpose   | What is AI Jailbreaking (3 cards)   | ✅ Yes       |
| Resources | External links (GitHub, Wiki, etc.) | ✅ Yes       |
| Contact   | Email, social links, contact form   | ✅ Yes       |

### Footer

| Element      | Description       |
| ------------ | ----------------- |
| Copyright    | Year + AI RedCell |
| Social icons | GitHub, LinkedIn  |

---

## 2.2 Interactive Elements

### Contact Form

```
Location: index.html (line ~650)
Handler: js/script.js (lines 180-200)
Backend: FormSubmit.co (external service)
```

**How it works:**

1. User fills form fields (name, email, message)
2. Form submits to FormSubmit.co endpoint
3. Button shows "Sending..." state
4. Redirects to thank-you or shows success

### Course Filtering

```
Location: learning.html
Handler: js/learning.js (lines 6-46)
```

**Filter buttons:** All, Beginner, Intermediate, Advanced

- Filters course cards by `data-difficulty` attribute
- Animates cards in/out with opacity/transform

### Mobile Sidebar (Course Page)

```
Location: course.html
Handler: js/course-loader.js (lines 430-480)
CSS: css/mobile-responsive.css
```

**Features:**

- Slide-out drawer from left
- Overlay backdrop
- Close on module selection
- Close on Escape key

---

## 2.3 Dynamic JavaScript Functions

### Matrix Rain Animation

```javascript
// File: js/script.js (lines 1-80)
// Creates falling character effect on canvas
// Uses gradient colors (#ff0040 to #ff6b35)
// Updates at 50ms intervals
```

### Cursor Trail Effect (Desktop Only)

```javascript
// File: js/script.js (lines 462-520)
// Creates red particle trail following mouse
// Only loads on devices > 768px width
// Uses separate canvas layer
```

### Progress Tracking

```javascript
// File: js/learning.js (LearningProgress class)
// Stores completed modules in localStorage
// Key: "aiRedCellProgress"
// Updates progress bar in real-time
```

### Quiz System

```javascript
// File: js/quiz.js (SimpleQuiz class)
// Handles multiple-choice questions
// Shows correct/incorrect feedback
// Saves results to localStorage
```

---

## 2.4 Course System

### Course Listing Page (`learning.html`)

- Displays all enabled courses from CMS
- Filter by difficulty level
- Shows progress percentage per course
- Course cards link to individual course pages

### Course View Page (`course.html`)

- Sidebar with module list
- Main content area with markdown rendering
- Quiz section at end of modules
- Progress tracking with "Mark Complete" button
- Next/Previous navigation

### Course Content Structure

```
content/courses/
├── index.json           # Course order/list
├── prompt-engineering.json
├── jailbreaking-ethics.json
├── prompt-injection.json
└── security-testing.json
```

---

# 3. Tech Stack

## Core Technologies

| Technology  | Version | Purpose                         |
| ----------- | ------- | ------------------------------- |
| HTML5       | -       | Structure, semantic markup      |
| CSS3        | -       | Styling, animations, responsive |
| JavaScript  | ES6+    | Interactivity, DOM manipulation |
| Netlify CMS | 2.x     | Content management              |

## CSS Architecture

```
css/
├── styles.css           # Main styles (31KB)
├── course-clean.css     # Course page styles (12KB)
├── mobile-responsive.css # Mobile breakpoints (18KB)
├── mobile-premium.css   # Premium mobile effects (13KB)
├── smooth-transitions.css # Animation utilities (2KB)
└── overflow-fixes.css   # Layout fixes (1KB)
```

**CSS Methodology:** Custom CSS with CSS Variables (not BEM/SCSS)

## JavaScript Architecture

```
js/
├── script.js         # Main homepage JS (21KB)
├── learning.js       # Learning page logic (12KB)
├── course-loader.js  # Course page loader (16KB)
├── course-cards.js   # Card rendering (6KB)
├── quiz.js          # Quiz system (9KB)
├── home-content.js  # CMS content loader (7KB)
└── matrix.js        # Matrix effect (3KB)
```

## External Dependencies

| Resource         | CDN/Source           | Purpose                  |
| ---------------- | -------------------- | ------------------------ |
| Google Fonts     | fonts.googleapis.com | Orbitron, Rajdhani fonts |
| FormSubmit       | formsubmit.co        | Contact form backend     |
| Netlify Identity | netlify.com          | CMS authentication       |

## No Build Tools Required

This is a **static site** - no npm, webpack, or build step needed.

---

# 4. File & Folder Structure

```
ai-redcell.github.io-website/
│
├── 📄 index.html              # Homepage
├── 📄 learning.html           # Course listing page
├── 📄 course.html             # Individual course view
├── 📄 404.html                # Error page
│
├── 📂 css/                    # Stylesheets
│   ├── styles.css             # Main styles, variables, components
│   ├── course-clean.css       # Course-specific styles
│   ├── mobile-responsive.css  # Media queries, mobile nav
│   ├── mobile-premium.css     # Mobile enhancements
│   ├── smooth-transitions.css # Transition utilities
│   └── overflow-fixes.css     # Overflow handling
│
├── 📂 js/                     # JavaScript
│   ├── script.js              # Homepage: nav, animations, form
│   ├── learning.js            # Course filtering, progress
│   ├── course-loader.js       # Course content rendering
│   ├── course-cards.js        # Dynamic course cards
│   ├── quiz.js                # Quiz functionality
│   ├── home-content.js        # Load CMS content to homepage
│   └── matrix.js              # Matrix rain (standalone)
│
├── 📂 content/                # CMS Content (JSON)
│   ├── 📂 courses/            # Course data
│   │   ├── index.json         # Course list/order
│   │   ├── prompt-engineering.json
│   │   ├── jailbreaking-ethics.json
│   │   ├── prompt-injection.json
│   │   └── security-testing.json
│   ├── 📂 home/               # Homepage content
│   │   └── content.json       # Hero, About, Purpose, Resources, Contact
│   └── 📂 settings/           # Site settings
│       └── general.json       # Site title, description
│
├── 📂 admin/                  # Netlify CMS
│   ├── index.html             # CMS interface
│   └── config.yml             # CMS configuration
│
├── 📂 images/                 # Media assets
│   ├── logo.png               # Site logo (862KB - NEEDS COMPRESSION)
│   ├── my-img.png             # Profile photo (2.6MB - NEEDS COMPRESSION)
│   └── 📂 courses/            # Course thumbnails
│
├── 📄 robots.txt              # Crawler instructions
├── 📄 sitemap.xml             # Site map for SEO
├── 📄 llms.txt                # AI model information file
├── 📄 netlify.toml            # Netlify configuration
├── 📄 .editorconfig           # Editor settings
├── 📄 .gitignore              # Git ignore rules
├── 📄 LICENSE                 # MIT License
└── 📄 README.md               # This file
```

---

# 5. Design System

## 5.1 Color Palette

| Variable             | Hex                     | Usage                                |
| -------------------- | ----------------------- | ------------------------------------ |
| `--primary-red`      | `#ff0040`               | Primary actions, accents, highlights |
| `--secondary-orange` | `#ff6b35`               | Secondary accents, gradients         |
| `--accent-purple`    | `#a855f7`               | Tertiary accent, hover states        |
| `--dark-bg`          | `#0a0a0f`               | Main background                      |
| `--darker-bg`        | `#050508`               | Sections, cards background           |
| `--card-bg`          | `rgba(20, 20, 30, 0.8)` | Card backgrounds                     |
| `--text-primary`     | `#ffffff`               | Headings, primary text               |
| `--text-secondary`   | `#b0b0c0`               | Body text, descriptions              |

## 5.2 Gradients

```css
--gradient-1: linear-gradient(135deg, #ff0040, #ff6b35); /* Primary */
--gradient-2: linear-gradient(135deg, #ff6b35, #a855f7); /* Secondary */
--gradient-3: linear-gradient(135deg, #ff0040, #a855f7); /* Accent */
```

## 5.3 Typography

| Font     | Family                | Usage                  |
| -------- | --------------------- | ---------------------- |
| Orbitron | `var(--font-heading)` | Headings, logo, titles |
| Rajdhani | `var(--font-body)`    | Body text, paragraphs  |

**Font Weights:**

- Orbitron: 400, 700, 900
- Rajdhani: 300, 400, 600, 700

## 5.4 Spacing System

| Size | Value         | Usage            |
| ---- | ------------- | ---------------- |
| xs   | 0.25rem (4px) | Tight spacing    |
| sm   | 0.5rem (8px)  | Small gaps       |
| md   | 1rem (16px)   | Standard spacing |
| lg   | 2rem (32px)   | Section padding  |
| xl   | 4rem (64px)   | Large sections   |

## 5.5 Breakpoints

| Breakpoint | Width   | Usage                 |
| ---------- | ------- | --------------------- |
| Mobile     | ≤480px  | Small phones          |
| Tablet     | ≤768px  | Tablets, large phones |
| Desktop    | >768px  | Desktop screens       |
| Large      | >1200px | Wide screens          |

## 5.6 Component Styles

### Buttons

```css
.btn-primary {
  background: var(--gradient-1);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
}

.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary-red);
  color: var(--primary-red);
}
```

### Cards

```css
.card {
  background: var(--card-bg);
  border: 1px solid rgba(255, 0, 64, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}
```

### Shadows

```css
/* Card shadow */
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

/* Glow effect */
box-shadow: 0 0 30px rgba(255, 0, 64, 0.3);
```

---

# 6. SEO Configuration

## 6.1 Brand Positioning

> **AI RedCell is Sri Lanka's first AI red teaming and vulnerability research agency.**

### Key SEO Messages

- First AI red teaming agency in Sri Lanka
- Provides AI security solutions to model trainers, creators, and enterprises
- Specializes in prompt injection defense and vulnerability research
- Founded by Shehan Nilukshan, AI Red Teamer

### Target Keywords

```
Primary: AI red teaming Sri Lanka, AI vulnerability research, AI security agency
Secondary: Shehan Nilukshan, AI RedCell, AI penetration testing
Long-tail: AI red teaming solutions, prompt injection defense, LLM security
```

## 6.2 Meta Tags

```html
<!-- Primary -->
<title>
  AI RedCell | Sri Lanka's First AI Red Teaming & Vulnerability Research Agency
</title>
<meta
  name="description"
  content="AI RedCell is Sri Lanka's first AI red teaming and vulnerability research agency. We provide AI security testing, prompt injection defense, and red teaming solutions to AI model trainers, creators, and enterprises worldwide."
/>
<meta
  name="keywords"
  content="AI red teaming Sri Lanka, AI vulnerability research, AI security agency, Shehan Nilukshan, AI RedCell, AI penetration testing, prompt injection defense, LLM security, AI model security, machine learning red team, AI safety consulting"
/>
<meta name="author" content="Shehan Nilukshan" />
<meta name="robots" content="index, follow" />
```

## 6.3 Open Graph (Facebook/LinkedIn)

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.airedcell.dev/" />
<meta
  property="og:title"
  content="AI RedCell | Sri Lanka's First AI Red Teaming Agency"
/>
<meta
  property="og:description"
  content="Sri Lanka's first AI red teaming and vulnerability research agency. We provide AI security testing, prompt injection defense, and red teaming solutions to AI model trainers and creators worldwide."
/>
<meta property="og:image" content="https://www.airedcell.dev/images/logo.png" />
<meta property="og:site_name" content="AI RedCell" />
```

## 6.4 Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta
  name="twitter:title"
  content="AI RedCell | Sri Lanka's First AI Red Teaming Agency"
/>
<meta
  name="twitter:description"
  content="Sri Lanka's first AI red teaming agency. AI security testing, prompt injection defense, and red teaming solutions for AI model trainers and creators."
/>
<meta
  name="twitter:image"
  content="https://www.airedcell.dev/images/logo.png"
/>
<meta name="twitter:creator" content="@AIRedCell" />
```

## 6.5 Structured Data (JSON-LD)

| Schema Type             | Purpose                                              | Location     |
| ----------------------- | ---------------------------------------------------- | ------------ |
| Person                  | Shehan Nilukshan (Founder, AI Red Teamer)            | `index.html` |
| Organization            | AI RedCell (Sri Lanka's first AI red teaming agency) | `index.html` |
| WebSite                 | Site metadata                                        | `index.html` |
| FAQPage                 | Questions about AI red teaming, services             | `index.html` |
| EducationalOrganization | Course provider info                                 | `index.html` |

### Organization Schema Details

```json
{
  "@type": "Organization",
  "name": "AI RedCell",
  "description": "Sri Lanka's first AI red teaming and vulnerability research agency. We provide AI security testing, prompt injection defense, and red teaming solutions to AI model trainers, creators, and enterprises worldwide.",
  "address": {
    "addressCountry": "Sri Lanka"
  }
}
```

## 6.6 sitemap.xml

```xml
Includes:
- Homepage (priority 1.0)
- Learning page (priority 0.9)
- All course pages (priority 0.8)
```

## 6.7 robots.txt

```
User-agent: *
Allow: /

# AI Crawlers explicitly allowed
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

Sitemap: https://www.airedcell.dev/sitemap.xml
```

## 6.8 llms.txt (AI Optimization)

Special file for AI models containing:

- **Agency Identity**: Sri Lanka's first AI red teaming agency
- **Services**: AI red teaming, vulnerability research, prompt injection defense
- **Target Clients**: AI model trainers, creators, enterprises
- **Founder Information**: Shehan Nilukshan, AI Red Teamer
- **Available Courses**: Prompt engineering, jailbreaking ethics, security testing
- **FAQ Answers**: Common questions about AI red teaming and services
- **Contact Details**: Emails, social links, location (Sri Lanka)

---

# 7. Content System (Netlify CMS)

## 7.1 Configuration Overview

**File:** `admin/config.yml`

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "images"
public_folder: "/images"
site_url: "https://www.airedcell.dev"
```

## 7.2 Collections

### Courses Collection

```yaml
- name: "courses"
  folder: "content/courses"
  create: true
  delete: true
  extension: "json"

  fields:
    - enabled (boolean)
    - title (string)
    - slug (string)
    - description (text)
    - thumbnail (image)
    - difficulty (select)
    - duration (string)
    - category (select)
    - modules (list)
      - order, title, content (markdown)
      - images (list)
      - quiz (object with questions)
```

### Home Content

```yaml
- name: "home-content"
  file: "content/home/content.json"

  sections:
    - hero (title, subtitle, buttons)
    - about (name, bio, stats, image)
    - purpose (cards)
    - resources (cards with links)
    - contact (email, social)
```

### Settings

```yaml
- name: "general"
  file: "content/settings/general.json"

  fields:
    - siteTitle
    - siteDescription
```

## 7.3 What CAN Be Edited via CMS

| Content       | Location                | How           |
| ------------- | ----------------------- | ------------- |
| Courses (all) | Admin → Courses         | Full CRUD     |
| Hero section  | Admin → Settings → Home | All fields    |
| About section | Admin → Settings → Home | All fields    |
| Purpose cards | Admin → Settings → Home | All 3 cards   |
| Resources     | Admin → Settings → Home | All links     |
| Contact info  | Admin → Settings → Home | Email, social |

## 7.4 What CANNOT Be Edited via CMS

| Content          | Reason    | How to Edit     |
| ---------------- | --------- | --------------- |
| Navigation links | Hardcoded | Edit HTML files |
| Footer           | Hardcoded | Edit HTML files |
| 404 page         | Static    | Edit 404.html   |
| CSS styles       | Code      | Edit CSS files  |
| Page structure   | Code      | Edit HTML files |

## 7.5 CMS Login Setup

1. Enable Netlify Identity (Site Settings → Identity)
2. Enable Git Gateway (Identity → Services)
3. Set registration to "Invite only"
4. Invite yourself via email
5. Access CMS at `/admin/`

---

# 8. Templates & Layouts

## 8.1 Homepage Template

```
index.html
├── <head> - Meta tags, CSS, JSON-LD schemas
├── <nav> - Navigation bar
├── #hero - Hero section with canvas
├── #about - About section
├── #purpose - Purpose cards
├── #resources - Resource links
├── #contact - Contact form
├── <footer>
└── <script> - JS files
```

**Content Source:** `content/home/content.json` via `js/home-content.js`

## 8.2 Learning Page Template

```
learning.html
├── <head>
├── <nav>
├── #learning-hero - Page header
├── .filter-buttons - Difficulty filters
├── .courses-grid - Course cards (dynamic)
└── <script>
```

**Content Source:** `content/courses/index.json` via `js/course-cards.js`

## 8.3 Course Page Template

```
course.html
├── <head>
├── <nav>
├── .breadcrumb - Navigation trail
├── .course-layout
│   ├── .course-sidebar - Module list
│   └── .course-main - Content area
│       ├── .module-content - Markdown
│       └── #quizSection - Quiz
└── <script>
```

**Content Source:** `content/courses/[slug].json` via `js/course-loader.js`

## 8.4 Reusable Components

| Component      | Used In         | CSS Class                       |
| -------------- | --------------- | ------------------------------- |
| Navbar         | All pages       | `.navbar`                       |
| Buttons        | All pages       | `.btn`, `.btn-primary`          |
| Cards          | Multiple        | `.purpose-card`, `.course-card` |
| Section titles | Index           | `.section-title`                |
| Matrix canvas  | Index, Learning | `#matrix-canvas`                |

---

# 9. JavaScript Logic Deep Dive

## 9.1 script.js (Main Homepage)

### Matrix Animation (Lines 1-80)

```javascript
Purpose: Creates falling character rain effect
Canvas: #matrix-canvas
Characters: A-Z, 0-9, symbols
Color: Gradient from #ff0040 to #ff6b35
Frame rate: 50ms intervals
Resize: Recalculates on window resize
```

### Mobile Navigation (Lines 82-120)

```javascript
Elements: .hamburger, .nav-links
Actions:
  - Toggle .active class on click
  - Animate hamburger spans (rotate/fade)
  - Update aria-expanded attribute
  - Close on link click
  - Close on outside click
  - Close on Escape key
```

### Smooth Scroll (Lines 125-141)

```javascript
Selector: a[href^="#"]
Offset: 80px (for fixed navbar)
Behavior: smooth
```

### Contact Form (Lines 175-200)

```javascript
Element: .contact-form
Actions:
  - Show loading state on submit
  - Disable button
  - Let FormSubmit handle redirect
  - Reset after 5 seconds (fallback)
```

### Cursor Trail (Lines 462-520)

```javascript
Condition: Desktop only (width > 768px)
Canvas: Dynamically created
Trail: 10 points maximum
Color: rgba(255, 0, 64, 0.5)
Animation: requestAnimationFrame
```

## 9.2 learning.js

### Course Filtering (Lines 6-46)

```javascript
Buttons: .filter-btn
Cards: .course-card
Logic:
  - Click button → toggle .active
  - Filter by data-difficulty attribute
  - Animate cards in/out
```

### LearningProgress Class (Lines 49-129)

```javascript
Storage key: "aiRedCellProgress"
Methods:
  - loadProgress() - Get from localStorage
  - saveProgress() - Save to localStorage
  - markModuleComplete(courseId, moduleIndex)
  - getProgress(courseId)
  - getProgressPercentage(courseId, total)
  - updateProgressDisplay(courseId)
```

### Module Navigation (Lines 134-225)

```javascript
Elements: .module-item, #nextModule, #prevModule
Actions:
  - Load module by index
  - Update currentModuleIndex
  - Fade transition on navigation
```

## 9.3 course-loader.js

### CourseLoader Class

````javascript
init():
  - Get course ID from URL
  - Fetch course JSON
  - Render sidebar and content

renderSidebar():
  - Create module list HTML
  - Show progress bar
  - Highlight active module

loadModule(index):
  - Get module from course data
  - Render markdown content
  - Load quiz if exists
  - Update URL parameter

renderMarkdown(content):
  - Convert ## to <h2>
  - Convert ** to <strong>
  - Convert ``` to <code>
  - Convert - to <li>
````

## 9.4 quiz.js

### SimpleQuiz Class

```javascript
Constructor:
  - Initialize elements
  - Bind events
  - Set current question to 0

submitAnswer():
  - Get selected option
  - Check against correctIndex
  - Show feedback
  - Highlight correct/incorrect

nextQuestion():
  - Increment currentQuestion
  - Hide current, show next
  - Reset UI

showResults():
  - Calculate score
  - Display results
  - Save to localStorage
```

---

# 10. Performance & Optimization

## 10.1 Current Optimizations

| Optimization                 | Status           | File                       |
| ---------------------------- | ---------------- | -------------------------- |
| Lazy loading                 | ✅ Profile image | `index.html`               |
| Font display swap            | ✅ Applied       | Google Fonts URL           |
| Preconnect hints             | ✅ Applied       | `<head>`                   |
| Dev-only console logs        | ✅ Applied       | `script.js`, `learning.js` |
| Mobile cursor trail disabled | ✅ Applied       | `script.js`                |

## 10.2 Caching Strategy (netlify.toml)

```toml
CSS/JS: max-age=31536000 (1 year)
Images: max-age=31536000 (1 year)
HTML: max-age=0, must-revalidate
```

## 10.3 Required Manual Optimizations

| Task            | Current | Target  | Tool        |
| --------------- | ------- | ------- | ----------- |
| my-img.png      | 2.6 MB  | <100 KB | squoosh.app |
| logo.png        | 862 KB  | <30 KB  | squoosh.app |
| Convert to WebP | PNG     | WebP    | squoosh.app |

## 10.4 Lighthouse Targets

| Metric         | Current (Est.) | After Optimization |
| -------------- | -------------- | ------------------ |
| Performance    | 40-50          | 90+                |
| Accessibility  | 85             | 98+                |
| Best Practices | 85             | 95+                |
| SEO            | 95             | 100                |

---

# 11. Deployment Notes

## 11.1 Netlify Deployment

### Automatic Deployment

1. Connect GitHub repository to Netlify
2. Set publish directory: `.` (root)
3. No build command needed (static site)
4. Deploy on push to `main` branch

### Manual Deployment

1. Drag and drop folder to Netlify
2. Or use Netlify CLI: `netlify deploy --prod`

## 11.2 Required Netlify Settings

| Setting           | Value   |
| ----------------- | ------- |
| Publish directory | `.`     |
| Build command     | (none)  |
| Branch            | `main`  |
| Identity          | Enabled |
| Git Gateway       | Enabled |

## 11.3 DNS Configuration

```
Type: CNAME
Name: www
Value: [your-netlify-site].netlify.app

Type: A (or ALIAS)
Name: @
Value: Netlify load balancer IP
```

## 11.4 Environment Variables

No environment variables required (static site).

---

# 12. Troubleshooting Guide

## 12.1 Common Issues

### CMS Login Issues

```
Problem: Can't access /admin/
Solution:
1. Ensure Netlify Identity is enabled
2. Ensure Git Gateway is enabled
3. Check you've accepted the invite email
4. Clear browser cache and retry
```

### Course Not Loading

```
Problem: Blank course page
Check:
1. URL has ?id=course-slug
2. content/courses/[slug].json exists
3. JSON is valid (no syntax errors)
4. Console for fetch errors
```

### Images Not Showing

```
Problem: Broken images
Check:
1. File exists in /images/
2. Correct file extension (case-sensitive)
3. Path starts with "images/" not "/images/"
```

### Mobile Menu Not Working

```
Problem: Hamburger doesn't toggle
Check:
1. js/script.js is loaded
2. No JS errors in console
3. .hamburger element exists
4. .nav-links element exists
```

## 12.2 Console Errors

| Error                          | Cause                 | Fix                  |
| ------------------------------ | --------------------- | -------------------- |
| `Cannot read property of null` | Element doesn't exist | Add null check       |
| `Failed to fetch`              | JSON file missing     | Create missing file  |
| `SyntaxError: JSON`            | Invalid JSON          | Validate JSON syntax |

## 12.3 CSS Issues

| Issue                | Cause               | Fix                         |
| -------------------- | ------------------- | --------------------------- |
| Styles not applying  | Specificity         | Use more specific selector  |
| Mobile layout broken | Missing media query | Check mobile-responsive.css |
| Overflow scroll      | Content too wide    | Add overflow-x: hidden      |

---

# 13. Future Improvements

## 13.1 UI Enhancements

- [ ] Add dark/light mode toggle
- [ ] Implement skeleton loading states
- [ ] Add page transition animations
- [ ] Create course completion certificates (PDF)

## 13.2 CMS Expansions

- [ ] Add blog collection
- [ ] Add team members collection
- [ ] Add testimonials
- [ ] Enable draft/preview workflow

## 13.3 Performance

- [ ] Implement service worker for offline support
- [ ] Add web app manifest (PWA)
- [ ] Bundle and minify CSS/JS
- [ ] Implement critical CSS inlining

## 13.4 Features

- [ ] User accounts with progress sync
- [ ] Discussion/comments on courses
- [ ] Course search functionality
- [ ] Email newsletter integration
- [ ] Analytics dashboard

## 13.5 Accessibility

- [ ] Full WCAG 2.1 AA compliance
- [ ] Screen reader testing
- [ ] Keyboard navigation audit
- [ ] Color contrast verification

---

# 14. Licenses & Credits

## 14.1 Content License (Creative Commons)

All educational content, courses, articles, and written materials are licensed under:

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

[![CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

### You are free to:

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose

### Under the following terms:

- **Attribution** — Credit AI RedCell and Shehan Nilukshan with a link to the source

### Attribution Example:

```
Content by AI RedCell (https://www.airedcell.dev)
Founded by Shehan Nilukshan | CC BY 4.0
```

## 14.2 Code License (MIT)

The website source code (HTML, CSS, JavaScript) is licensed under the **MIT License**.

```
MIT License
Copyright (c) 2025 Shehan Nilukshan / AI RedCell
```

## 14.3 License Summary

| Component                 | License               | Usage                         |
| ------------------------- | --------------------- | ----------------------------- |
| Course content & articles | CC BY 4.0             | Share with attribution        |
| HTML, CSS, JS code        | MIT                   | Free to use and modify        |
| Logo & branding           | © All Rights Reserved | Do not use without permission |
| Profile images            | © All Rights Reserved | Do not use without permission |

## 14.4 Font Licenses

| Font     | License           | Source       |
| -------- | ----------------- | ------------ |
| Orbitron | Open Font License | Google Fonts |
| Rajdhani | Open Font License | Google Fonts |

## 14.5 Third-Party Services

| Service      | Purpose      | Terms                                          |
| ------------ | ------------ | ---------------------------------------------- |
| Netlify      | Hosting, CMS | [netlify.com/legal](https://netlify.com/legal) |
| FormSubmit   | Contact form | [formsubmit.co](https://formsubmit.co)         |
| Google Fonts | Typography   | [fonts.google.com](https://fonts.google.com)   |

## 14.6 Author

**Shehan Nilukshan**  
Founder & Lead AI Red Teamer  
AI RedCell - Sri Lanka's First AI Red Teaming Agency

📧 Email: hello@airedcell.dev  
🌐 Website: [airedcell.dev](https://www.airedcell.dev)  
🐙 GitHub: [github.com/ai-redcell](https://github.com/ai-redcell)  
💼 LinkedIn: [linkedin.com/in/shehan-nilukshan](https://linkedin.com/in/shehan-nilukshan)  
📍 Location: Sri Lanka

---

# 15. Website Analysis Report

> **Last Analyzed:** December 17, 2025  
> **Full Report:** See [report.md](report.md) for comprehensive details

## 15.1 Overall Scores

| Category                  | Score      | Grade  |
| ------------------------- | ---------- | ------ |
| **SEO**                   | 95/100     | A      |
| **Accessibility**         | 80/100     | B      |
| **Performance**           | 75/100     | C+     |
| **Mobile Responsiveness** | 90/100     | A      |
| **Content Quality**       | 92/100     | A      |
| **Technical Structure**   | 88/100     | B+     |
| **Overall**               | **87/100** | **A-** |

## 15.2 Key Strengths

- ✅ **Excellent SEO**: 5 JSON-LD schemas, complete Open Graph & Twitter Cards
- ✅ **AI Crawler Optimization**: robots.txt + llms.txt for AI models
- ✅ **Comprehensive Mobile Support**: 1000+ lines of responsive CSS
- ✅ **Rich Content**: 16+ course modules, detailed service pages
- ✅ **Accessibility Features**: ARIA labels, semantic HTML, focus states

## 15.3 Priority Improvements

| Priority  | Action                                           | Impact        |
| --------- | ------------------------------------------------ | ------------- |
| 🔴 High   | Compress logo.png (862KB) and my-img.png (2.6MB) | Performance   |
| 🔴 High   | Add missing pages to sitemap.xml                 | SEO           |
| 🟡 Medium | Bundle and minify CSS files                      | Performance   |
| 🟡 Medium | Add skip-to-content link                         | Accessibility |
| 🟢 Low    | Add blog section                                 | SEO/Content   |
| 🟢 Low    | Self-host Google Fonts                           | Performance   |

---

<div align="center">

**Built with ❤️ for the AI Security Community**

🔴 AI RedCell - Sri Lanka's First AI Red Teaming Agency

Content licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Code licensed under MIT

</div>
