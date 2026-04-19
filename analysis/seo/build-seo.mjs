import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { brand, series, products } from "../../data.js";

const ROOT = process.cwd();
const SITE_URL = "https://xrenovdesign-sudo.github.io/melodia_site";
const TODAY = new Date().toISOString().slice(0, 10);
const DEFAULT_IMAGE = "assets/images/brand-shot.png";

const SERIES_LANDING_CONFIG = {
  comfort: {
    file: "care-dry-skin.html",
    title: "Уход для сухой, зрелой и чувствительной кожи | Мелодия природы",
    description:
      "Кремы и питательные формулы для сухой, зрелой и чувствительной кожи: мягкое увлажнение, защита барьера и комфорт без перегруза.",
    intro:
      "Эта посадочная закрывает сценарии, где кожа быстро теряет комфорт, шелушится, реагирует на сухой воздух и просит более плотной поддержки без тяжёлого ощущения маски.",
    firstStep:
      "Если кожа просто сухая и нужен понятный ежедневный крем, удобнее начинать с Flora. Если привычных кремов уже мало, логичнее смотреть на обратные эмульсии и ночные форматы.",
    faq: [
      {
        question: "Кому в первую очередь подходит эта серия?",
        answer:
          "Тем, у кого сухая, зрелая, чувствительная или обезвоженная кожа и кто ищет не агрессивные активы, а ощущение мягкости, питания и защиты от потери влаги.",
      },
      {
        question: "С чего начать знакомство с серией?",
        answer:
          "С базового дневного или универсального крема. Если сухость выраженная и кожа быстро теряет комфорт, лучше сразу смотреть более плотные форматы и ночные средства.",
      },
      {
        question: "Подойдёт ли серия на каждый день?",
        answer:
          "Да. Внутри линии есть спокойные ежедневные формулы, которые можно встроить и в утренний, и в вечерний уход.",
      },
    ],
  },
  balance: {
    file: "care-oily-skin.html",
    title: "Уход для жирной и комбинированной кожи | Мелодия природы",
    description:
      "Себорегулирующий уход для жирной и комбинированной кожи: меньше блеска, спокойнее рельеф и лёгкие текстуры без пересушивания.",
    intro:
      "Серия закрывает частый запрос: уменьшить жирный блеск и ощущение перегруза, но не превратить уход в жёсткое матирование, после которого кожа только сильнее реагирует.",
    firstStep:
      "Если цель — базовый ежедневный крем без жирной плёнки, начинать лучше с себорегулирующего крема. Если нужен полный маршрут, сначала посмотреть всю линию и уже потом сравнивать карточки по составу.",
    faq: [
      {
        question: "Это серия только для молодой жирной кожи?",
        answer:
          "Нет. Она подходит и зрелой комбинированной коже, когда нужен баланс между контролем себума, лёгкой текстурой и поддержкой комфорта.",
      },
      {
        question: "Есть ли риск пересушивания?",
        answer:
          "Логика серии как раз в том, чтобы работать мягче: контролировать себум и внешний блеск, не создавая агрессивного ощущения после умывания и крема.",
      },
      {
        question: "С какого средства лучше начать?",
        answer:
          "С базового крема, который закрывает ежедневный уход. Дальше можно добавлять водный этап или очищение в зависимости от состояния кожи.",
      },
    ],
  },
  male: {
    file: "care-aftershave.html",
    title: "Мужской уход и бальзамы после бритья | Мелодия природы",
    description:
      "Мужской уход после бритья: бальзамы и кремовые формулы для комфорта, снятия раздражения и ежедневного использования без липкости.",
    intro:
      "Посадочная собрана под понятный повседневный сценарий: кожа после бритья краснеет, сохнет или просто требует спокойного кремового ухода без сложной многоступенчатой схемы.",
    firstStep:
      "Если после бритья чаще нужен мягкий комфорт, стоит идти в классический бальзам. Если хочется охлаждения и более свежего ощущения, лучше смотреть формулу с ментолом.",
    faq: [
      {
        question: "Это уход только после бритья?",
        answer:
          "Нет. Несколько формул можно использовать и как обычный мужской крем утром или вечером, если нравится их текстура и ощущение на коже.",
      },
      {
        question: "Есть ли варианты без резкого охлаждения?",
        answer:
          "Да. В линии есть и более мягкие бальзамы без ментола, и освежающие варианты для тех, кто любит холодящий эффект после бритья.",
      },
      {
        question: "С чего начинать мужской уход на этом сайте?",
        answer:
          "С выбора сценария: нужен ли ежедневный кремовый комфорт или именно формула после бритья. После этого уже проще открыть конкретную карточку.",
      },
    ],
  },
  tonics: {
    file: "care-tonics-hydrolats.html",
    title: "Тоники и гидролаты для лица | Мелодия природы",
    description:
      "Тоники и гидролаты для лица: мягкий водный этап ухода, выравнивание pH после умывания и растительная база собственного приготовления.",
    intro:
      "Эта страница нужна тем, кто хочет не пропускать водный этап ухода: после умывания быстрее вернуть коже комфорт, подготовить её к крему и выбрать гидролат или тоник под свой сценарий.",
    firstStep:
      "Если нужен максимально чистый и универсальный формат, начать стоит с гидролата. Если хочется более адресного эффекта по типу кожи, логичнее сразу открыть тоник с активами.",
    faq: [
      {
        question: "Чем гидролат отличается от тоника?",
        answer:
          "Гидролат — это более чистая растительная вода без сложной формулы. Тоник — водный этап с дополнительными активами под конкретный тип кожи и задачу.",
      },
      {
        question: "Нужен ли этот этап, если уже есть крем?",
        answer:
          "Да, особенно если кожа реагирует на жёсткую воду. Тоник или гидролат помогает быстрее вернуть комфорт после умывания и сделать следующий шаг мягче.",
      },
      {
        question: "С чего начать, если опыта с гидролатами не было?",
        answer:
          "С универсального гидролата или базового тоника под свой тип кожи. Это самый понятный вход в водный этап ухода без перегруза.",
      },
    ],
  },
  renewal: {
    file: "care-cleansing.html",
    title: "Мягкое очищение и обновление кожи | Мелодия природы",
    description:
      "Мягкое очищение лица, энзимное и деликатное обновление кожи без скрипа и пересушивания. Подбор средств для чистого старта ухода.",
    intro:
      "Посадочная отвечает на сценарий, когда нужен аккуратный reset: убрать загрязнения, снизить ощущение шероховатости и подготовить кожу к крему без агрессивного очищения.",
    firstStep:
      "Если задача — ежедневное очищение, начинать лучше с мягкого средства на каждый день. Если хочется выровнять текстуру и добавить обновление, смотреть формулы с энзимным или кислотным акцентом.",
    faq: [
      {
        question: "Это серия для ежедневного умывания или для более редкого обновления?",
        answer:
          "Внутри линии могут быть оба сценария. Один закрывает мягкий ежедневный старт, другой — более адресное обновление кожи по графику.",
      },
      {
        question: "Подойдёт ли серия чувствительной коже?",
        answer:
          "Да, если выбирать деликатные форматы и не перегружать ритуал частым отшелушиванием. На сайте удобно начать с карточки и посмотреть сценарий применения.",
      },
      {
        question: "Зачем заводить отдельную посадочную под очищение?",
        answer:
          "Потому что очищение — частый самостоятельный интент в поиске: люди ищут не бренд, а решение задачи, и именно эта страница должна его ловить.",
      },
    ],
  },
  rescue: {
    file: "care-recovery-balms.html",
    title: "Бальзамы для губ, рук и сухих участков кожи | Мелодия природы",
    description:
      "Локальное восстановление кожи: кремы и бальзамы для рук, губ, пяток и зон сильной сухости с быстрым ощущением смягчения.",
    intro:
      "Страница закрывает бытовой и при этом очень коммерческий спрос: сухие руки, губы, трещины, пятки и участки, которым нужен быстрый комфорт без сложной схемы ухода.",
    firstStep:
      "Если проблема локальная и понятная, можно сразу идти в карточку нужного средства. Если нужно сравнить несколько формул, удобнее сначала посмотреть подборку целиком.",
    faq: [
      {
        question: "Какие задачи закрывает эта серия?",
        answer:
          "Сухие руки, губы, пятки, локти и зоны с выраженным дискомфортом, где нужен плотный уход и защита от дальнейшего пересыхания.",
      },
      {
        question: "Подходит ли серия для ежедневного применения?",
        answer:
          "Да. Часть средств логично использовать каждый день, часть — как SOS-поддержку на ночь или в периоды сильной сухости.",
      },
      {
        question: "Почему это отдельная SEO-посадочная?",
        answer:
          "Потому что запросы про руки, губы и трещины часто ищут отдельно от ухода за лицом, и для них нужен самостоятельный входной экран.",
      },
    ],
  },
};

