import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { newsArticles } from '../src/data/newsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const publicDir = path.resolve(__dirname, '../public');
const templatePath = path.resolve(distDir, 'index.html');

const SITE_URL = 'https://shreeabhaydas.com';
const SITE_NAME = 'स्वामी श्री अभयदास जी महाराज | Shree Abhaydas Ji Maharaj';

function getMimeType(url = '') {
  const clean = url.toLowerCase();
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function generateSocialPages() {
  if (!fs.existsSync(templatePath)) {
    console.warn('[Social Pages] dist/index.html not found. Skipping static generation.');
    return;
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8');

  // Also save a meta index JSON for share.php dynamic fallback
  const metaIndex = {};

  console.log(`[Social Pages] Generating Open Graph preview pages for ${newsArticles.length} news articles...`);

  for (const article of newsArticles) {
    if (!article.slug) continue;

    const articleUrl = `${SITE_URL}/news/${article.slug}`;
    let imageUrl = article.image || '/images/img_35.png';
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${SITE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    const cleanTitle = article.title || 'Shree Abhay Das Ji Maharaj News';
    const cleanExcerpt = article.excerpt || article.fullContent?.slice(0, 180) || cleanTitle;
    const mimeType = getMimeType(imageUrl);

    metaIndex[article.slug] = {
      title: cleanTitle,
      description: cleanExcerpt,
      image: imageUrl,
      url: articleUrl,
      mimeType
    };

    // Replace <title>
    let articleHtml = baseHtml.replace(
      /<title>.*?<\/title>/is,
      `<title>${escapeHtml(cleanTitle)} – Shree Abhay Das Ji Maharaj</title>`
    );

    // Replace or inject meta description
    articleHtml = articleHtml.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeHtml(cleanExcerpt)}" />`
    );

    // Replace canonical tag
    articleHtml = articleHtml.replace(
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${articleUrl}" />`
    );

    // Replace Open Graph Tags
    articleHtml = articleHtml.replace(
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${escapeHtml(cleanTitle)}" />`
    );
    articleHtml = articleHtml.replace(
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${escapeHtml(cleanExcerpt)}" />`
    );
    articleHtml = articleHtml.replace(
      /<meta\s+property=["']og:url["'][^>]*>/i,
      `<meta property="og:url" content="${articleUrl}" />`
    );
    articleHtml = articleHtml.replace(
      /<meta\s+property=["']og:type["'][^>]*>/i,
      `<meta property="og:type" content="article" />`
    );

    // Replace og:image and append rich image dimensions
    const richOgImage = [
      `<meta property="og:image" content="${imageUrl}" />`,
      `<meta property="og:image:secure_url" content="${imageUrl}" />`,
      `<meta property="og:image:type" content="${mimeType}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${escapeHtml(cleanTitle)}" />`
    ].join('\n    ');

    articleHtml = articleHtml.replace(
      /<meta\s+property=["']og:image["'][^>]*>/i,
      richOgImage
    );

    // Replace Twitter Card Tags
    articleHtml = articleHtml.replace(
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${escapeHtml(cleanTitle)}" />`
    );
    articleHtml = articleHtml.replace(
      /<meta\s+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${escapeHtml(cleanExcerpt)}" />`
    );
    articleHtml = articleHtml.replace(
      /<meta\s+name=["']twitter:image["'][^>]*>/i,
      `<meta name="twitter:image" content="${imageUrl}" />`
    );

    // Ensure target directory exists in dist/news/[slug]
    const articleDir = path.resolve(distDir, 'news', article.slug);
    fs.mkdirSync(articleDir, { recursive: true });
    fs.writeFileSync(path.resolve(articleDir, 'index.html'), articleHtml, 'utf8');

    console.log(`  ✓ Generated /news/${article.slug}/index.html with OG image: ${imageUrl}`);
  }

  // Write news-meta.json to both public and dist for share.php fallback
  const metaJsonContent = JSON.stringify(metaIndex, null, 2);
  fs.writeFileSync(path.resolve(distDir, 'news-meta.json'), metaJsonContent, 'utf8');
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.resolve(publicDir, 'news-meta.json'), metaJsonContent, 'utf8');
  }
  console.log('[Social Pages] Successfully generated all article pages and news-meta.json!');
}

generateSocialPages().catch((err) => {
  console.error('[Social Pages] Error generating pages:', err);
});

