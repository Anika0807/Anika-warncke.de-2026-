// Testimonial Carousel für Arbeitgeber-Zitate
// Minimal Vanilla JS für Vor/Zurück

document.addEventListener('DOMContentLoaded', function() {
  const items = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let current = 0;

  function showItem(idx) {
    items.forEach((el, i) => {
      el.classList.toggle('active', i === idx);
    });
  }

  if (prevBtn && nextBtn && items.length > 0) {
    prevBtn.addEventListener('click', function() {
      current = (current - 1 + items.length) % items.length;
      showItem(current);
    });
    nextBtn.addEventListener('click', function() {
      current = (current + 1) % items.length;
      showItem(current);
    });
  }
});
