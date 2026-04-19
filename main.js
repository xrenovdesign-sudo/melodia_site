import {
  brand,
  menu,
  productionCards,
  benefits,
  timeline,
  series,
  products,
  featuredProductIds,
  legalPolicy,
  legalOffer,
} from "./data.js";

const CART_KEY = "melodia-cart";
const SITE_URL = "https://naturemelody.ru";
const SERIES_PAGE_MAP = {
  comfort: "care-dry-skin.html",
  balance: "care-oily-skin.html",
  male: "care-aftershave.html",
  tonics: "care-tonics-hydrolats.html",
  renewal: "care-cleansing.html",
  rescue: "care-recovery-balms.html",
};

const page = document.body.dataset.page || "home";
const navPage = document.body.dataset.nav || page;
const cartState = loadCart();

const currency = new Intl.NumberFormat("ru-RU");

function byId(id) {
  return document.getElementById(id);
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function getSeries(slug) {
  return series.find((item) => item.slug === slug);
}

function getProduct(id) {
  return products.find((item) => item.id === id);
}

function productHref(id) {
  return `product-${id}.html`;
}

function seriesHref(slug) {
  return SERIES_PAGE_MAP[slug] || `catalog.html?series=${slug}`;
}

function absoluteUrl(path) {
  if (path === "/" || path === "index.html") {
    return `${SITE_URL}/`;
  }
  return path.startsWith("http") ? path : `${SITE_URL}/${path}`;
}

function upsertMeta(selector, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement("meta");
    document.head.append(node);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let node = document.head.querySelector('link[rel="canonical"]');
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    document.head.append(node);
  }
  node.setAttribute("href", href);
}

function applySeo({ title, description, canonical, robots, image = "assets/images/brand-shot.png" }) {
  document.title = title;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
  upsertCanonical(canonical);
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: absoluteUrl(image) });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: absoluteUrl(image) });
}

function loadCart() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart() {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cartState));
}

function formatPrice(value) {
  return `${currency.format(value)} ₽`;
}

function formatProductPrice(product) {
  return product.priceLabel || formatPrice(product.price);
}

function cartCount() {
  return cartState.reduce((sum, item) => sum + item.quantity, 0);
}

