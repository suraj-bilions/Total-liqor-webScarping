import puppeteer from "puppeteer";
import { saveData } from "../utils/saveFile.js";

export async function scrapeTotalWineService(baseURL, type) {
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
  let products = [];
  let pageNum = 1;

  while (pageNum<=2) {
    const url =
      pageNum === 1
        ? baseURL
        : `${baseURL}?page=${pageNum}&pageSize=24&aty=1,1,0,0`;

    console.log(`[TotalWine-${type}] Page ${pageNum}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 4000));

    try {
      await page.waitForSelector(".productCard__bcfe4485", { timeout: 60000 });
    } catch {
      break;
    }

    const pageProducts = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".productCard__bcfe4485")).map(p => ({
        name: p.querySelector("h2 a")?.innerText.trim() || null,
        size: p.querySelector("h2 span")?.innerText.trim() || null,
        price: p.querySelector(".price__ff218822")?.innerText.trim() || null,
        sku: p.querySelector("button[data-sku]")?.getAttribute("data-sku") || null,
        link: p.querySelector("h2 a")?.href || null,
      }))
    );

    if (pageProducts.length === 0) break;
    products.push(...pageProducts);

    const hasNext = await page.evaluate(() => {
      const nextBtn = document.querySelector(
        '[data-at="product-search-pagination-nextlink"]'
      );
      return nextBtn && nextBtn.hasAttribute("href");
    });

    if (!hasNext) break;
    pageNum++;
  }

  saveData(
    products,
    `totalwine_${type}.json`,
    `totalwine_${type}.xlsx`,
    `${type} Products`
  );

  await browser.close();
  return products;
}
