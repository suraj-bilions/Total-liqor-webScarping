import express from "express";
import { scrapeTotalWine } from "../controllers/totalWineController.js";

const router = express.Router();


router.get("/", async (req, res) => {
 // res.send("✅ TotalWine Spirits scraping started");
 const data =  await scrapeTotalWine("https://www.totalwine.com/spirits/c/c0030", "spirits");
   return   res.json({
    success: true,
    count: data.length,
    message: "Scraping completed"
});
});



export default router;
