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

  const baseURL = "https://www.totalwine.com/wine/c/c0020"; //this is url for wine
  // const baseURL = "https://www.totalwine.com/spirits/c/c0030"; // this is url for spirit 
  

  let products = [];
  let pageNum = 1;

  while (true) {
    const url =
      pageNum === 1
        ? baseURL
        : `${baseURL}?page=${pageNum}&pageSize=24&aty=1,1,0,0`;

    console.log(`Scraping page ${pageNum}: ${url}`);

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // 🔽 FORCE LAZY LOAD
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // ⏳ HUMAN WAIT
    await new Promise(resolve => setTimeout(resolve, 4000));

    // WAIT FOR PRODUCTS
    try {
      await page.waitForSelector(".productCard__bcfe4485", { timeout: 60000 });
    } catch {
      console.log("No products found. Stopping.");
      break;
    }

    const pageProducts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".productCard__bcfe4485")).map(p => ({
        name: p.querySelector("h2 a")?.innerText.trim() || null,
        size: p.querySelector("h2 span")?.innerText.trim() || null,
        price: p.querySelector(".price__ff218822")?.innerText.trim() || null,
        sku: p.querySelector("button[data-sku]")?.getAttribute("data-sku") || null,
        link: p.querySelector("h2 a")?.href || null,
      }));
    });

    if (pageProducts.length === 0) {
      console.log("No products on page. Stopping.");
      break;
    }

    products.push(...pageProducts);
    console.log(`Total products so far: ${products.length}`);

    // 🔍 CHECK NEXT BUTTON (REAL STOP LOGIC)
    const hasNextPage = await page.evaluate(() => {
      const nextBtn = document.querySelector(
        '[data-at="product-search-pagination-nextlink"]'
      );
      return nextBtn && nextBtn.hasAttribute("href");
    });

    if (!hasNextPage) {
      console.log("Reached LAST PAGE (pagination disabled).");
      break;
    }

    pageNum++;
  }

  console.log("\nSCRAPING COMPLETE");
  console.log(`Total products scraped: ${products.length}`);

  // SAVE JSON
  fs.writeFileSync(
    "totalwine_wine_products.json",
    JSON.stringify(products, null, 2)
  );

  // SAVE EXCEL
  const worksheet = XLSX.utils.json_to_sheet(products);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Wine Products");
  XLSX.writeFile(workbook, "totalwine_wine_products.xlsx");

  console.log("JSON + Excel saved");

  await browser.close();
})();




// import puppeteer from "puppeteer";
// import fs from "fs";
// import XLSX from "xlsx";

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 50,
//     defaultViewport: null,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-blink-features=AutomationControlled",
//     ],
//   });

//   const page = await browser.newPage();

//   const baseURL = "https://www.totalwine.com/wine/c/c0020";
//   const MAX_PAGES = 277;

//   let products = [];
//   let pageNum = 1;

//   while (pageNum <= MAX_PAGES) {
//     const url =
//       pageNum === 1
//         ? `${baseURL}/`
//         : `${baseURL}?page=${pageNum}&pageSize=24&aty=1,1,0,0`;

//     console.log(`Scraping page ${pageNum}: ${url}`);

//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

//     try {
//       await page.waitForSelector(".productCard__bcfe4485", { timeout: 60000 });
//     } catch {
//       console.log("No more products found. Stopping.");
//       break;
//     }

//     const pageProducts = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll(".productCard__bcfe4485")).map(p => ({
//         name: p.querySelector("h2 a")?.innerText.trim() || null,
//         size: p.querySelector("h2 span")?.innerText.trim() || null,
//         price: p.querySelector(".price__ff218822")?.innerText.trim() || null,
//         sku: p.querySelector("button[data-sku]")?.getAttribute("data-sku") || null,
//       }));
//     });

//     if (pageProducts.length === 0) break;

//     products.push(...pageProducts);
//     console.log(`Total products so far: ${products.length}`);

//     pageNum++;
//   }

//   console.log(`\nSCRAPING COMPLETE`);
//   console.log(`Total products scraped: ${products.length}`);

//   // Save JSON
//   fs.writeFileSync("totalwine_products.json", JSON.stringify(products, null, 2));

//   // Save Excel
//   const worksheet = XLSX.utils.json_to_sheet(products);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "TotalWine Products");
//   XLSX.writeFile(workbook, "totalwine_products.xlsx");

//   console.log("JSON + Excel saved");

//   await browser.close();
// })();
