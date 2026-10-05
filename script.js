/* =========================================================
   ДАННЫЕ СЛОВАРЯ (по В. И. Далю)
   ========================================================= */
const words = [
  {
    word: "Заблюдник",
    meaning: "Деревянная настенная полка или открытый шкаф для расстановки тарелок и блюд.",
    proverb: "Хороша посуда в заблюднике, да нечего в неё положить.",
    proverbMeaning: "О бедности, когда красивая утварь стоит на показ, но есть нечего.",
    images: ["images/Заблюдник.jpg", "images/заблюдник2.jpg"]
  },
  {
    word: "Крынка",
    meaning: "Глиняный горшок с широким основанием и зауженным горлышком, в котором хранили молоко, чтобы оно долго не прокисало.",
    proverb: "Не разбивай крынки, коли молока не пил.",
    proverbMeaning: "Предостережение от поспешных и необдуманных действий; не стоит портить вещь или отношения раньше времени.",
    images: ["images/крынка.jpg", "images/крынка2.jpg"]
  },
  {
    word: "Ухват",
    meaning: "Длинная деревянная рукоять с железными рогами на конце, которой ставили чугунки в печь и доставали их обратно.",
    proverb: "С печи упал — за ухват схватился.",
    proverbMeaning: "О нерасторопном или глупом человеке, который пытается исправить ситуацию, когда уже слишком поздно.",
    images: ["images/Ухват.jpg", "images/ухват2.JPG"]
  },
  {
    word: "Изба",
    meaning: "Деревянный крестьянский дом.",
    proverb: "Изба ильинским тесом крыта (то есть соломой).",
    proverbMeaning: "Простая, но прочная постройка, часто с хозяйственными постройками.",
    images: ["images/изба.jpg", "images/изба2.jpg", "images/изба3.jpg"]
  },
  {
    word: "Лавка",
    meaning: "Скамья для отдыха или работы.",
    proverb: "Не красна изба углами, а красна пирогами.",
    proverbMeaning: "Главное в доме — не красота стен, а уют и достаток, которые создаются трудом и угощением.",
    images: ["images/лавка.jpg", "images/лавка2.jpg"]
  },
  {
    word: "Самовар",
    meaning: "Прибор для кипячения воды и приготовления чая.",
    proverb: "Самовар кипит — уходить не велит.",
    proverbMeaning: "Символизирует домашний уют и гостеприимство, даже когда пора заканчивать дело.",
    images: ["images/самовар.jpg", "images/самовар2.jpg"]
  },
  {
    word: "Лучина",
    meaning: "Тонкая щепка для освещения.",
    proverb: "Светить как лучина.",
    proverbMeaning: "Используется в ситуациях крайнего недостатка, когда нет другого света.",
    images: ["images/лучина.jpg", "images/лучина2.png"]
  },
  {
    word: "Сермяга",
    meaning: "Грубая, долгополая одежда из грубого сукна.",
    proverb: "Сермяжная правда.",
    proverbMeaning: "Выражение глубокой народной мудрости, где «сермяга» — не просто одежда, а символ простоты, бедности, но и честности.",
    images: ["images/сермяга.jpg", "images/сермяга2.jpg"]
  },
  {
    word: "Кочерга",
    meaning: "Приспособление для перемешивания углей в печи.",
    proverb: "Кочергу в огонь — не видать добра.",
    proverbMeaning: "Предостережение от бесполезного или вредного вмешательства в то, что уже работает.",
    images: ["images/кочерга.jpg", "images/кочерга2.jpg"]
  },
  {
    word: "Ендова",
    meaning: "Низкая и широкая медная посуда с отливом для разлива напитков.",
    proverb: "Ендову пить — по добру здорова.",
    proverbMeaning: "Шутливое осуждение пьянства, подчёркивающее, что напиток из ендовы приносит здоровье и веселье.",
    images: ["images/ендова.jpg", "images/ендова2.jpg"]
  }
];

/* =========================================================
   СОСТОЯНИЕ
   ========================================================= */
