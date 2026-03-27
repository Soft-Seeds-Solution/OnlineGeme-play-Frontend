import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import fetch from "node-fetch";

const BASE_URL = "https://www.khelogy.com";
const API_URL = "https://api.khelogy.com/api/games/uploaded-games";

async function generateCategorySitemaps() {
  const response = await fetch(API_URL);
  const games = await response.json();

  // 1️⃣ Group games by category
  const categories = {};
  games.forEach(game => {
    const category = game.categoryId?.category?.toLowerCase();
    if (!category || !game.title?.en) return;

    if (!categories[category]) categories[category] = [];
    categories[category].push(game);
  });

  const sitemapIndex = [];

  // 2️⃣ Generate separate sitemap per category
  for (const category in categories) {
    const sitemap = new SitemapStream({ hostname: BASE_URL });
    const fileName = `./public/sitemap-${category}.xml`;
    const writeStream = createWriteStream(fileName);
    sitemap.pipe(writeStream);

    categories[category].forEach(game => {
      const slug = game.title.en
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      sitemap.write({
        url: `/${category}/${slug}`,
        changefreq: "weekly",
        priority: 0.8
      });
    });

    sitemap.end();
    await streamToPromise(sitemap);
    console.log(`✅ Sitemap generated for category: ${category}`);

    sitemapIndex.push(`sitemap-${category}.xml`);
  }

  // 3️⃣ Generate sitemap index
  const sitemapIndexStream = new SitemapStream({ hostname: BASE_URL });
  const indexWriteStream = createWriteStream("./public/sitemap-index.xml");
  sitemapIndexStream.pipe(indexWriteStream);

  sitemapIndex.forEach(file => {
    sitemapIndexStream.write({ url: `/${file}` });
  });

  sitemapIndexStream.end();
  await streamToPromise(sitemapIndexStream);

  console.log("✅ Sitemap index generated successfully");
}

generateCategorySitemaps().catch(err => {
  console.error("❌ Sitemap generation failed:", err);
});