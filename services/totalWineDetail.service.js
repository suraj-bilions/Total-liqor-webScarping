import puppeteer from "puppeteer";
import fs from "fs";
import { saveData } from "../utils/saveFile.js";

const delay = ms => new Promise(r => setTimeout(r, ms));

async function launchBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  return { browser, page };
}

async function safeGoto(page, url, retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      return true;
    } catch {
      console.log(`⚠️ Retry ${i}/${retries}`);
      await delay(5000);
    }
  }
  return false;
}

/**
 * @param {"wine" | "spirits"} type
 */
export async function scrapeTotalWineDetailsFromFileService(type = "wine") {
  // 🔥 READ FROM data FOLDER
  const inputFile = `./data/totalwine_${type}.json`;

  const products = JSON.parse(
    fs.readFileSync(inputFile, "utf-8")
  );

  console.log(`✅ Loaded ${type} products: ${products.length}`);

  let { browser, page } = await launchBrowser();

  // 🔥 Warm-up visit (VERY IMPORTANT)
  await page.goto("https://www.totalwine.com", {
    waitUntil: "domcontentloaded",
  });

  const failed = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (!product.link) continue;

    console.log(`[DETAIL ${i + 1}/${products.length}] ${product.name}`);

    const ok = await safeGoto(page, product.link);
    if (!ok) {
      failed.push(product);
      continue;
    }

    try {
      await page.waitForSelector(
        '[data-at="origin-details-table-container"]',
        { timeout: 60000 }
      );
    } catch {
      console.log("⚠️ Detail section missing");
      failed.push(product);
      continue;
    }

    const details = await page.evaluate(() => {
      const data = {};
      const container = document.querySelector(
        '[data-at="origin-details-table-container"]'
      );
      if (!container) return null;

      const children = Array.from(container.children);

      for (let i = 0; i < children.length; i++) {
        if (!children[i].className.includes("odtLabel")) continue;
        const label = children[i].innerText.trim();
        const value = children[i + 1]?.innerText.trim();
        if (value) data[label] = value;
      }

      return {
        country: data["Country / State"] || null,
        region: data["Region"] || null,
        appellation: data["Appellation"] || null,
        brand: data["Brand"] || null,
        wineType: data["Wine Type"] || null,
        varietal: data["Varietal"] || null,
        style: data["Style"] || null,
        abv: data["ABV"] || null,
        taste: data["Taste"] || null,
        body: data["Body"] || null,
      };
    });

    if (details) Object.assign(product, details);

    // 🐢 HUMAN-LIKE DELAY
    await delay(4000 + Math.random() * 4000);

    // ♻️ Restart browser every 40 products (ANTI-BLOCK)
    if (i > 0 && i % 40 === 0) {
      console.log("🔄 Restarting browser safely...");
      await browser.close();
      ({ browser, page } = await launchBrowser());
      await page.goto("https://www.totalwine.com", {
        waitUntil: "domcontentloaded",
      });
    }
  }

  // 💾 SAVE FILES
  saveData(
    products,
    `totalwine_${type}_detailed.json`,
    `totalwine_${type}_detailed.xlsx`,
    `TotalWine ${type} Detailed Products`
  );

  fs.writeFileSync(
    `./data/totalwine_${type}_failed.json`,
    JSON.stringify(failed, null, 2)
  );

  console.log(`❌ Failed products: ${failed.length}`);

  await browser.close();
}