let current = 0;
let isFlipping = false;
let isTocPage = true; // первая страница — оглавление

const pageEl  = document.getElementById('page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tocBtn  = document.getElementById('tocBtn');
const flipSound = document.getElementById('flipSound');

/* Звук перелистывания */
function playFlipSound() {
  if (!flipSound) return;
  try {
    flipSound.currentTime = 0;
    flipSound.volume = 0.6;
    flipSound.play().catch(() => { /* браузер может заблокировать — не страшно */ });
  } catch (e) { /* тихо игнорируем */ }
}

/* =========================================================
   ОТРИСОВКА ОГЛАВЛЕНИЯ
   ========================================================= */
function renderToc() {
  isTocPage = true;

  const itemsHTML = words.map((w, i) => `
    <button class="toc-item" data-index="${i}">
      <span>${w.word}</span>
      <span class="num">${i + 1}</span>
    </button>
  `).join('');

  pageEl.innerHTML = `
    <div class="toc">
      <h1 class="toc-title">Словарь</h1>
      <p class="toc-subtitle">— по В. И. Далю —</p>
      <div class="divider"></div>
      <ul class="toc-list">${itemsHTML}</ul>
    </div>
  `;

  // Клики по пунктам оглавления
  pageEl.querySelectorAll('.toc-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      goToWord(idx);
    });
  });

  // Кнопки страниц
  prevBtn.disabled = true;
  nextBtn.disabled = false;

  // Прячем кнопку оглавления — мы и так на нём
  tocBtn.style.display = 'none';
}

/* =========================================================
   ОТРИСОВКА СТРАНИЦЫ СО СЛОВОМ
   ========================================================= */
