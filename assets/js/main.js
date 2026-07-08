// DokDrop — shared site behaviors
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Scroll-progress compass
  --------------------------------------------------------------------- */
  var compass = document.getElementById('scroll-compass');
  var compassPointer = document.getElementById('compass-pointer');
  if (compass && compassPointer) {
    var updateCompass = function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      compassPointer.style.transform = 'rotate(' + (pct * 360).toFixed(1) + 'deg)';
      compass.classList.toggle('is-visible', scrollTop > 200);
    };
    updateCompass();
    window.addEventListener('scroll', updateCompass, { passive: true });
    window.addEventListener('resize', updateCompass);
    compass.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     Tubelight navbar — sliding glow/pill indicator
  --------------------------------------------------------------------- */
  var tubelightNav = document.querySelector('.tubelight-nav-inner');
  if (tubelightNav) {
    var indicator = tubelightNav.querySelector('.tubelight-indicator');
    var items = Array.prototype.slice.call(tubelightNav.querySelectorAll('.tubelight-item'));
    var activeItem = tubelightNav.querySelector('.tubelight-item[aria-current="page"]');

    var moveIndicatorTo = function (el) {
      if (!indicator || !el) return;
      indicator.style.left = el.offsetLeft + 'px';
      indicator.style.width = el.offsetWidth + 'px';
      indicator.classList.add('is-active');
    };

    if (activeItem) {
      moveIndicatorTo(activeItem);
    }

    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () { moveIndicatorTo(item); });
    });
    tubelightNav.addEventListener('mouseleave', function () {
      if (activeItem) {
        moveIndicatorTo(activeItem);
      } else if (indicator) {
        indicator.classList.remove('is-active');
      }
    });

    if (activeItem) {
      window.addEventListener('resize', function () { moveIndicatorTo(activeItem); });
    }
  }

  /* ---------------------------------------------------------------------
     Sticky header shadow/blur state
  --------------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-cinematic');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(function (el, i) {
        el.style.setProperty('--stagger-i', i % 6);
        io.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------------------
     Hero chart draw-on-view
  --------------------------------------------------------------------- */
  var chart = document.querySelector('.hero-photo-chart');
  if (chart) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      chart.classList.add('in-view');
    } else {
      var chartIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              chart.classList.add('in-view');
              chartIo.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      chartIo.observe(chart);
    }
  }

  /* ---------------------------------------------------------------------
     Wave text — replay the per-letter bounce on hover
     (it already plays once on load via CSS; this just restarts it)
  --------------------------------------------------------------------- */
  var waveText = document.querySelector('.wave-text');
  if (waveText && !reduceMotion) {
    var waveSpans = waveText.querySelectorAll('span');
    waveText.addEventListener('mouseenter', function () {
      waveSpans.forEach(function (span) {
        span.style.animation = 'none';
        void span.offsetWidth;
        span.style.animation = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Animated stat counters
  --------------------------------------------------------------------- */
  var stats = document.querySelectorAll('[data-count-to]');
  if (stats.length) {
    var animateStat = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1200;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var statIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateStat(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      stats.forEach(function (el) { statIo.observe(el); });
    } else {
      stats.forEach(animateStat);
    }
  }

  /* ---------------------------------------------------------------------
     CTA band — cursor-tracked sheen
  --------------------------------------------------------------------- */
  var ctaBands = document.querySelectorAll('.cta-band');
  if (ctaBands.length && !reduceMotion) {
    ctaBands.forEach(function (band) {
      band.addEventListener('pointermove', function (e) {
        var rect = band.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        band.style.setProperty('--spot-x', x + '%');
        band.style.setProperty('--spot-y', y + '%');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Concierge request form
  --------------------------------------------------------------------- */
  var requestForm = document.getElementById('request-form');
  if (requestForm) {
    var requiredFields = requestForm.querySelectorAll('[required]');
    var requestSubmitBtn = requestForm.querySelector('button[type="submit"]');
    var requestSubmitLabel = requestSubmitBtn ? requestSubmitBtn.textContent : '';
    var requestStatus = document.getElementById('form-status');
    var requestStatusDefaultHTML = requestStatus ? requestStatus.innerHTML : '';

    var validateField = function (field) {
      var wrapper = field.closest('.field');
      if (!wrapper) return true;
      var valid = field.checkValidity();
      wrapper.classList.toggle('has-error', !valid);
      field.setAttribute('data-touched', 'true');
      return valid;
    };

    requiredFields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    requestForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      requiredFields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        var firstError = requestForm.querySelector('.has-error input, .has-error textarea, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      if (requestSubmitBtn) {
        requestSubmitBtn.disabled = true;
        requestSubmitBtn.textContent = 'Sending request…';
      }
      if (requestStatus) requestStatus.classList.remove('is-visible', 'is-error');

      fetch(requestForm.action, {
        method: 'POST',
        body: new FormData(requestForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Form submission failed');
        if (requestSubmitBtn) requestSubmitBtn.textContent = 'Request sent';
        if (requestStatus) {
          requestStatus.innerHTML = requestStatusDefaultHTML;
          requestStatus.classList.add('is-visible');
          requestStatus.setAttribute('role', 'status');
          requestStatus.focus();
        }
        requestForm.reset();
      }).catch(function () {
        if (requestSubmitBtn) {
          requestSubmitBtn.disabled = false;
          requestSubmitBtn.textContent = requestSubmitLabel;
        }
        if (requestStatus) {
          requestStatus.innerHTML = '<span>Something went wrong — please call or email us directly.</span>';
          requestStatus.classList.add('is-visible', 'is-error');
          requestStatus.setAttribute('role', 'alert');
          requestStatus.focus();
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Contact form (lighter version)
  --------------------------------------------------------------------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var contactSubmitBtn = contactForm.querySelector('button[type="submit"]');
    var contactSubmitLabel = contactSubmitBtn ? contactSubmitBtn.textContent : '';
    var contactStatus = document.getElementById('contact-status');
    var contactStatusDefaultHTML = contactStatus ? contactStatus.innerHTML : '';

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.textContent = 'Sending…';
      }
      if (contactStatus) contactStatus.classList.remove('is-visible', 'is-error');

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Form submission failed');
        if (contactSubmitBtn) contactSubmitBtn.textContent = 'Message sent';
        if (contactStatus) {
          contactStatus.innerHTML = contactStatusDefaultHTML;
          contactStatus.classList.add('is-visible');
          contactStatus.setAttribute('role', 'status');
        }
        contactForm.reset();
      }).catch(function () {
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.textContent = contactSubmitLabel;
        }
        if (contactStatus) {
          contactStatus.innerHTML = '<span>Something went wrong — please call or email us directly.</span>';
          contactStatus.classList.add('is-visible', 'is-error');
          contactStatus.setAttribute('role', 'alert');
        }
      });
    });
  }
})();
