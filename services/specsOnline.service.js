// import puppeteer from "puppeteer";
// import { saveData } from "../utils/saveFile.js";

// export async function scrapeSpecsOnlineService(baseURL, type, maxPages) {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
//   );

//   let products = [];
//   let pageNum = 1;

//   while (pageNum <= maxPages) {
//     const url = pageNum === 1 ? baseURL : `${baseURL}/page/${pageNum}/`;
//     console.log(`[Specs-${type}] Page ${pageNum}`);

//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

//     try {
//       await page.waitForSelector(".products li.product", { timeout: 60000 });
//     } catch {
//       break;
//     }

//     const pageProducts = await page.evaluate(() =>
//       Array.from(document.querySelectorAll(".products li.product")).map(p => ({
//         id: p.querySelector("a.add_to_cart_button")?.getAttribute("data-product_id") || null,
//         name: p.querySelector("h2 a")?.innerText.trim() || null,
//         size: p.querySelector(".product-size")?.innerText.trim() || null,
//         price: p.querySelector(".price")?.innerText.trim() || null,
//         link: p.querySelector("h2 a")?.href || null,
//       }))
//     );

//     products.push(...pageProducts);
//     pageNum++;
//   }

//   saveData(
//     products,
//     `specsonline_${type}.json`,
//     `specsonline_${type}.xlsx`,
//     `${type} Products`
//   );

//   await browser.close();
//   return products;
// }

import puppeteer from "puppeteer";
import { saveData } from "../utils/saveFile.js";

export async function scrapeSpecsOnlineService(baseURL, type, maxPages) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  let pageNum = 1;
  let batchProducts = [];
  const BATCH_SIZE = 50;

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
        id:
          p.querySelector("a.add_to_cart_button")?.getAttribute(
            "data-product_id"
          ) || null,
        name: p.querySelector("h2 a")?.innerText.trim() || null,
        size: p.querySelector(".product-size")?.innerText.trim() || null,
        price: p.querySelector(".price")?.innerText.trim() || null,
        link: p.querySelector("h2 a")?.href || null,
      }))
    );

    if (pageProducts.length === 0) break;

    batchProducts.push(...pageProducts);

    /* ✅ SAVE EVERY 50 PAGES */
    if (pageNum % BATCH_SIZE === 0) {
      console.log(`💾 Saving pages ${pageNum - 49} → ${pageNum}`);

      saveData(
        batchProducts,
        `specsonline_${type}.json`,
        `specsonline_${type}.xlsx`,
        `${type} Products`,
        true // append mode
      );

      batchProducts = [];
    }

    pageNum++;
  }

  /* ✅ SAVE LAST REMAINING PAGES (<50) */
  if (batchProducts.length) {
    console.log("💾 Saving remaining products");

    saveData(
      batchProducts,
      `specsonline_${type}.json`,
      `specsonline_${type}.xlsx`,
      `${type} Products`,
      true
    );
  }

  await browser.close();
  console.log("✅ Specs scraping completed");
}