function cartTotal() {
  return cartState.reduce((sum, item) => {
    const product = getProduct(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

function buildOrderText() {
  if (!cartState.length) {
    return `Хочу подобрать уход от бренда «${brand.name}».`;
  }

  const lines = cartState
    .map((item, index) => {
      const product = getProduct(item.id);
      if (!product) {
        return null;
      }
      return `${index + 1}. ${product.title}, ${product.size} — ${item.quantity} шт.`;
    })
    .filter(Boolean);

  lines.push(`Итого: ${formatPrice(cartTotal())}`);
  lines.push("Нужна консультация по подбору ухода.");

  return lines.join("\n");
}

function addToCart(id) {
  const existing = cartState.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartState.push({ id, quantity: 1 });
  }
  saveCart();
  updateCart();
  openCart();
}

function removeFromCart(id) {
  const index = cartState.findIndex((item) => item.id === id);
  if (index === -1) {
    return;
  }

  if (cartState[index].quantity > 1) {
    cartState[index].quantity -= 1;
  } else {
    cartState.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function clearCart() {
  cartState.splice(0, cartState.length);
  saveCart();
  updateCart();
}

function openCart() {
  document.body.classList.add("cart-open");
  const drawer = qs("[data-cart-drawer]");
  if (drawer) {
    drawer.setAttribute("aria-hidden", "false");
  }
}

function closeCart() {
  document.body.classList.remove("cart-open");
  const drawer = qs("[data-cart-drawer]");
  if (drawer) {
    drawer.setAttribute("aria-hidden", "true");
  }
}

function renderHeader() {
  const links = menu
    .map((item) => {
      const active = item.slug === navPage ? "is-active" : "";
      return `<a class="nav__link ${active}" href="${item.href}">${item.label}</a>`;
    })
    .join("");

  return `
    <div class="topline">
      <div class="container topline__inner">
        <span>${brand.subtitle}</span>
        <a href="${brand.contacts.phoneLink}" class="topline__link">${brand.contacts.phone}</a>
      </div>
    </div>
    <div class="container nav">
      <a class="brandmark" href="/" aria-label="На главную">
      
        <span class="brandmark__title">${brand.displayName}</span>
        <span class="brandmark__subtitle">${brand.headerNote || "авторская косметика"}</span>
      </a>
      <nav class="nav__menu" aria-label="Основная навигация">
        ${links}
      </nav>
      <div class="nav__actions">
        <a class="button button_ghost nav__action" href="${brand.contacts.telegramProfile}">Написать Юлии</a>
        <button class="cart-button" type="button" data-cart-toggle>
          Корзина
          <span class="cart-button__count" data-cart-count>${cartCount()}</span>
        </button>
      </div>
    </div>
  `;
}

function renderFooter() {
  const links = menu
    .map((item) => `<a class="footer__link" href="${item.href}">${item.label}</a>`)
    .join("");

  const contactLinks = [
    `<a class="footer__link" href="${brand.contacts.phoneLink}">${brand.contacts.phone}</a>`,
    brand.contacts.email ? `<a class="footer__link" href="${brand.contacts.emailLink}">${brand.contacts.email}</a>` : "",
    brand.contacts.telegramProfile ? `<a class="footer__link" href="${brand.contacts.telegramProfile}">Telegram</a>` : "",
    brand.contacts.max ? `<a class="footer__link" href="${brand.contacts.max}">MAX</a>` : "",
    brand.contacts.vk ? `<a class="footer__link" href="${brand.contacts.vk}">VK</a>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <div class="container footer__grid">
      <div>
        <div class="footer__brand">${brand.displayName}</div>
        <p class="footer__copy">${brand.footerCopy}</p>
      </div>
      <div>
        <div class="footer__eyebrow">Навигация</div>
        <div class="footer__links">${links}</div>
      </div>
      <div>
        <div class="footer__eyebrow">Контакты</div>
        <div class="footer__links">${contactLinks}</div>
      </div>
      <div>
        <div class="footer__eyebrow">Юридическое</div>
        <div class="footer__links">
          <a class="footer__link" href="policy.html">Политика</a>
          <a class="footer__link" href="offer.html">Оферта</a>
        </div>
      </div>
    </div>
  `;
}

function renderCartDrawer() {
  return `
    <div class="cart-backdrop" data-cart-close></div>
    <aside class="cart-drawer" aria-hidden="true" data-cart-drawer>
      <div class="cart-drawer__header">
        <div>
          <div class="eyebrow">Корзина</div>
          <h2>Ваш ритуал ухода</h2>
        </div>
        <button class="icon-button" type="button" data-cart-close aria-label="Закрыть корзину">×</button>
      </div>
      <div class="cart-drawer__content" data-cart-items></div>
      <div class="cart-drawer__footer">
        <div class="cart-summary">
          <span>Итого</span>
          <strong data-cart-total>${formatPrice(cartTotal())}</strong>
        </div>
        <div class="cart-drawer__actions">
          <button class="button button_secondary" type="button" data-copy-order>Скопировать заказ</button>
          <a class="button" target="_blank" rel="noreferrer" data-telegram-order href="${brand.contacts.telegramShareBase}">Передать в Telegram</a>
        </div>
        <button class="text-button" type="button" data-clear-cart>Очистить корзину</button>
      </div>
    </aside>
  `;
}

function renderCartItems() {
  if (!cartState.length) {
    return `
      <div class="empty-state">
        <p>Корзина пока пустая.</p>
        <p>Удобнее всего начать с серий, затем открыть каталог и уже после этого собрать заказ в мессенджер.</p>
        <a class="button button_secondary" href="catalog.html">Перейти в каталог</a>
      </div>
    `;
  }

  return cartState
    .map((item) => {
      const product = getProduct(item.id);
      if (!product) {
        return "";
      }

      return `
        <article class="cart-item">
          <img class="cart-item__image" src="${product.cover}" alt="${product.title}">
          <div class="cart-item__body">
            <div class="cart-item__series">${product.seriesName} · ${product.category}</div>
            <h3>${product.title}</h3>
            <p>${product.size}</p>
            <div class="cart-item__row">
              <strong>${formatPrice(product.price)}</strong>
              <div class="cart-item__controls">
                <button type="button" class="icon-button" data-remove-cart="${product.id}" aria-label="Уменьшить количество">−</button>
                <span>${item.quantity}</span>
                <button type="button" class="icon-button" data-add-to-cart="${product.id}" aria-label="Увеличить количество">+</button>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateCart() {
  qsa("[data-cart-count]").forEach((node) => {
    node.textContent = cartCount();
  });

  const items = qs("[data-cart-items]");
  if (items) {
    items.innerHTML = renderCartItems();
  }

  const total = qs("[data-cart-total]");
  if (total) {
    total.textContent = formatPrice(cartTotal());
  }

  const telegramOrder = qs("[data-telegram-order]");
  if (telegramOrder) {
    telegramOrder.href = `${brand.contacts.telegramShareBase}${encodeURIComponent(buildOrderText())}`;
  }
}

function createGallery(images, title, compact = false) {
  const controls = images.length > 1;
  const dots = images
    .map(
      (_, index) =>
        `<button class="gallery__dot ${index === 0 ? "is-active" : ""}" type="button" data-gallery-dot="${index}" aria-label="Слайд ${index + 1}"></button>`
    )
    .join("");

  return `
    <div class="gallery ${compact ? "gallery_compact" : ""}" data-gallery>
      <div class="gallery__viewport">
        ${controls ? `<button class="gallery__arrow gallery__arrow_prev" type="button" data-gallery-prev aria-label="Предыдущий слайд">‹</button>` : ""}
        ${images
          .map(
            (src, index) =>
              `<img class="gallery__image ${index === 0 ? "is-active" : ""}" src="${src}" alt="${title}" data-gallery-image>`
          )
          .join("")}
        ${controls ? `<button class="gallery__arrow gallery__arrow_next" type="button" data-gallery-next aria-label="Следующий слайд">›</button>` : ""}
      </div>
      ${controls ? `<div class="gallery__dots">${dots}</div>` : ""}
    </div>
  `;
}

function mountGalleries(root = document) {
  qsa("[data-gallery]", root).forEach((gallery) => {
    if (gallery.dataset.ready === "true") {
      return;
    }

    const images = qsa("[data-gallery-image]", gallery);
    const dots = qsa("[data-gallery-dot]", gallery);
    let index = 0;

    function draw() {
      images.forEach((node, imageIndex) => {
        node.classList.toggle("is-active", imageIndex === index);
      });
      dots.forEach((node, dotIndex) => {
        node.classList.toggle("is-active", dotIndex === index);
      });
    }

    qs("[data-gallery-prev]", gallery)?.addEventListener("click", () => {
      index = (index - 1 + images.length) % images.length;
      draw();
    });

    qs("[data-gallery-next]", gallery)?.addEventListener("click", () => {
      index = (index + 1) % images.length;
      draw();
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        index = Number(dot.dataset.galleryDot);
        draw();
      });
    });

    gallery.dataset.ready = "true";
    draw();
  });
}

function createFeaturedCard(product) {
  return `
    <article class="mini-product">
      <img class="mini-product__image" src="${product.cover}" alt="${product.title}">
      <div class="mini-product__body">
        <div class="eyebrow">${product.seriesName} · ${product.category}</div>
        <h3>${product.title}</h3>
        <p>${product.shortDescription}</p>
        <div class="mini-product__footer">
          <strong>${formatProductPrice(product)}</strong>
          <a class="text-link" href="${productHref(product.id)}">Карточка товара</a>
        </div>
      </div>
    </article>
  `;
}

function createSeriesCard(line) {
  return `
    <article class="series-card">
      <div class="series-card__media">
        <img src="${line.promo}" alt="${line.name}">
      </div>
      <div class="series-card__body">
        <div class="series-card__badge">${line.icon}</div>
        <div class="eyebrow">${line.label}</div>
        <h3>${line.name}</h3>
        <p class="series-card__skin">${line.skin}</p>
        <p>${line.long}</p>
        <ul class="bullet-list">
          ${line.focus.map((point) => `<li>${point}</li>`).join("")}
        </ul>
        <div class="button-row">
          <a class="button" href="${seriesHref(line.slug)}">Открыть серию</a>
          <a class="button button_secondary" href="${productHref(line.exampleProductId)}">Смотреть пример карточки</a>
        </div>
      </div>
    </article>
  `;
}

function createCatalogCard(product, index) {
  return `
    <article class="catalog-card ${index % 2 === 1 ? "catalog-card_reverse" : ""}">
      <div class="catalog-card__media">
        ${createGallery(product.gallery, product.title, true)}
      </div>
      <div class="catalog-card__body">
        <div class="catalog-card__eyebrow">${product.seriesName} · ${product.seriesLabel}</div>
        <h2>${product.title}</h2>
        <p class="catalog-card__summary">${product.shortDescription}</p>
        <ul class="bullet-list bullet-list_compact">
          ${product.benefits.map((point) => `<li>${point}</li>`).join("")}
        </ul>
        <div class="catalog-card__meta">
          <div>
            <span class="catalog-card__meta-label">Формат</span>
            <strong>${product.size}</strong>
          </div>
          <div>
            <span class="catalog-card__meta-label">Цена</span>
            <strong>${formatProductPrice(product)}</strong>
          </div>
        </div>
        <div class="button-row">
          <button class="button" type="button" data-add-to-cart="${product.id}">Добавить в корзину</button>
          <a class="button button_secondary" href="${productHref(product.id)}">Узнать подробнее</a>
        </div>
      </div>
    </article>
  `;
}

function renderHomePage() {
  const featured = featuredProductIds.map((id) => getProduct(id)).filter(Boolean);

  const productionGrid = byId("production-grid");
  if (productionGrid) {
    productionGrid.innerHTML = productionCards
      .map(
        (item) => `
          <article class="story-card">
            <img class="story-card__image" src="${item.image}" alt="${item.title}">
            <div class="story-card__body">
              <div class="eyebrow">Производство</div>
              <h3>${item.title}</h3>
              <p>${item.copy}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  const benefitsGrid = byId("benefits-grid");
  if (benefitsGrid) {
    benefitsGrid.innerHTML = benefits
      .map(
        (item) => `
          <article class="benefit-card">
            <div class="eyebrow">Преимущество</div>
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </article>
        `
      )
      .join("");
  }

  const seriesPreview = byId("series-preview");
  if (seriesPreview) {
    seriesPreview.innerHTML = series
      .map(
        (line) => `
          <article class="series-preview">
            <img src="${line.image}" alt="${line.name}">
            <div class="series-preview__body">
              <div class="eyebrow">${line.label}</div>
              <h3>${line.name}</h3>
              <p>${line.short}</p>
              <a class="text-link" href="${seriesHref(line.slug)}">Перейти к серии</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  const featuredGrid = byId("featured-grid");
  if (featuredGrid) {
    featuredGrid.innerHTML = featured.map((product) => createFeaturedCard(product)).join("");
  }
}

function renderAboutPage() {
  const timelineGrid = byId("timeline-grid");
  if (timelineGrid) {
    timelineGrid.innerHTML = timeline
      .map(
        (item) => `
          <article class="timeline-card">
            <div class="timeline-card__stage">${item.year}</div>
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </article>
        `
      )
      .join("");
  }

  const valuesGrid = byId("values-grid");
  if (valuesGrid) {
    valuesGrid.innerHTML = benefits
      .map(
        (item) => `
          <article class="value-card">
            <h3>${item.title}</h3>
            <p>${item.copy}</p>
          </article>
        `
      )
      .join("");
  }
}

function renderSeriesPage() {
  const grid = byId("series-grid");
  if (grid) {
    grid.innerHTML = series.map((line) => createSeriesCard(line)).join("");
  }
}

function renderCatalogPage() {
  const params = new URLSearchParams(window.location.search);
  const activeSeries = params.get("series") || "all";

  const filterBar = byId("catalog-filters");
  if (filterBar) {
    const filters = [
      { slug: "all", label: "Все товары" },
      ...series.map((item) => ({ slug: item.slug, label: item.name })),
    ];

    filterBar.innerHTML = filters
      .map(
        (item) => `
          <button class="filter-chip ${item.slug === activeSeries ? "is-active" : ""}" type="button" data-series-filter="${item.slug}">
            ${item.label}
          </button>
        `
      )
      .join("");
  }

  const activeLine = activeSeries === "all" ? null : getSeries(activeSeries);
  const headline = byId("catalog-headline");
  const copy = byId("catalog-copy");
  if (headline) {
    headline.textContent = activeLine ? `Каталог серии ${activeLine.name}` : "Каталог ухода";
  }
  if (copy) {
    copy.textContent = activeLine
      ? `${activeLine.long} Ниже собраны средства этой линии. Сначала можно сравнить карточки по текстуре и задаче, а затем уже уточнить партию или подбор напрямую у Юлии.`
      : "В каталоге собраны актуальные средства бренда. Удобнее всего идти от серии к карточке: сначала задача кожи, затем формула, формат и уточнение у Юлии, если нужен более точный подбор.";
  }

  applySeo(
    activeLine
      ? {
          title: `Каталог серии ${activeLine.name} | Мелодия природы`,
          description: `${activeLine.short} В фильтре собраны только средства этой линии.`,
          canonical: absoluteUrl(seriesHref(activeLine.slug)),
          robots: "noindex,follow",
          image: activeLine.promo || activeLine.image,
        }
      : {
          title: "Каталог натуральной уходовой косметики | Мелодия природы",
          description:
            "Каталог бренда «Мелодия природы»: кремы, бальзамы, тоники, гидролаты и очищающие средства с карточками, составами и сценариями применения.",
          canonical: absoluteUrl("catalog.html"),
          robots: "index,follow,max-image-preview:large",
          image: "assets/images/brand-shot.png",
        }
  );

  const filtered = activeSeries === "all" ? products : products.filter((item) => item.series === activeSeries);
  const list = byId("catalog-list");
  if (list) {
    list.innerHTML = filtered.map((product, index) => createCatalogCard(product, index)).join("");
  }

  mountGalleries(list || document);
}

function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const routedId = document.body.dataset.productId;
  const id = routedId || params.get("id");
  const product = getProduct(id);
  const shell = byId("product-shell");

  if (!routedId && id) {
    window.location.replace(productHref(id));
    return;
  }

  if (!shell) {
    return;
  }

  if (!product) {
    shell.innerHTML = `
      <div class="container narrow">
        <div class="empty-state">
          <p>Товар не найден.</p>
          <a class="button" href="catalog.html">Вернуться в каталог</a>
        </div>
      </div>
    `;
    return;
  }

  const line = getSeries(product.series);
  const related = products.filter((item) => item.series === product.series && item.id !== product.id).slice(0, 3);

  shell.innerHTML = `
    <section class="section">
      <div class="container product-hero">
        <div class="product-hero__gallery">
          ${createGallery(product.gallery, product.title)}
        </div>
        <div class="product-hero__body">
          <div class="eyebrow">${product.seriesName} · ${product.seriesLabel}</div>
          <h1>${product.title}</h1>
          <p class="product-hero__lead">${product.heroText}</p>
          <div class="product-price">
            <strong>${formatProductPrice(product)}</strong>
            <span>${product.size}</span>
          </div>
          <ul class="bullet-list">
            ${product.benefits.map((point) => `<li>${point}</li>`).join("")}
          </ul>
          <div class="button-row">
            <button class="button" type="button" data-add-to-cart="${product.id}">Добавить в корзину</button>
            <a class="button button_secondary" href="${seriesHref(product.series)}">Назад к серии</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section section_tinted">
      <div class="container product-details">
        <article class="detail-card">
          <div class="eyebrow">Описание</div>
          <h2>Что делает формула</h2>
          <p>${product.intro}</p>
        </article>
        <article class="detail-card">
          <div class="eyebrow">Применение</div>
          <h2>Как использовать</h2>
          <p>${product.usage}</p>
        </article>
        <article class="detail-card">
          <div class="eyebrow">INCI</div>
          <h2>Состав</h2>
          <p>${product.inci}</p>
        </article>
        <article class="detail-card">
          <div class="eyebrow">Ключевые ингредиенты</div>
          <h2>На чём держится результат</h2>
          <div class="ingredient-list">
            ${product.keyIngredients
              .map(
                (item) => `
                  <div class="ingredient-item">
                    <strong>${item.name}</strong>
                    <p>${item.description}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
        <article class="detail-card detail-card_wide">
          <div class="eyebrow">Основная информация</div>
          <h2>Что ещё важно знать</h2>
          <ul class="bullet-list">
            ${product.productInfo.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="detail-card detail-card_wide">
          <div class="eyebrow">Логика серии</div>
          <h2>${line.name}: ${line.accent}</h2>
          <p>${line.long}</p>
        </article>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Ещё из серии</div>
          <h2>Продолжить ритуал ${line.name}</h2>
        </div>
        <div class="mini-grid">
          ${related.map((item) => createFeaturedCard(item)).join("")}
        </div>
      </div>
    </section>
  `;

  mountGalleries(shell);
}

function renderLegalPage(data, title) {
  const shell = byId("legal-shell");
  if (!shell) {
    return;
  }

  shell.innerHTML = `
    <section class="section">
      <div class="container narrow">
        <div class="section-head">
          <div class="eyebrow">Юридический блок</div>
          <h1>${title}</h1>
          <p>
            Информационный раздел бренда «${brand.name}». Перед запуском продаж стоит проверить
            актуальность реквизитов, условий оплаты, доставки и возврата.
          </p>
        </div>
        <div class="legal-stack">
          ${data
            .map(
              (item) => `
                <article class="legal-card">
                  <h2>${item.title}</h2>
                  <p>${item.copy}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function mountShell() {
  const header = qs('[data-shell="header"]');
  const footer = qs('[data-shell="footer"]');

  if (header) {
    header.innerHTML = renderHeader();
  }

  if (footer) {
    footer.innerHTML = renderFooter();
  }

  document.body.insertAdjacentHTML("beforeend", renderCartDrawer());
  updateCart();
}

function setupEvents() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.dataset.addToCart);
      return;
    }

    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
      removeFromCart(removeButton.dataset.removeCart);
      return;
    }

    if (event.target.closest("[data-cart-toggle]")) {
      openCart();
      return;
    }

    if (event.target.closest("[data-cart-close]")) {
      closeCart();
      return;
    }

    if (event.target.closest("[data-clear-cart]")) {
      clearCart();
      return;
    }

    if (event.target.closest("[data-copy-order]")) {
      navigator.clipboard
        .writeText(buildOrderText())
        .then(() => {
          const button = event.target.closest("[data-copy-order]");
          if (!button) {
            return;
          }
          const original = button.textContent;
          button.textContent = "Скопировано";
          window.setTimeout(() => {
            button.textContent = original;
          }, 1400);
        })
        .catch(() => {});
      return;
    }

    const filter = event.target.closest("[data-series-filter]");
    if (filter && page === "catalog") {
      const params = new URLSearchParams(window.location.search);
      const slug = filter.dataset.seriesFilter;
      if (slug === "all") {
        params.delete("series");
      } else {
        params.set("series", slug);
      }
      const next = params.toString() ? `catalog.html?${params.toString()}` : "catalog.html";
      window.history.replaceState({}, "", next);
      renderCatalogPage();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  });
}

function initPage() {
  if (page === "home") {
    renderHomePage();
  }

  if (page === "about") {
    renderAboutPage();
  }

  if (page === "series") {
    renderSeriesPage();
  }

  if (page === "catalog") {
    renderCatalogPage();
  }

  if (page === "product") {
    renderProductPage();
  }

  if (page === "policy") {
    renderLegalPage(legalPolicy, "Политика конфиденциальности");
  }

  if (page === "offer") {
    renderLegalPage(legalOffer, "Публичная оферта");
  }
}

mountShell();
setupEvents();
initPage();
mountGalleries();
