import express from "express";
import { scrapeSpecsOnline } from "../controllers/specsOnlineController.js";

const router = express.Router();
router.get("/", async (req, res) => {
 // res.send("✅ Specs Spirits scraping started");
  const data = await scrapeSpecsOnline(
    "https://specsonline.com/product-category/spirits",
    "spirits",
    492
  );
   return   res.json({
    success: true,
    count: data.length,
    message: "Scraping completed"
});
});


export default router;
