(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const wheelIcons = Array.from(document.querySelectorAll('.wheel-icon'));
//const wheelTrack = document.getElementById('wheelTrack');
//const sideWheel = document.getElementById('sideWheel');
  const dots = Array.from(document.querySelectorAll('.dot'));
  const progress = document.getElementById('progress');

  const total = slides.length;
  let current = 0;
  let isAnimating = false;
  let touchStartY = 0;
  let touchStartX = 0;

 // const ICON_HEIGHT = 60; // высота одной иконки

  // ===== Переключение слайда =====
  function goTo(index) {
    if (isAnimating || index === current || index < 0 || index >= total) return;

    isAnimating = true;

    const direction = index > current ? 'next' : 'prev';

    // Убираем активный со старого
    slides[current].classList.remove('active');
    slides[current].classList.add(direction === 'next' ? 'prev' : 'next');

    // Ставим новый
    slides[index].classList.remove('prev', 'next');
    slides[index].classList.add('active');

    // Обновляем индикаторы
    current = index;
    updateIndicators();
    updateProgress();

    // Сбрасываем "prev/next" у неактивных через время
    setTimeout(() => {
      slides.forEach((s, i) => {
        if (i !== current) {
          s.classList.remove('prev', 'next');
        }
      });
      isAnimating = false;
    }, 900);
  }

  function updateIndicators() {
    // Колесо: центрируем активную иконку
    /*
    const offset = -(current * ICON_HEIGHT);
    wheelTrack.style.transform = `translateY(${offset}px)`;
    */
    wheelIcons.forEach((icon, i) => {
      icon.classList.toggle('active', i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function updateProgress() {
    const pct = total > 1 ? (current / (total - 1)) * 100 : 0;
    progress.style.width = pct + '%';
  }

  // ===== Клик по иконкам колеса =====
  wheelIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      goTo(parseInt(icon.dataset.target, 10));
    });
  });

  // ===== Клик по точкам (мобилка) =====
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.target, 10));
    });
  });

  // ===== Скролл колесом мыши =====
  let wheelLock = false;
  window.addEventListener('wheel', (e) => {
    // На мобилке скролл нативный (см. touch), но wheel работает на десктопе
    if (wheelLock) return;
    const delta = e.deltaY;
    if (Math.abs(delta) < 10) return;

    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 900);

    if (delta > 0) goTo(current + 1);
    else goTo(current - 1);
  }, { passive: true });

  // ===== Тач-скролл (мобилка) =====
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;

    // Вертикальный свайп
    if (Math.abs(dy) > 50 && Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });

  // ===== Клавиатура =====
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(current - 1);
    }
  });

  // ===== Инициализация =====
  updateIndicators();
  updateProgress();
})();