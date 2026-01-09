import puppeteer from "puppeteer";
import { saveData } from "../utils/saveFile.js";

export async function scrapeSpecsOnline(baseURL, type, maxPages) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  let products = [];
  let pageNum = 1;

  while (pageNum <= maxPages) {
    const url = pageNum === 1 ? baseURL : `${baseURL}/page/${pageNum}/`;
    console.log(`[Specs-${type}] Page ${pageNum}`);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

    try {
      await page.waitForSelector(".products li.product", { timeout: 60000 });
    } catch {
      break;
    }

    const pageProducts = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".products li.product")).map(p => ({
        id: p.querySelector("a.add_to_cart_button")?.getAttribute("data-product_id") || null,
        name: p.querySelector("h2 a")?.innerText.trim() || null,
        size: p.querySelector(".product-size")?.innerText.trim() || null,
        price: p.querySelector(".price")?.innerText.trim() || null,
        link: p.querySelector("h2 a")?.href || null,
      }))
    );

    products.push(...pageProducts);
    pageNum++;
  }

  saveData(
    products,
    `specsonline_${type}.json`,
    `specsonline_${type}.xlsx`,
    `${type} Products`
  );

  await browser.close();
  return products;
}
