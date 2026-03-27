// frontend/scripts/generateStaticRoutes.js
import fs from "fs";
import path from "path";

const languages = [
    "en", "ur", "ar", "fr", "es", "zh", "zh_tw", "hi",
    "id", "it", "ja", "ko", "pt", "ru", "tr", "vi"
];

const gamesPath = path.resolve("snap-data", "allGames.json");
const outputPath = path.resolve("snap-manifest.json");

// Read the games JSON
const allGames = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));

const routes = [];

allGames.forEach(game => {
    languages.forEach(lang => {
        routes.push(`/${lang}/game/${slugify(game.title_en)}`);
    });
});

// Optional: Add language homepages
languages.forEach(lang => {
    routes.push(`/${lang}`);
});

// Add root
routes.push("/");

// Save the routes
fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));

console.log(`✅ Generated ${routes.length} routes in snap-manifest.json`);

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
