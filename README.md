# Melodia Atelier

Учебный статический шаблон бьюти-сайта, собранный по мотивам сильной trust-first воронки:

- история бренда
- серии по типам кожи
- длинный каталог
- детальная карточка товара
- корзина на `localStorage`

## Что открыть сначала

- [index.html](index.html)
- [catalog.html](catalog.html)
- [product.html](product.html)
- [analysis/permyakova-reference.md](analysis/permyakova-reference.md)

## Где что лежит

- [data.js](data.js)
  Единый источник данных: бренд, серии, товары, legal-блоки.

- [main.js](main.js)
  Общая логика: header, footer, cart drawer, фильтры, галереи, рендер страниц.

- [styles.css](styles.css)
  Весь визуальный слой и адаптив.

- HTML-страницы:
  - [index.html](index.html)
  - [about.html](about.html)
  - [series.html](series.html)
  - [catalog.html](catalog.html)
  - [product.html](product.html)
  - [policy.html](policy.html)
  - [offer.html](offer.html)

- SEO-слой:
  - [analysis/seo/build-seo.mjs](analysis/seo/build-seo.mjs)
  - [analysis/seo/semantic-core.csv](analysis/seo/semantic-core.csv)
  - [analysis/seo/semantic-summary.md](analysis/seo/semantic-summary.md)
  - [sitemap.xml](sitemap.xml)
  - [robots.txt](robots.txt)

## Что менять под себя

1. Контакты и бренд:
   обновить объект `brand` в [data.js](data.js)

2. Серии:
   редактировать массив `series`

3. Ассортимент:
   править `productKinds`, `productCopyMap` и вычисляемый массив `products`

4. Визуал:
   заменить изображения в `assets/images/`

5. Юридические тексты:
   заменить `legalPolicy` и `legalOffer` на реальные данные

6. После обновления ассортимента:
   запустить `node analysis/seo/build-seo.mjs`, чтобы пересобрать SEO-посадочные, товарные страницы, `sitemap.xml`, `robots.txt` и актуальное suggest-ядро

## Как работает корзина

- Добавление товара идёт через `data-add-to-cart`
- Корзина хранится в `localStorage`
- Drawer собирается в [main.js](main.js)
- Кнопка `Скопировать заказ` собирает текст заказа для мессенджера

## Ограничения

- Это статический шаблон без backend и оплаты
- Telegram-ссылка и контакты здесь учебные
- Юридические страницы требуют замены перед реальным запуском
