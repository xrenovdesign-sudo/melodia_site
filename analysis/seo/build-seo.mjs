import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { brand, series, products } from "../../data.js";

const ROOT = process.cwd();
const SITE_URL = "https://naturemelody.ru";
const TODAY = new Date().toISOString().slice(0, 10);
const DEFAULT_IMAGE = "assets/images/brand-shot.png";

const SERIES_LANDING_CONFIG = {
  comfort: {
    file: "care-dry-skin.html",
    title: "Уход для сухой, зрелой и чувствительной кожи | Мелодия природы",
    description:
      "Кремы и питательные формулы для сухой, зрелой и чувствительной кожи: мягкое увлажнение, защита барьера и комфорт без перегруза.",
    intro:
      "Сюда удобно идти, когда кожу сушит, тянет, она реагирует на сухой воздух или быстро просит ещё один слой крема. Здесь легче собрать более мягкий и питающий уход без тяжёлого ощущения.",
    firstStep:
      "Если нужен спокойный ежедневный крем, начните с Flora. Если сухость выраженная и хочется более плотной поддержки, смотрите обратные эмульсии и ночные форматы.",
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
      "Сюда стоит идти, когда кожа быстро блестит, а жёсткое матирование делает её только беспокойнее. Здесь легче найти более лёгкий уход без пересушивания.",
    firstStep:
      "Если нужен базовый ежедневный крем без жирной плёнки, начните с себорегулирующего крема. Если хочется собрать уход шире, посмотрите всю подборку и решите, нужен ли ещё водный этап или очищение.",
    faq: [
      {
        question: "Это серия только для молодой жирной кожи?",
        answer:
          "Нет. Она подходит и зрелой комбинированной коже, когда нужен баланс между контролем себума, лёгкой текстурой и поддержкой комфорта.",
      },
      {
        question: "Есть ли риск пересушивания?",
        answer:
          "Это направление собрано мягче, чем жёсткие матирующие схемы: цель не пересушить кожу, а сделать её спокойнее и чище по ощущениям.",
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
      "Сюда стоит идти, когда после бритья кожа краснеет, щиплет или просто не любит тяжёлый уход. Здесь проще выбрать между мягким комфортом и более свежим охлаждающим вариантом.",
    firstStep:
      "Если после бритья нужен мягкий кремовый комфорт, смотрите классический бальзам. Если нравится охлаждение и более бодрое ощущение, подойдёт формула с ментолом.",
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
        question: "С чего удобнее начать мужской уход?",
        answer:
          "С того, что ближе вашей привычке: мягкий бальзам на каждый день или более свежая формула именно после бритья. После этого уже проще открыть конкретную карточку.",
      },
    ],
  },
  tonics: {
    file: "care-tonics-hydrolats.html",
    title: "Тоники и гидролаты для лица | Мелодия природы",
    description:
      "Тоники и гидролаты для лица: мягкий водный этап ухода, выравнивание pH после умывания и растительная база собственного приготовления.",
    intro:
      "Сюда удобно идти, когда после умывания коже не хватает мягкости и хочется более спокойного перехода к крему. Здесь легче понять, нужен ли вам гидролат или тоник с активами.",
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
      "Сюда стоит идти, когда хочется чище и свежее, но без скрипа и пересушивания. Здесь легче выбрать между мягким ежедневным умыванием и более адресным обновлением.",
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
          "Да, если выбирать деликатные форматы и не перегружать ритуал частым отшелушиванием. Начать лучше с более мягких средств и посмотреть, как кожа их переносит.",
      },
      {
        question: "Когда стоит начинать уход именно с очищения?",
        answer:
          "Когда привычное умывание уже не даёт ощущения чистой и спокойной кожи. В таком случае лучше сначала выбрать мягкое очищение или деликатное обновление, а потом уже подбирать следующий уход.",
      },
    ],
  },
  rescue: {
    file: "care-recovery-balms.html",
    title: "Бальзамы для губ, рук и сухих участков кожи | Мелодия природы",
    description:
      "Локальное восстановление кожи: кремы и бальзамы для рук, губ, пяток и зон сильной сухости с быстрым ощущением смягчения.",
    intro:
      "Сюда удобно идти с очень конкретной задачей: сухие руки, губы, пятки или участки, которым нужен более плотный уход и быстрый комфорт.",
    firstStep:
      "Если зона сухости понятна, можно сразу открыть нужное средство. Если хочется сравнить несколько формул, сначала посмотрите всю подборку.",
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
        question: "Когда нужен отдельный локальный уход, а не общий крем для лица?",
        answer:
          "Когда проблема локальная и требует более плотной защиты: руки, губы, локти, пятки и зоны с выраженной сухостью лучше закрывать отдельным средством, а не универсальным кремом для лица.",
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
  if (file === "index.html" || file === "/") {
    return `${SITE_URL}/`;
  }
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
    <meta name="format-detection" content="telephone=no">
    <meta name="theme-color" content="#f6ede5">
    ${pageMetaTags(meta)}
    <link rel="icon" href="assets/images/cream-flora-photo.png" type="image/png">
    <link rel="stylesheet" href="styles.css">
    ${schema}
  </head>`.trimEnd();
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.displayName,
    url: `${SITE_URL}/`,
    inLanguage: "ru-RU",
  };
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: brand.displayName,
    url: `${SITE_URL}/`,
    logo: toImageUrl("assets/images/cream-flora-photo.png"),
    image: toImageUrl(DEFAULT_IMAGE),
    telephone: brand.contacts.phone,
    priceRange: "600-1600 RUB",
    founder: {
      "@type": "Person",
      name: brand.legal.owner,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Балакирево",
      addressRegion: "Владимирская область",
      addressCountry: "RU",
    },
    areaServed: {
      "@type": "Country",
      name: "RU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: brand.contacts.phone,
      contactType: "customer support",
      areaServed: "RU",
      availableLanguage: ["ru"],
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

function webPageSchema({ type = "WebPage", name, description, url, about }) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: brand.displayName,
      url: `${SITE_URL}/`,
    },
    about,
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

function breadcrumbsNavHtml(items) {
  return `
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <ol class="breadcrumbs__list">
        ${items
          .map((item, index) => {
            const isLast = index === items.length - 1;
            const content = isLast
              ? `<span class="breadcrumbs__current" aria-current="page">${escapeHtml(item.name)}</span>`
              : `<a href="${escapeHtml(item.url)}">${escapeHtml(item.name)}</a>`;

            return `<li class="breadcrumbs__item">${content}</li>`;
          })
          .join("")}
      </ol>
    </nav>
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
          <a class="text-link" href="${escapeHtml(productFile(product))}">Подробнее о средстве</a>
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
  const description = `${product.shortDescription} ${product.priceLabel || `${product.price} RUB`}. ${product.size}.`;
  const breadcrumbs = [
    { name: "Главная", url: toAbsoluteUrl("/") },
    { name: "Каталог", url: toAbsoluteUrl("catalog.html") },
    { name: line.name, url: toAbsoluteUrl(seriesFile(line.slug)) },
    { name: product.title, url: canonical },
  ];

  const schema = [
    websiteSchema(),
    organizationSchema(),
    breadcrumbSchema(breadcrumbs),
    webPageSchema({
      type: "ProductPage",
      name: product.title,
      description,
      url: canonical,
      about: {
        "@type": "Thing",
        name: line.name,
      },
    }),
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
        <div class="container">
          ${breadcrumbsNavHtml(breadcrumbs)}
          <div class="product-hero">
            <div class="product-hero__gallery">
              ${galleryHtml(product.gallery, product.title)}
            </div>
            <div class="product-hero__body">
              <div class="eyebrow">${escapeHtml(line.name)} · ${escapeHtml(line.label)}</div>
              <h1>${escapeHtml(product.title)}</h1>
              <p class="product-hero__lead">${escapeHtml(product.heroText)}</p>
              <div class="product-price">
                <strong>${escapeHtml(product.priceLabel || `${product.price} RUB`)}</strong>
                <span>${escapeHtml(product.size)}</span>
              </div>
              <ul class="bullet-list">
                ${product.benefits.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
              </ul>
              <div class="button-row">
                <button class="button" type="button" data-add-to-cart="${escapeHtml(product.id)}">Добавить в корзину</button>
                <a class="button button_secondary" href="${escapeHtml(seriesFile(product.series))}">К направлению</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section section_tinted">
        <div class="container product-details">
          <article class="detail-card">
            <div class="eyebrow">Что делает средство</div>
            <h2>Какого эффекта ждать в уходе</h2>
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
            <div class="eyebrow">Перед заказом</div>
            <h2>Что важно уточнить и учесть</h2>
            <ul class="bullet-list">
              ${product.productInfo.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card detail-card_wide">
            <div class="eyebrow">Когда смотреть это направление</div>
            <h2>${escapeHtml(line.name)}: ${escapeHtml(line.accent)}</h2>
            <p>${escapeHtml(line.long)}</p>
          </article>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Что ещё посмотреть</div>
            <h2>Похожие средства в направлении ${escapeHtml(line.name)}</h2>
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
  const canonical = toAbsoluteUrl(file);
  const breadcrumbs = [
    { name: "Главная", url: toAbsoluteUrl("/") },
    { name: "Подбор по коже", url: toAbsoluteUrl("series.html") },
    { name: line.name, url: canonical },
  ];
  const schema = [
    websiteSchema(),
    organizationSchema(),
    breadcrumbSchema(breadcrumbs),
    webPageSchema({
      type: "CollectionPage",
      name: line.name,
      description: config.description,
      url: canonical,
      about: {
        "@type": "Thing",
        name: line.label,
      },
    }),
    collectionPageSchema(line, file, items),
    faqSchema(config.faq),
  ];

  return `<!DOCTYPE html>
<html lang="ru">
${renderHead(
  {
    title: config.title,
    description: config.description,
    canonical,
    image: line.promo || line.image,
  },
  schema
)}
  <body data-page="series-entry" data-nav="series">
    <header class="site-header" data-shell="header"></header>
    <main>
      <section class="page-hero">
        <div class="container">
          ${breadcrumbsNavHtml(breadcrumbs)}
          <div class="page-hero__grid">
            <div class="page-hero__copy">
              <div>
                <div class="eyebrow">${escapeHtml(line.label)}</div>
                <h1>${escapeHtml(config.title.replace(` | ${brand.displayName}`, ""))}</h1>
              </div>
              <p class="page-hero__lead">${escapeHtml(config.intro)}</p>
              <div class="button-row">
                <a class="button" href="catalog.html?series=${escapeHtml(line.slug)}">Смотреть средства направления</a>
                <a class="button button_secondary" href="${escapeHtml(productFile(lead[0]))}">Пример средства</a>
              </div>
            </div>
            <div class="page-hero__visual">
              <div class="page-hero__frame">
                <img src="${escapeHtml(line.promo || line.image)}" alt="${escapeHtml(line.name)}">
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container product-details">
          <article class="detail-card">
            <div class="eyebrow">Когда это про вас</div>
            <h2>По каким ощущениям обычно выбирают это направление</h2>
            <p>${escapeHtml(line.long)}</p>
          </article>
          <article class="detail-card">
            <div class="eyebrow">На что смотреть</div>
            <h2>Что помогает быстрее сориентироваться</h2>
            <ul class="bullet-list">
              ${line.focus.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          </article>
          <article class="detail-card detail-card_wide">
            <div class="eyebrow">С чего начать</div>
            <h2>С чего проще начать</h2>
            <p>${escapeHtml(config.firstStep)}</p>
          </article>
        </div>
      </section>

      <section class="section section_tinted">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">Что можно открыть первым</div>
            <h2>Ниже — средства, с которых удобно начать, если эта задача про вас.</h2>
            <p>
              Откройте карточку, сравните формат, цену и ощущение от средства,
              а уже потом решайте, нужен ли именно этот вариант.
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
            <h2>Что обычно хочется уточнить заранее</h2>
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
