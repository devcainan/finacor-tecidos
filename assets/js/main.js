/* ============================================================
   Hero title — stagger word animation
============================================================ */
(function() {
  var title = document.getElementById('hero-title');
  if (!title) return;
  var html = title.innerHTML;
  var result = html.replace(/(<em>[^<]*<\/em>|[^\s<]+)/g, function(match) {
    return '<span class="word" style="opacity:0">' + match + '</span>';
  });
  title.innerHTML = result;
  var words = title.querySelectorAll('.word');
  words.forEach(function(w, i) {
    w.style.animation = 'fadeSlideUp 600ms cubic-bezier(0.25,0,0,1) ' + (i * 80) + 'ms forwards';
  });
})();

/* ============================================================
   Header scroll behavior
============================================================ */
(function() {
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   Mobile hamburger menu
============================================================ */
(function() {
  var btn = document.getElementById('hamburger');
  var nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  var links = nav.querySelectorAll('a');

  function openMenu() {
    btn.classList.add('open');
    nav.classList.add('open');
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    btn.classList.remove('open');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', function() {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  links.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ============================================================
   IntersectionObserver — scroll animations
============================================================ */
(function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.anim, .anim-img, .anim-line').forEach(function(el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.anim, .anim-img, .anim-line').forEach(function(el) {
    observer.observe(el);
  });
})();

/* ============================================================
   Counter animation for stats
============================================================ */
(function() {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;
  if (!('IntersectionObserver' in window)) return;

  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1200;
      var start = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

      function step(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var value = Math.round(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { counterObserver.observe(c); });
})();
