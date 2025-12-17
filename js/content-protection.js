/**
 * Content Protection Script
 * Prevents copying, right-click, and keyboard shortcuts
 * For AI RedCell - Protect company content
 */

(function() {
  'use strict';

  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable keyboard shortcuts for copying/selecting
  document.addEventListener('keydown', function(e) {
    // Ctrl+C, Ctrl+X, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P
    if (e.ctrlKey && (
      e.key === 'c' || 
      e.key === 'C' ||
      e.key === 'x' || 
      e.key === 'X' ||
      e.key === 'a' || 
      e.key === 'A' ||
      e.key === 'u' || 
      e.key === 'U' ||
      e.key === 's' || 
      e.key === 'S' ||
      e.key === 'p' || 
      e.key === 'P'
    )) {
      e.preventDefault();
      return false;
    }

    // F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
    if (e.ctrlKey && e.shiftKey && (
      e.key === 'I' || 
      e.key === 'i' ||
      e.key === 'J' || 
      e.key === 'j' ||
      e.key === 'C' || 
      e.key === 'c'
    )) {
      e.preventDefault();
      return false;
    }
  });

  // Disable copy event
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable cut event
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable drag and drop
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  });

  // Disable selection on double-click
  document.addEventListener('selectstart', function(e) {
    // Allow selection in form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true;
    }
    e.preventDefault();
    return false;
  });

  // Console warning message
  console.log('%c⚠️ Content Protected', 'color: #ff0040; font-size: 20px; font-weight: bold;');
  console.log('%cThis website content is protected. Unauthorized copying is prohibited.', 'color: #ff6b35; font-size: 14px;');
  console.log('%c© 2025 AI RedCell', 'color: #888; font-size: 12px;');

})();
