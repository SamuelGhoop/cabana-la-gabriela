/* ================================================================
   CABAÑA LA GABRIELA — JavaScript Principal
   ================================================================ */

/* ======================== CONFIGURACIÓN ======================== */
const CONFIG = {
  whatsapp: '573137549732',
  instagram: 'lagabriela06',
  tiktok: 'la_gabriela06',
  facebook: 'CabañaLaGabriela',
  coords: { lat: 9.35933, lng: -76.00764 },
  lang: localStorage.getItem('lang') || 'es',
};

/* ======================== TRADUCCIONES ======================== */
const TRANSLATIONS = {
  es: {
    nav_inicio: 'Inicio',
    nav_habitaciones: 'Habitaciones',
    nav_galeria: 'Galería',
    nav_lugares: 'Lugares',
    nav_llegar: 'Cómo Llegar',
    nav_reservar: 'Reservar',
    whatsapp_bubble: '¡Escríbenos!',
    footer_rights: '© 2025 Cabaña La Gabriela. Todos los derechos reservados.',
  },
  en: {
    nav_inicio: 'Home',
    nav_habitaciones: 'Rooms',
    nav_galeria: 'Gallery',
    nav_lugares: 'Places',
    nav_llegar: 'How to Arrive',
    nav_reservar: 'Book Now',
    whatsapp_bubble: 'Chat with us!',
    footer_rights: '© 2025 Cabaña La Gabriela. All rights reserved.',
  }
};

/* ======================== NAVBAR ======================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const hamburger = navbar.querySelector('.navbar__hamburger');
  const mobile = document.querySelector('.navbar__mobile');
  const isTransparent = navbar.classList.contains('transparent');

  // Scroll behavior
  function handleScroll() {
    if (!isTransparent) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger menu
  if (hamburger && mobile) {
    hamburger.addEventListener('click', () => {
      mobile.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
    // Close on link click
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobile.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile .navbar__link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

/* ======================== LANGUAGE TOGGLE ======================== */
function initLangToggle() {
  const btns = document.querySelectorAll('.lang-btn');
  if (!btns.length) return;

  function setLang(lang) {
    CONFIG.lang = lang;
    localStorage.setItem('lang', lang);
    btns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    applyTranslations(lang);
    // Re-render calendar if available (updates bilingual month name)
    if (typeof renderCalendar === 'function') renderCalendar();
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  setLang(CONFIG.lang);
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-es]').forEach(el => {
    el.textContent = lang === 'en' && el.dataset.en ? el.dataset.en : el.dataset.es;
  });
  document.querySelectorAll('[data-es-html]').forEach(el => {
    el.innerHTML = lang === 'en' && el.dataset.enHtml ? el.dataset.enHtml : el.dataset.esHtml;
  });
  document.querySelectorAll('[data-es-placeholder]').forEach(el => {
    el.placeholder = lang === 'en' && el.dataset.enPlaceholder
      ? el.dataset.enPlaceholder
      : el.dataset.esPlaceholder;
  });
}