const ROOT_PAGES = [
  { file: "index.html", priority: "1.0", changefreq: "weekly" },
  { file: "about.html", priority: "0.7", changefreq: "monthly" },
  { file: "series.html", priority: "0.9", changefreq: "weekly" },
  { file: "catalog.html", priority: "0.9", changefreq: "weekly" },
];

const SEMANTIC_SEEDS = [
  { query: "натуральная косметика ручной работы", target: "index.html" },
  { query: "авторская косметика для лица", target: "index.html" },
  { query: "домашняя мастерская косметики", target: "about.html" },
  { query: "подбор ухода по типу кожи", target: "series.html" },
  { query: "крем для сухой кожи лица", target: SERIES_LANDING_CONFIG.comfort.file },
  { query: "крем для зрелой кожи лица", target: SERIES_LANDING_CONFIG.comfort.file },
  { query: "крем для чувствительной кожи лица", target: SERIES_LANDING_CONFIG.comfort.file },
  { query: "крем для жирной кожи лица", target: SERIES_LANDING_CONFIG.balance.file },
  { query: "крем для комбинированной кожи лица", target: SERIES_LANDING_CONFIG.balance.file },
  { query: "себорегулирующий крем для лица", target: SERIES_LANDING_CONFIG.balance.file },
  { query: "бальзам после бритья", target: SERIES_LANDING_CONFIG.male.file },
  { query: "крем после бритья для мужчин", target: SERIES_LANDING_CONFIG.male.file },
  { query: "гидролат для лица", target: SERIES_LANDING_CONFIG.tonics.file },
  { query: "тоник для лица", target: SERIES_LANDING_CONFIG.tonics.file },
  { query: "мягкое очищение лица", target: SERIES_LANDING_CONFIG.renewal.file },
  { query: "энзимное очищение лица", target: SERIES_LANDING_CONFIG.renewal.file },
  { query: "пенка для умывания лица", target: SERIES_LANDING_CONFIG.renewal.file },
  { query: "пилинг для лица", target: SERIES_LANDING_CONFIG.renewal.file },
  { query: "крем для рук от сухости", target: SERIES_LANDING_CONFIG.rescue.file },
  { query: "бальзам для губ натуральный", target: SERIES_LANDING_CONFIG.rescue.file },
  { query: "крем для пяток от трещин", target: SERIES_LANDING_CONFIG.rescue.file },
];