function renderPage() {
  isTocPage = false;
  const data = words[current];
  const images = data.images && data.images.length ? data.images : [];

  let galleryHTML = '';

  if (images.length === 0) {
    galleryHTML = `<div class="image-placeholder">Картинки отсутствуют</div>`;
  } else {
    const imgsHTML = images.map((src, i) => `
      <img src="${src}"
           alt="${data.word} — изображение ${i + 1}"
           class="${i === 0 ? 'active' : ''}"
           data-index="${i}"
           onerror="this.style.display='none'">
    `).join('');

    const dotsHTML = images.length > 1
      ? `<div class="gallery-dots">
           ${images.map((_, i) =>
             `<span class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
           ).join('')}
         </div>`
      : '';

    const arrowsHTML = images.length > 1
      ? `<button class="gallery-arrow left"  data-dir="-1" aria-label="Предыдущая картинка">‹</button>
         <button class="gallery-arrow right" data-dir="1"  aria-label="Следующая картинка">›</button>`
      : '';

    galleryHTML = `
      <div class="gallery-stage">
        ${arrowsHTML}
        ${imgsHTML}
      </div>
      ${dotsHTML}
    `;
  }

  pageEl.innerHTML = `
    <div class="content">
      <h1 class="word">${data.word}</h1>
      <div class="divider"></div>
      <p class="meaning">${data.meaning}</p>
      <p class="proverb">${data.proverb}</p>
      <p class="proverb-meaning">${data.proverbMeaning}</p>
      <div class="gallery" data-current-image="0" data-total-images="${images.length}">
        ${galleryHTML}
      </div>
    </div>
    <div class="page-num">— ${current + 1} —</div>
  `;

  attachGalleryEvents();

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === words.length - 1;

  // Показываем кнопку «Оглавление»
  tocBtn.style.display = 'block';
}

/* =========================================================
   ГАЛЕРЕЯ
   ========================================================= */
function attachGalleryEvents() {
  const gallery = pageEl.querySelector('.gallery');
  if (!gallery) return;

  const total = parseInt(gallery.dataset.totalImages, 10);
  if (total <= 1) return;

  const imgs = gallery.querySelectorAll('.gallery-stage img');
  const dots = gallery.querySelectorAll('.gallery-dot');

  function showImage(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    gallery.dataset.currentImage = index;

    imgs.forEach((img, i) => img.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  gallery.querySelectorAll('.gallery-arrow').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dir = parseInt(btn.dataset.dir, 10);
      const cur = parseInt(gallery.dataset.currentImage, 10);
      showImage(cur + dir);
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showImage(parseInt(dot.dataset.index, 10));
    });
  });

  // Свайпы
  let touchStartX = 0;
  const stage = gallery.querySelector('.gallery-stage');
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    const cur = parseInt(gallery.dataset.currentImage, 10);
    showImage(cur + (dx < 0 ? 1 : -1));
  });
}

/* =========================================================
   ПЕРЕХОД К СЛОВУ ИЗ ОГЛАВЛЕНИЯ
   ========================================================= */
function goToWord(index) {
  if (isFlipping) return;
  if (index < 0 || index >= words.length) return;

  isFlipping = true;
  playFlipSound();

  // Анимация «перелистывания»
  pageEl.classList.add('flip-next');

  setTimeout(() => {
    current = index;
    pageEl.classList.remove('flip-next');
    void pageEl.offsetWidth;

    renderPage();

    pageEl.style.opacity = '0';
    pageEl.style.transform = 'rotateY(180deg)';

    requestAnimationFrame(() => {
      pageEl.style.transition = 'transform .7s ease, opacity .7s ease';
      pageEl.style.opacity = '1';
      pageEl.style.transform = 'rotateY(0deg)';

      setTimeout(() => {
        pageEl.style.transition = '';
        isFlipping = false;
      }, 700);
    });
  }, 700);
}

/* =========================================================
   ПЕРЕЛИСТЫВАНИЕ СТРАНИЦ
   ========================================================= */
function flip(direction) {
  if (isFlipping) return;

  // С оглавления — только «вперёд» (на 1-е слово)
  if (isTocPage) {
    if (direction === 'next') goToWord(0);
    return;
  }

  if (direction === 'next' && current >= words.length - 1) return;
  if (direction === 'prev' && current <= 0) return;

  isFlipping = true;
  playFlipSound();

  pageEl.classList.add(direction === 'next' ? 'flip-next' : 'flip-prev');

  setTimeout(() => {
    current += direction === 'next' ? 1 : -1;

    pageEl.classList.remove('flip-next', 'flip-prev');
    void pageEl.offsetWidth;

    renderPage();

    pageEl.style.opacity = '0';
    pageEl.style.transform = direction === 'next'
      ? 'rotateY(180deg)'
      : 'rotateY(-180deg)';

    requestAnimationFrame(() => {
      pageEl.style.transition = 'transform .7s ease, opacity .7s ease';
      pageEl.style.opacity = '1';
      pageEl.style.transform = 'rotateY(0deg)';

      setTimeout(() => {
        pageEl.style.transition = '';
        isFlipping = false;
      }, 700);
    });
  }, 700);
}

/* =========================================================
   СОБЫТИЯ
   ========================================================= */
nextBtn.addEventListener('click', () => flip('next'));
prevBtn.addEventListener('click', () => flip('prev'));

// Кнопка «К оглавлению»
tocBtn.addEventListener('click', () => {
  if (isTocPage || isFlipping) return;
  isFlipping = true;
  playFlipSound();

  pageEl.classList.add('flip-prev');

  setTimeout(() => {
    pageEl.classList.remove('flip-prev');
    void pageEl.offsetWidth;
    renderToc();

    pageEl.style.opacity = '0';
    pageEl.style.transform = 'rotateY(-180deg)';

    requestAnimationFrame(() => {
      pageEl.style.transition = 'transform .7s ease, opacity .7s ease';
      pageEl.style.opacity = '1';
      pageEl.style.transform = 'rotateY(0deg)';
      setTimeout(() => {
        pageEl.style.transition = '';
        isFlipping = false;
      }, 700);
    });
  }, 700);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') flip('next');
  if (e.key === 'ArrowLeft')  flip('prev');
  if (e.key === 'Escape' && !isTocPage) tocBtn.click();
});

/* Первый рендер — оглавление */
renderToc();