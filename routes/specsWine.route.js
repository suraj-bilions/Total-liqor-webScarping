import express from "express";
import { scrapeSpecsOnline } from "../controllers/specsOnlineController.js";

const router = express.Router();


router.get("/", async (req, res) => {
 // res.send("✅ Specs Wine scraping started");
  const data = await scrapeSpecsOnline(
    "https://specsonline.com/product-category/wine",
    "wine",
    420
  );
   return   res.json({
    success: true,
    count: data.length,
        message: "Scraping completed"
});
});


export default router;
