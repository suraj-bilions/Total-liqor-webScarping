// import express from "express";

// // SpecsOnline
// import { scrapeSpecsOnline } from "../controllers/specsOnlineController.js";

// // TotalWine
// import { scrapeTotalWine } from "../controllers/totalWineController.js";
// import { scrapeTotalWineWithDetails } from "../controllers/totalWineDetailController.js";

// const router = express.Router();

// /* =====================================
//    SPECS ONLINE – SPIRITS
// ===================================== */
// router.get("/specs/spirits", async (req, res) => {
//   const data = await scrapeSpecsOnline(
//     "https://specsonline.com/product-category/spirits",
//     "spirits",
//     492
//   );

//   return res.json({
//     success: true,
//     count: data.length,
//     message: "Specs Spirits scraping completed",
//   });
// });

// /* =====================================
//    SPECS ONLINE – WINE
// ===================================== */
// router.get("/specs/wine", async (req, res) => {
//   const data = await scrapeSpecsOnline(
//     "https://specsonline.com/product-category/wine",
//     "wine",
//     420
//   );

//   return res.json({
//     success: true,
//     count: data.length,
//     message: "Specs Wine scraping completed",
//   });
// });

// /* =====================================
//    TOTALWINE – SPIRITS
// ===================================== */
// router.get("/totalwine/spirits", async (req, res) => {
//   const data = await scrapeTotalWine(
//     "https://www.totalwine.com/spirits/c/c0030",
//     "spirits"
//   );

//   return res.json({
//     success: true,
//     count: data.length,
//     message: "TotalWine Spirits scraping completed",
//   });
// });

// /* =====================================
//    TOTALWINE – WINE
// ===================================== */
// router.get("/totalwine/wine", async (req, res) => {
//   const data = await scrapeTotalWine(
//     "https://www.totalwine.com/wine/c/c0020",
//     "wine"
//   );

//   return res.json({
//     success: true,
//     total: data.length,
//     message: "TotalWine Wine scraping completed",
//   });
// });

// /* =====================================
//    TOTALWINE – WINE DETAILS
// ===================================== */
// router.get("/totalwine/wine/details", async (req, res) => {
//   const data = await scrapeTotalWineWithDetails(
//     "https://www.totalwine.com/wine/c/c0020",
//     "wine"
//   );

//   return res.json({
//     success: true,
//     total: data.length,
//     message: "TotalWine Wine detailed scraping completed",
//   });
// });

// export default router;

import express from "express";

// SpecsOnline
import { scrapeSpecsOnline } from "../controllers/specsOnlineController.js";

// TotalWine
import { scrapeTotalWine } from "../controllers/totalWineController.js";
import { scrapeTotalWineWithDetails } from "../controllers/totalWineDetailController.js";

const router = express.Router();

/* =====================================
   SPECS ONLINE – SPIRITS
===================================== */
router.get("/specs/spirits", async (req, res) => {
  const data = await scrapeSpecsOnline(
    "https://specsonline.com/product-category/spirits",
    "spirits",
    492
  );

  return res.json({
    success: true,
    count: data.length,
    message: "Specs Spirits scraping completed",
  });
});

/* =====================================
   SPECS ONLINE – WINE
===================================== */
router.get("/specs/wine", async (req, res) => {
  const data = await scrapeSpecsOnline(
    "https://specsonline.com/product-category/wine",
    "wine",
    420
  );

  return res.json({
    success: true,
    count: data.length,
    message: "Specs Wine scraping completed",
  });
});

/* =====================================
   TOTALWINE – SPIRITS
   (Batch save – no return data)
===================================== */
router.get("/totalwine/spirits", async (req, res) => {
  await scrapeTotalWine(
    "https://www.totalwine.com/spirits/c/c0030",
    "spirits"
  );

  return res.json({
    success: true,
    message: "TotalWine Spirits scraping completed",
  });
});

/* =====================================
   TOTALWINE – WINE
   (Batch save – no return data)
===================================== */
router.get("/totalwine/wine", async (req, res) => {
  await scrapeTotalWine(
    "https://www.totalwine.com/wine/c/c0020",
    "wine"
  );

  return res.json({
    success: true,
    message: "TotalWine Wine scraping completed",
  });
});

/* =====================================
   TOTALWINE – WINE DETAILS
   (Batch save – no return data)
===================================== */
router.get("/totalwine/wine/details", async (req, res) => {
  await scrapeTotalWineWithDetails(
    "https://www.totalwine.com/wine/c/c0020",
    "wine"
  );

  return res.json({
    success: true,
    message: "TotalWine Wine detailed scraping completed",
  });
});

export default router;
