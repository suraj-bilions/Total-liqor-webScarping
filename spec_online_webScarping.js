import puppeteer from "puppeteer";
import fs from "fs";
import XLSX from "xlsx";

(async () => {
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
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  const baseURL = "https://specsonline.com/product-category/wine";
  //const baseURL = "https://specsonline.com/product-category/spirits/";
  const MAX_PAGES = 420;

  let products = [];
  let pageNum = 1;

  while (pageNum <= MAX_PAGES) {
    const url =
      pageNum === 1
        ? baseURL
        : `${baseURL}/page/${pageNum}/`;

    console.log(`Scraping listing page ${pageNum}: ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

    // ✅ HARD STOP CONDITION
    try {
      await page.waitForSelector(".products li.product", { timeout: 60000 });
    } catch {
      console.log("No more products found. Pagination ended.");
      break;
    }

    const pageProducts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".products li.product")).map(p => ({
        id: p.querySelector("a.add_to_cart_button")
          ?.getAttribute("data-product_id") || null,

        name: p.querySelector("h2 a")
          ?.innerText.trim() || null,

        size: p.querySelector(".product-size")
          ?.innerText.trim() || null,

        price: p.querySelector(".price")
          ?.innerText.trim() || null,

        link: p.querySelector("h2 a")
          ?.href || null
      }));
    });

    products.push(...pageProducts);
    console.log(`Total products so far: ${products.length}`);

    pageNum++;
  }

  console.log(`SCRAPING COMPLETE`);
  console.log(`Total products scraped: ${products.length}`);

  // -----------------------
  // SAVE JSON
  // -----------------------
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  // -----------------------
  // SAVE EXCEL
  // -----------------------
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Wine Products");

  XLSX.writeFile(workbook, "specsonline_wine_products.xlsx");

  console.log("JSON saved: products.json");
  console.log("Excel saved: specsonline_wine_products.xlsx");

  await browser.close();
})();