/* ======================== SCROLL ANIMATIONS ======================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .blur-in').forEach(el => {
    observer.observe(el);
  });

  // Stagger: observe parent, mark children with --i delay
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
    observer.observe(parent);
  });
}

/* ======================== SCROLL TO TOP ======================== */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ======================== WHATSAPP HELPERS ======================== */
function buildWhatsAppURL(msg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

const PLAN_LABELS = {
  piso1:    'Primer Piso',
  piso2:    '2do Piso + Terraza',
  completa: 'Cabana Completa'
};
const PLAN_PRICES = { piso1: 1000000, piso2: 1500000, completa: 2000000 };
const PLAN_MAX    = { piso1: 12, piso2: 20, completa: 40 };
const CHEF_PRICE  = 100000; // por persona por día — 3 comidas incluidas

function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

function calcNights(entrada, salida) {
  if (!entrada || !salida) return 0;
  const d = (new Date(salida) - new Date(entrada)) / 86400000;
  return d > 0 ? d : 0;
}

function buildReservationMessage(data) {
  const nights     = calcNights(data.entrada, data.salida);
  const priceNight = PLAN_PRICES[data.plan] || 0;
  const huespedes  = parseInt(data.huespedes) || 1;
  const chefDays   = data.cocinero === 'si' ? nights : 0;
  const chefCost   = chefDays * huespedes * CHEF_PRICE;
  const total      = nights * priceNight + chefCost;

  let msg = 'Hola! Me interesa hacer una reserva en Cabana La Gabriela.\n\n';
  msg += 'DATOS DE LA RESERVA\n';
  msg += '----------------------------\n';
  msg += 'Nombre: ' + (data.nombre || '-') + '\n';
  msg += 'Telefono: ' + (data.telefono || '-') + '\n';
  if (data.correo) msg += 'Correo: ' + data.correo + '\n';
  msg += '\nFECHAS\n';
  msg += 'Llegada: ' + (data.entrada || '-') + '\n';
  msg += 'Salida: ' + (data.salida || '-') + '\n';
  msg += 'Noches: ' + (nights || '-') + '\n';
  msg += '\nPLAN\n';
  msg += 'Plan: ' + (PLAN_LABELS[data.plan] || data.plan || '-') + '\n';
  msg += 'Huespedes: ' + (data.huespedes || '-') + '\n';
  msg += 'Cocinero: ' + (data.cocinero === 'si' ? 'Si (+$100.000/persona/dia · 3 comidas)' : 'No') + '\n';
  msg += '\nPRECIO ESTIMADO\n';
  msg += 'Tarifa por noche: ' + formatCOP(priceNight) + '\n';
  if (chefCost) msg += 'Servicio cocinero: ' + formatCOP(chefCost) + '\n';
  msg += 'TOTAL: ' + formatCOP(total) + '\n';
  if (data.mensaje) msg += '\nNota: ' + data.mensaje + '\n';
  msg += '\nGracias!';
  return msg;
}

/* ======================== LIGHTBOX ======================== */
function initLightbox() {
  const galleryImgs = document.querySelectorAll('.gallery-masonry img, [data-lightbox]');
  if (!galleryImgs.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Cerrar">✕</button>
    <button class="lightbox__prev" aria-label="Anterior">&#8249;</button>
    <img src="" alt="Foto Cabaña La Gabriela">
    <button class="lightbox__next" aria-label="Siguiente">&#8250;</button>
  `;
  document.body.appendChild(lightbox);

  const imgs = Array.from(galleryImgs);
  let current = 0;
  const lbImg = lightbox.querySelector('img');

  function open(idx) {
    current = idx;
    lbImg.src = imgs[idx].dataset.src || imgs[idx].src;
    lightbox.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  function prev() { open((current - 1 + imgs.length) % imgs.length); }
  function next() { open((current + 1) % imgs.length); }

  imgs.forEach((img, i) => img.addEventListener('click', () => open(i)));
  lightbox.querySelector('.lightbox__close').addEventListener('click', close);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', prev);
  lightbox.querySelector('.lightbox__next').addEventListener('click', next);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ======================== RESERVATION FORM ======================== */
function initReservationForm() {
  const form = document.querySelector('#reservaForm');
  if (!form) return;

  // Price calculator — update on date, plan or chef change
  function updateCalculator() {
    const plan    = form.querySelector('[name=plan]:checked');
    const entrada = form.querySelector('[name=entrada]')?.value;
    const salida  = form.querySelector('[name=salida]')?.value;
    const chef    = form.querySelector('[name=cocinero]:checked')?.value === 'si';
    const calc    = document.getElementById('priceCalculator');
    if (!calc) return;

    if (!plan) { calc.classList.remove('visible'); return; }

    const nights      = calcNights(entrada, salida);
    const priceNight  = PLAN_PRICES[plan.value] || 0;
    const numGuests   = parseInt(form.querySelector('[name=huespedes]')?.value) || 1;
    const chefCost    = chef && nights ? nights * numGuests * CHEF_PRICE : 0;
    const total       = nights * priceNight + chefCost;

    // Update max guests hint
    const maxGuests = PLAN_MAX[plan.value] || 40;
    const huespedesInput = form.querySelector('[name=huespedes]');
    if (huespedesInput) huespedesInput.max = maxGuests;
    const hint = document.getElementById('huespedesHint');
    if (hint) hint.textContent = CONFIG.lang === 'en'
      ? 'Max for this plan: ' + maxGuests + ' guests'
      : 'Máximo para este plan: ' + maxGuests + ' personas';

    const PLAN_LABELS_EN = { piso1: 'First Floor', piso2: '2nd Floor + Rooftop', completa: 'Full Cabin' };
    document.getElementById('calcPlan').textContent       = CONFIG.lang === 'en' ? (PLAN_LABELS_EN[plan.value] || plan.value) : (PLAN_LABELS[plan.value] || plan.value);
    document.getElementById('calcPriceNight').textContent = formatCOP(priceNight) + (CONFIG.lang === 'en' ? ' / night' : ' / noche');
    document.getElementById('calcNights').textContent     = nights
      ? nights + (CONFIG.lang === 'en' ? (nights === 1 ? ' night' : ' nights') : (nights === 1 ? ' noche' : ' noches'))
      : (CONFIG.lang === 'en' ? '-- (choose dates)' : '-- (elige fechas)');
    document.getElementById('calcTotal').textContent      = total ? formatCOP(total) : '--';

    // Show/hide chef row
    let chefRow = document.getElementById('calcChefRow');
    if (chef && nights) {
      if (!chefRow) {
        chefRow = document.createElement('div');
        chefRow.id = 'calcChefRow';
        chefRow.className = 'price-calc__row';
        chefRow.innerHTML = '<span class="price-calc__label">Servicio cocinero</span><span class="price-calc__value" id="calcChef"></span>';
        document.getElementById('calcTotal').closest('.price-calc__total').before(chefRow);
      }
      document.getElementById('calcChef').textContent = formatCOP(chefCost);
    } else if (chefRow) {
      chefRow.remove();
    }

    calc.classList.add('visible');
  }

  form.querySelectorAll('[name=plan]').forEach(r => r.addEventListener('change', updateCalculator));
  form.querySelectorAll('[name=cocinero]').forEach(r => r.addEventListener('change', updateCalculator));
  form.querySelector('[name=entrada]')?.addEventListener('change', updateCalculator);
  form.querySelector('[name=salida]')?.addEventListener('change', updateCalculator);
  form.querySelector('[name=huespedes]')?.addEventListener('input', updateCalculator);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate plan selection
    const planSelected = form.querySelector('[name=plan]:checked');
    const planError = document.getElementById('planError');
    if (!planSelected) {
      if (planError) planError.style.display = 'block';
      document.getElementById('planOptions')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (planError) planError.style.display = 'none';

    if (!validateForm(form)) return;

    // Validate email format
    const correoInput = form.querySelector('[name=correo]');
    const correoVal = correoInput?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correoVal)) {
      correoInput.classList.add('error');
      correoInput.closest('.form-group')?.querySelector('.form-error') &&
        (correoInput.closest('.form-group').querySelector('.form-error').style.display = 'block');
      correoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Validate guests per plan
    const huespedesVal = parseInt(form.querySelector('[name=huespedes]')?.value) || 0;
    const maxGuests    = PLAN_MAX[planSelected.value] || 40;
    const huespedesErr = document.getElementById('huespedesError');
    if (!huespedesVal || huespedesVal < 1 || huespedesVal > maxGuests) {
      if (huespedesErr) {
        const isEN = CONFIG.lang === 'en';
        huespedesErr.textContent = huespedesVal > maxGuests
          ? (isEN ? 'This plan has a max capacity of ' + maxGuests + ' guests.' : 'El plan ' + PLAN_LABELS[planSelected.value] + ' tiene capacidad maxima de ' + maxGuests + ' personas.')
          : (isEN ? 'Please enter the number of guests.' : 'Ingresa el numero de huespedes.');
        huespedesErr.style.display = 'block';
      }
      form.querySelector('[name=huespedes]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (huespedesErr) huespedesErr.style.display = 'none';

    const entrada  = form.querySelector('[name=entrada]')?.value || '';
    const salida   = form.querySelector('[name=salida]')?.value || '';
    const nights   = calcNights(entrada, salida);
    const price    = PLAN_PRICES[planSelected.value] || 0;
    const cocinero = form.querySelector('[name=cocinero]:checked')?.value || 'no';
    const chefCost = cocinero === 'si' && nights ? nights * huespedesVal * CHEF_PRICE : 0;

    const data = {
      nombre:    form.querySelector('[name=nombre]')?.value || '',
      telefono:  ((form.querySelector('[name=telefono_prefijo]')?.value || '+57') + ' ' + (form.querySelector('[name=telefono]')?.value || '')).trim(),
      correo:    correoVal,
      entrada,
      salida,
      nights,
      huespedes: huespedesVal,
      plan:      planSelected.value,
      cocinero,
      precio:    price,
      total:     nights * price + chefCost,
      mensaje:   form.querySelector('[name=mensaje]')?.value || '',
    };

    saveReservation(data).finally(() => {
      showBookingSuccess(data);
    });
  });
}

function showBookingSuccess(data) {
  const successEl = document.getElementById('bookingSuccess');
  if (!successEl) return;

  // Llenar resumen
  const summaryEl = document.getElementById('bookingSummary');
  if (summaryEl) {
    const rows = [
      ['Plan',           PLAN_LABELS[data.plan] || data.plan],
      ['Llegada',        data.entrada || '--'],
      ['Salida',         data.salida  || '--'],
      ['Noches',         data.nights  ? data.nights + ' noche(s)' : '--'],
      ['Huespedes',      data.huespedes || '--'],
      ['Cocinero',       data.cocinero === 'si' ? 'Si (+$100.000/persona/dia · 3 comidas)' : 'No'],
      ['Total estimado', data.total ? formatCOP(data.total) : '--'],
      ['Nombre',         data.nombre],
      ['Telefono',       data.telefono],
      ['Correo',         data.correo || '--'],
    ];
    summaryEl.innerHTML = rows.map(([l, v]) => `
      <div class="booking-success__row">
        <span class="booking-success__row-label">${l}</span>
        <span class="booking-success__row-value">${v}</span>
      </div>`).join('');
  }

  // WhatsApp link
  const waLink = document.getElementById('successWhatsApp');
  if (waLink) waLink.href = buildWhatsAppURL(buildReservationMessage(data));

  // Email
  const emailEl = document.getElementById('successEmailText');
  if (emailEl) {
    emailEl.textContent = data.correo
      ? 'Correo: ' + data.correo
      : 'Sin correo proporcionado';
  }

  // Mostrar y hacer scroll
  successEl.classList.add('visible');
  document.getElementById('reservaForm').style.display = 'none';
  successEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveReservation(data) {
  const reserva = {
    nombre:        data.nombre,
    email:         data.correo || null,
    telefono:      data.telefono,
    modalidad:     data.plan || 'cotizacion',
    fecha_entrada: data.entrada || null,
    fecha_salida:  data.salida  || null,
    huespedes:     parseInt(data.huespedes) || 1,
    cocinero:      data.cocinero === 'si',
    notas:         (data.mensaje || '') + (data.total ? ` | Total estimado: ${formatCOP(data.total)}` : ''),
    estado:        'pendiente'
  };

  function guardarLocal() {
    const stored = JSON.parse(localStorage.getItem('cabana_reservas') || '[]');
    const entry  = { id: Date.now(), ...reserva, correo: data.correo, fecha_creacion: new Date().toLocaleString('es-CO') };
    stored.unshift(entry);
    localStorage.setItem('cabana_reservas', JSON.stringify(stored));
    return entry;
  }

  try {
    const result = await sbInsert('reservas', reserva);
    return result;
  } catch (err) {
    console.warn('Supabase no disponible, guardando local:', err);
    return guardarLocal();
  }
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    if (!field.value.trim()) {
      field.classList.add('error');
      if (group) group.querySelector('.form-error')?.style && (group.querySelector('.form-error').style.display = 'block');
      valid = false;
    } else {
      field.classList.remove('error');
      if (group) group.querySelector('.form-error')?.style && (group.querySelector('.form-error').style.display = 'none');
    }
  });
  return valid;
}

/* ======================== DATE HELPERS ======================== */
function initDatePickers() {
  const entrada = document.querySelector('[name=entrada]');
  const salida  = document.querySelector('[name=salida]');
  if (!entrada || !salida) return;

  const today = new Date().toISOString().split('T')[0];
  entrada.min = today;
  salida.min  = today;

  entrada.addEventListener('change', () => {
    if (entrada.value) {
      salida.min = entrada.value;
      // If salida is set and is before/equal to entrada, clear it
      if (salida.value && salida.value <= entrada.value) {
        salida.value = '';
      }
    }
  });
}

/* ======================== COUNTER ANIMATION ======================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
    }
  }, 16);
}

/* ======================== VIDEO BACKGROUND ======================== */
function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  if (!video) return;
  // Lazy load the video source if using data-src
  if (video.dataset.src && !video.src) {
    video.src = video.dataset.src;
    video.load();
  }
}

/* ======================== GOOGLE MAPS EMBED ======================== */
function initMap() {
  const mapContainer = document.querySelector('#mapEmbed');
  if (!mapContainer) return;
  // Map is embedded via iframe in HTML; no JS needed
}

/* ======================== SMOOTH TABS ======================== */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const btns = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.querySelectorAll('.tab-panel');

    function activate(idx) {
      btns.forEach((b, i) => b.classList.toggle('active', i === idx));
      panels.forEach((p, i) => p.classList.toggle('hidden', i !== idx));
    }

    btns.forEach((btn, i) => btn.addEventListener('click', () => activate(i)));
    activate(0);
  });
}

/* ======================== INIT ======================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initLangToggle();
  initScrollAnimations();
  initScrollTop();
  initLightbox();
  initReservationForm();
  initDatePickers();
  initCounters();
  initHeroVideo();
  initMap();
  initTabs();
  initRipple();
  initSpotlight();
  initMagnetic();
  initFlipIn();
});

/* ======================== SPOTLIGHT CARDS ======================== */
function initSpotlight() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ======================== MAGNETIC BUTTONS ======================== */
function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.28;
      const dy = (e.clientY - r.top - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ======================== FLIP-IN OBSERVER ======================== */
function initFlipIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.flip-in').forEach(el => obs.observe(el));
}

/* ======================== RIPPLE EFFECT ======================== */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('btn-ripple');
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}