const NOISE_PATTERNS = [
  /\b(nivea|proraso|gillette|faberlic|bioderma|avene|aven|kora|angiofarm|dove|dana)\b/i,
  /нивея|проросо|жиллет|фаберлик|биодерма|авен|кора|ангиофарм|дав|биозон|фикс прайс|дана/i,
  /магнит косметик/i,
  /невская косметика/i,
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeJson(value) {
  return JSON.stringify(value, null, 2);
}

function toAbsoluteUrl(file) {
  return `${SITE_URL}/${file}`;
}

function toImageUrl(src) {
  if (!src) {
    return toAbsoluteUrl(DEFAULT_IMAGE);
  }
  return src.startsWith("http") ? src : toAbsoluteUrl(src);
}

function pageMetaTags({ title, description, canonical, image, robots = "index,follow,max-image-preview:large", type = "website" }) {
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="${escapeHtml(robots)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:locale" content="ru_RU">
    <meta property="og:type" content="${escapeHtml(type)}">
    <meta property="og:site_name" content="${escapeHtml(brand.displayName)}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(toImageUrl(image))}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(toImageUrl(image))}">
  `.trim();
}

function renderHead(meta, schemaItems = []) {
  const schema = schemaItems
    .filter(Boolean)
    .map((item) => `<script type="application/ld+json">${escapeJson(item)}</script>`)
    .join("\n    ");

  return `
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${pageMetaTags(meta)}
    <link rel="icon" href="assets/images/cream-flora-photo.png" type="image/png">
    <link rel="stylesheet" href="styles.css">
    ${schema}
  </head>`.trimEnd();
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.displayName,
    url: `${SITE_URL}/index.html`,
    logo: toImageUrl("assets/images/cream-flora-photo.png"),
    image: toImageUrl(DEFAULT_IMAGE),
    telephone: brand.contacts.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Балакирево",
      addressRegion: "Владимирская область",
      addressCountry: "RU",
    },
    sameAs: [brand.contacts.telegramProfile, brand.contacts.max, brand.contacts.vk].filter(Boolean),
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function productSchema(product, line, file) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.gallery.map((src) => toImageUrl(src)),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: brand.displayName,
    },
    category: `${line.name} / ${product.category}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      url: toAbsoluteUrl(file),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

function collectionPageSchema(line, file, items) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: line.name,
    description: line.long,
    url: toAbsoluteUrl(file),
    about: {
      "@type": "Thing",
      name: line.label,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(productFile(product)),
        name: product.title,
      })),
    },
  };
}

