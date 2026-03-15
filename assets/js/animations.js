/**
 * Scroll-triggered animations using Intersection Observer
 * Adds 'is-visible' class to elements with 'animate-on-scroll' class
 * when they enter the viewport.
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Once animated, stop observing
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      });

      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all elements immediately
      animatedElements.forEach(function(el) {
        el.classList.add('is-visible');
      });
    }

    // Smooth scroll for anchor links (override base target="_blank")
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          var targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            e.stopPropagation();
            var navHeight = document.querySelector('.masthead') ? document.querySelector('.masthead').offsetHeight : 0;
            var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Active nav highlight on scroll
    var navLinks = document.querySelectorAll('.masthead__menu-item a');
    var sections = [];
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      // Handle both "#section" and "/#section" formats
      if (href && href.startsWith('/#')) {
        href = href.substring(1);
      }
      if (href && href.startsWith('#')) {
        var section = document.querySelector(href);
        if (section) {
          sections.push({ el: section, link: link });
        }
      }
    });

    if (sections.length > 0) {
      var onScroll = function() {
        var navHeight = document.querySelector('.masthead') ? document.querySelector('.masthead').offsetHeight : 0;
        var scrollPos = window.scrollY + navHeight + 60;
        var current = null;

        // Find the current section
        for (var i = sections.length - 1; i >= 0; i--) {
          if (sections[i].el.offsetTop <= scrollPos) {
            current = sections[i];
            break;
          }
        }

        // If at very top, highlight first item
        if (!current && sections.length > 0) {
          current = sections[0];
        }

        navLinks.forEach(function(link) {
          link.classList.remove('is-active');
        });
        if (current) {
          current.link.classList.add('is-active');
        }
      };

      window.addEventListener('scroll', onScroll);
      // Initial call to highlight current section on page load
      onScroll();
    }
  });
})();
