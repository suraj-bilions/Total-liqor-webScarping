import express from "express";
import { scrapeTotalWine } from "../controllers/totalWineController.js";

const router = express.Router();

// router.get("/", async (req, res) => {
//   res.send("✅ TotalWine Wine scraping started");
//   const data = await scrapeTotalWine("https://www.totalwine.com/wine/c/c0020", "wine");
//     res.json({
//     success: true,
//     count: data.length,
//     data
// });
// });

router.get("/", async (req, res) => {
  const data = await scrapeTotalWine(
    "https://www.totalwine.com/wine/c/c0020",
    "wine"
  );

  return res.json({
    success: true,
    total: data.length,
    message: "Scraping completed"
  });
});

export default router;