function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function productFile(product) {
  return `product-${product.id}.html`;
}

function seriesFile(slug) {
  return SERIES_LANDING_CONFIG[slug].file;
}

function galleryHtml(images, title, compact = false) {
  const dots = images
    .map(
      (_, index) =>
        `<button class="gallery__dot ${index === 0 ? "is-active" : ""}" type="button" data-gallery-dot="${index}" aria-label="Слайд ${index + 1}"></button>`
    )
    .join("");

  return `
    <div class="gallery ${compact ? "gallery_compact" : ""}" data-gallery>
      <div class="gallery__viewport">
        ${images.length > 1 ? `<button class="gallery__arrow gallery__arrow_prev" type="button" data-gallery-prev aria-label="Предыдущий слайд">‹</button>` : ""}
        ${images
          .map(
            (src, index) =>
              `<img class="gallery__image ${index === 0 ? "is-active" : ""}" src="${escapeHtml(src)}" alt="${escapeHtml(title)}" data-gallery-image>`
          )
          .join("")}
        ${images.length > 1 ? `<button class="gallery__arrow gallery__arrow_next" type="button" data-gallery-next aria-label="Следующий слайд">›</button>` : ""}
      </div>
      ${images.length > 1 ? `<div class="gallery__dots">${dots}</div>` : ""}
    </div>
  `;
}

function miniCardHtml(product) {
  return `
    <article class="mini-product">
      <img class="mini-product__image" src="${escapeHtml(product.cover)}" alt="${escapeHtml(product.title)}">
      <div class="mini-product__body">
        <div class="eyebrow">${escapeHtml(product.seriesName)} · ${escapeHtml(product.category)}</div>
        <h3>${escapeHtml(product.title)}</h3>
        <p>${escapeHtml(product.shortDescription)}</p>
        <div class="mini-product__footer">
          <strong>${escapeHtml(product.priceLabel || `${product.price} ₽`)}</strong>
          <a class="text-link" href="${escapeHtml(productFile(product))}">Карточка товара</a>
        </div>
      </div>
    </article>
  `;
}

