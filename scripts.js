// scripts.js - comportamiento: menú, reveal on scroll, animar barras de progreso, manejo del formulario

document.addEventListener('DOMContentLoaded', () => {
  // Toggle nav (mobile)
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', !expanded);
    nav.style.display = expanded ? '' : 'flex';
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav after click
        if (window.innerWidth < 900 && nav) { nav.style.display = ''; nav.setAttribute('data-open','false'); }
      }
    });
  });

  // Reveal on scroll and progress bar animation using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const options = {threshold: 0.12};
  const onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // animate progress bars inside revealed section
        const bars = entry.target.querySelectorAll('.progress');
        bars.forEach(bar => {
          const value = Number(bar.getAttribute('data-value')) || 0;
          const inner = bar.querySelector('.progress-bar');
          const shown = bar.getAttribute('data-animated');
          if (!shown) {
            inner.style.width = value + '%';
            bar.setAttribute('data-animated','true');
          }
        });

        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(onIntersect, options);
  reveals.forEach(r => observer.observe(r));

  // Simple form handling (no backend) - shows confirmation
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      // basic validation
      if (!name || !email || !message) {
        feedback.textContent = 'Por favor completa todos los campos.';
        feedback.style.color = '#ffd6d6';
        return;
      }
      // show success message (replace with service integration as needed)
      feedback.style.color = '#b8ffcf';
      feedback.textContent = '¡Gracias! Tu mensaje se recibió correctamente. En breve me comunicaré contigo.';
      form.reset();

      // optional: animate feedback luego clear
      setTimeout(() => { feedback.textContent = ''; }, 6000);
    });
  }

  // Improve accessibility: close nav on resize if going desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900 && nav) {
      nav.style.display = 'flex';
      nav.setAttribute('data-open','true');
    } else if (nav) {
      nav.style.display = '';
      nav.setAttribute('data-open','false');
    }
  });
});