function productPageHtml(product) {
  const line = series.find((item) => item.slug === product.series);
  const related = products.filter((item) => item.series === product.series && item.id !== product.id).slice(0, 3);
  const file = productFile(product);
  const canonical = toAbsoluteUrl(file);
  const description = `${product.shortDescription} ${product.priceLabel || `${product.price} ₽`}. ${product.size}.`;

  const schema = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "Главная", url: toAbsoluteUrl("index.html") },
      { name: "Каталог", url: toAbsoluteUrl("catalog.html") },
      { name: line.name, url: toAbsoluteUrl(seriesFile(line.slug)) },
      { name: product.title, url: canonical },
    ]),
    productSchema(product, line, file),
  ];

  return `<!DOCTYPE html>
<html lang="ru">
${renderHead(
  {
    title: `${product.title} | ${line.name} | ${brand.displayName}`,
    description,
    canonical,
    image: product.cover,
    type: "product",
  },
  schema
)}
  <body data-page="product-entry" data-nav="catalog">
    <header class="site-header" data-shell="header"></header>
    <main>
      <section class="section">
        <div class="container product-hero">
          <div class="product-hero__gallery">
            ${galleryHtml(product.gallery, product.title)}
          </div>
          <div class="product-hero__body">
            <div class="eyebrow">${escapeHtml(line.name)} · ${escapeHtml(line.label)}</div>
            <h1>${escapeHtml(product.title)}</h1>
            <p class="product-hero__lead">${escapeHtml(product.heroText)}</p>
            <div class="product-price">
              <strong>${escapeHtml(product.priceLabel || `${product.price} ₽`)}</strong>
              <span>${escapeHtml(product.size)}</span>
            </div>
            <ul class="bullet-list">
              ${product.benefits.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
            <div class="button-row">
              <button class="button" type="button" data-add-to-cart="${escapeHtml(product.id)}">Добавить в корзину</button>
              <a class="button button_secondary" href="${escapeHtml(seriesFile(product.series))}">Вернуться к подборке</a>
            </div>
          </div>
        </div>
      </section>
      <section class="section section_tinted">
        <div class="container product-details">
          <article class="detail-card">
            <div class="eyebrow">Описание</div>
            <h2>Что делает формула</h2>
            <p>${escapeHtml(product.intro)}</p>
          </article>
          <article class="detail-card">
            <div class="eyebrow">Применение</div>
            <h2>Как использовать</h2>
            <p>${escapeHtml(product.usage)}</p>
          </article>
          <article class="detail-card">
            <div class="eyebrow">INCI</div>
            <h2>Состав</h2>
            <p>${escapeHtml(product.inci)}</p>
          </article>
          <article class="detail-card">
            <div class="eyebrow">Ключевые ингредиенты</div>
            <h2>На чём держится результат</h2>
            <div class="ingredient-list">
              ${product.keyIngredients
                .map(
                  (item) => `
                    <div class="ingredient-item">
                      <strong>${escapeHtml(item.name)}</strong>
                      <p>${escapeHtml(item.description)}</p>
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
              ${product.productInfo.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card detail-card_wide">
            <div class="eyebrow">Логика серии</div>
            <h2>${escapeHtml(line.name)}: ${escapeHtml(line.accent)}</h2>
            <p>${escapeHtml(line.long)}</p>
          </article>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Ещё из серии</div>
            <h2>Продолжить подбор в направлении ${escapeHtml(line.name)}</h2>
          </div>
          <div class="mini-grid">
            ${related.map((item) => miniCardHtml(item)).join("")}
          </div>
        </div>
      </section>
    </main>
    <footer class="footer" data-shell="footer"></footer>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;
}

function seriesLandingHtml(line) {
  const config = SERIES_LANDING_CONFIG[line.slug];
  const file = config.file;
  const items = products.filter((item) => item.series === line.slug);
  const lead = items.slice(0, 4);
  const schema = [
    organizationSchema(),
    breadcrumbSchema([
      { name: "Главная", url: toAbsoluteUrl("index.html") },
      { name: "Подбор по коже", url: toAbsoluteUrl("series.html") },
      { name: line.name, url: toAbsoluteUrl(file) },
    ]),
    collectionPageSchema(line, file, items),
    faqSchema(config.faq),
  ];

  return `<!DOCTYPE html>
<html lang="ru">
${renderHead(
  {
    title: config.title,
    description: config.description,
    canonical: toAbsoluteUrl(file),
    image: line.promo || line.image,
  },
  schema
)}
  <body data-page="series-entry" data-nav="series">
    <header class="site-header" data-shell="header"></header>
    <main>
      <section class="page-hero">
        <div class="container page-hero__grid">
          <div class="page-hero__copy">
            <div>
              <div class="eyebrow">${escapeHtml(line.label)}</div>
              <h1>${escapeHtml(config.title.replace(" | Мелодия природы", ""))}</h1>
            </div>
            <p class="page-hero__lead">${escapeHtml(config.intro)}</p>
            <div class="button-row">
              <a class="button" href="catalog.html?series=${escapeHtml(line.slug)}">Смотреть товары серии</a>
              <a class="button button_secondary" href="${escapeHtml(productFile(lead[0]))}">Открыть первую карточку</a>
            </div>
          </div>
          <div class="page-hero__visual">
            <div class="page-hero__frame">
              <img src="${escapeHtml(line.promo || line.image)}" alt="${escapeHtml(line.name)}">
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container product-details">
          <article class="detail-card">
            <div class="eyebrow">Кому подойдёт</div>
            <h2>Когда стоит идти именно в эту серию</h2>
            <p>${escapeHtml(line.long)}</p>
          </article>
          <article class="detail-card">
            <div class="eyebrow">Что внутри</div>
            <h2>На чём держится подбор</h2>
            <ul class="bullet-list">
              ${line.focus.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card detail-card_wide">
            <div class="eyebrow">С чего начать</div>
            <h2>Первый шаг без лишнего перебора</h2>
            <p>${escapeHtml(config.firstStep)}</p>
          </article>
        </div>
      </section>

      <section class="section section_tinted">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Средства в серии</div>
            <h2>Ниже собраны самые релевантные карточки под этот кластер запроса</h2>
            <p>
              Эта посадочная отвечает на поисковый сценарий, а карточки ниже уже помогают перейти
              к конкретной формуле, цене и способу применения.
            </p>
          </div>
          <div class="mini-grid">
            ${lead.map((item) => miniCardHtml(item)).join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Частые вопросы</div>
            <h2>То, что чаще всего хочется понять до открытия карточки товара</h2>
          </div>
          <div class="product-details">
            ${config.faq
              .map(
                (item) => `
                  <article class="detail-card">
                    <h3>${escapeHtml(item.question)}</h3>
                    <p>${escapeHtml(item.answer)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    </main>
    <footer class="footer" data-shell="footer"></footer>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;
}

function normalizeQuery(query) {
  return query.toLowerCase().replace(/\s+/g, " ").trim();
}

function detectIntent(query) {
  if (/(купить|цена|заказать|в аптеке|доставка)/.test(query)) {
    return "commercial";
  }
  if (/(лучший|лучшие|отзывы|как|зачем|что|какой|после|почему)/.test(query)) {
    return "research";
  }
  return "commercial_research";
}

function detectCluster(query) {
  if (/(брить|мужск|aftershave)/.test(query)) {
    return "male";
  }
  if (/(жирн|комбинир|себор|себум|матир|пор)/.test(query)) {
    return "balance";
  }
  if (/(сух|зрел|чувств|обезвож|питатель|морщин)/.test(query)) {
    return "comfort";
  }
  if (/(гидролат|тоник|цветочн.*вод)/.test(query)) {
    return "tonics";
  }
  if (/(очищ|умыван|энзим|пилинг|обновлен|пенк)/.test(query)) {
    return "renewal";
  }
  if (/(рук|губ|трещин|пяток|бальзам)/.test(query)) {
    return "rescue";
  }
  if (/(подбор|тип кожи|уход по типу)/.test(query)) {
    return "series";
  }
  if (/(мастерск|ручной работ|авторск.*космет|натуральн.*космет)/.test(query)) {
    return "brand";
  }
  return "catalog";
}

function clusterTarget(cluster) {
  if (SERIES_LANDING_CONFIG[cluster]) {
    return SERIES_LANDING_CONFIG[cluster].file;
  }
  if (cluster === "series") {
    return "series.html";
  }
  if (cluster === "brand") {
    return "index.html";
  }
  return "catalog.html";
}

function detectPriority(query, intent, engines) {
  if (/(своими руками|рецепт|как сделать)/.test(query)) {
    return "low";
  }
  if (engines.length === 2 && intent === "commercial") {
    return "high";
  }
  if (/(крем для|гидролат|тоник|бальзам после бритья|крем для рук|бальзам для губ)/.test(query)) {
    return "high";
  }
  if (engines.length === 2) {
    return "medium";
  }
  return "low";
}

function isUsefulQuery(query) {
  if (NOISE_PATTERNS.some((pattern) => pattern.test(query))) {
    return false;
  }
  if (query.length > 120) {
    return false;
  }
  return true;
}

async function fetchGoogleSuggestions(query) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ru&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Google suggest ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data?.[1]) ? data[1] : [];
}

async function fetchYandexSuggestions(query) {
  const url = `https://suggest.yandex.net/suggest-ya.cgi?v=4&uil=ru&part=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Yandex suggest ${response.status}`);
  }
  const text = await response.text();
  const data = JSON.parse(text);
  return Array.isArray(data?.[1]) ? data[1] : [];
}

function csvEscape(value) {
  const string = String(value ?? "");
  if (/[",\n]/.test(string)) {
    return `"${string.replaceAll('"', '""')}"`;
  }
  return string;
}

async function buildSemanticCore() {
  const raw = {};
  const collected = new Map();

  for (const seed of SEMANTIC_SEEDS) {
    let google = [];
    let yandex = [];
    try {
      google = await fetchGoogleSuggestions(seed.query);
    } catch (error) {
      google = [];
    }
    try {
      yandex = await fetchYandexSuggestions(seed.query);
    } catch (error) {
      yandex = [];
    }

    raw[seed.query] = { google, yandex };

    for (const source of [
      { engine: "seed", values: [seed.query] },
      { engine: "google", values: google },
      { engine: "yandex", values: yandex },
    ]) {
      for (const value of source.values) {
        const query = normalizeQuery(value);
        if (!query || !isUsefulQuery(query)) {
          continue;
        }
        const current = collected.get(query) || {
          query,
          engines: new Set(),
          seed: seed.query,
        };
        current.engines.add(source.engine);
        collected.set(query, current);
      }
    }
  }

  const rows = [...collected.values()]
    .map((item) => {
      const engines = [...item.engines].filter((engine) => engine !== "seed");
      const cluster = detectCluster(item.query);
      const intent = detectIntent(item.query);
      return {
        query: item.query,
        cluster,
        intent,
        priority: detectPriority(item.query, intent, engines),
        target_page: clusterTarget(cluster),
        source_seed: item.seed,
        suggest_engines: engines.join("+") || "seed_only",
      };
    })
    .sort((left, right) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[left.priority] - priorityOrder[right.priority] || left.query.localeCompare(right.query, "ru");
    });

  const csvHeader = ["query", "cluster", "intent", "priority", "target_page", "source_seed", "suggest_engines"];
  const csv = [csvHeader.join(",")]
    .concat(rows.map((row) => csvHeader.map((key) => csvEscape(row[key])).join(",")))
    .join("\n");

  const clusterStats = rows.reduce((acc, row) => {
    acc[row.cluster] = (acc[row.cluster] || 0) + 1;
    return acc;
  }, {});

  const summary = `# SEO Summary

Дата сборки: ${TODAY}

Источник ядра:
- seed-запросы по ассортименту и типам кожи
- Google Suggest
- Yandex Suggest

Важно:
- это актуальное suggest-ядро и карта интентов, а не частотность Wordstat;
- точные объёмы спроса, показы и CTR нужно докручивать уже в Яндекс Вебмастере и Google Search Console после подключения сайта.

Кластеры:
${Object.entries(clusterStats)
  .map(([cluster, count]) => `- ${cluster}: ${count}`)
  .join("\n")}

Основные посадочные:
- index.html — брендовый и общий спрос
- series.html — общий вход в подбор по типу кожи
- ${SERIES_LANDING_CONFIG.comfort.file} — сухая, зрелая и чувствительная кожа
- ${SERIES_LANDING_CONFIG.balance.file} — жирная и комбинированная кожа
- ${SERIES_LANDING_CONFIG.male.file} — мужской уход и после бритья
- ${SERIES_LANDING_CONFIG.tonics.file} — тоники и гидролаты
- ${SERIES_LANDING_CONFIG.renewal.file} — очищение и обновление
- ${SERIES_LANDING_CONFIG.rescue.file} — руки, губы, трещины и локальное восстановление

Следующий цикл после индексации:
1. Подключить Яндекс Вебмастер и Google Search Console.
2. Снять реальные показы и запросы.
3. Доработать title/description под страницы с ростом показов.
4. Добавить информационные статьи под вопросы, которые начнут появляться в query monitoring.
`;

  await writeFile(path.join(ROOT, "analysis", "seo", "raw-suggest.json"), `${escapeJson(raw)}\n`, "utf8");
  await writeFile(path.join(ROOT, "analysis", "seo", "semantic-core.csv"), `${csv}\n`, "utf8");
  await writeFile(path.join(ROOT, "analysis", "seo", "semantic-summary.md"), summary, "utf8");
}

async function buildSitemapAndRobots() {
  const urls = [
    ...ROOT_PAGES.map((item) => ({
      file: item.file,
      priority: item.priority,
      changefreq: item.changefreq,
    })),
    ...series.map((line) => ({
      file: seriesFile(line.slug),
      priority: "0.8",
      changefreq: "weekly",
    })),
    ...products.map((product) => ({
      file: productFile(product),
      priority: "0.7",
      changefreq: "weekly",
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${toAbsoluteUrl(item.file)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  await writeFile(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");
  await writeFile(path.join(ROOT, "robots.txt"), robots, "utf8");
}

async function buildStaticPages() {
  for (const product of products) {
    await writeFile(path.join(ROOT, productFile(product)), productPageHtml(product), "utf8");
  }

  for (const line of series) {
    await writeFile(path.join(ROOT, seriesFile(line.slug)), seriesLandingHtml(line), "utf8");
  }
}

async function main() {
  await mkdir(path.join(ROOT, "analysis", "seo"), { recursive: true });
  await buildStaticPages();
  await buildSitemapAndRobots();
  await buildSemanticCore();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
