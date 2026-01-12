import express from "express";
import allScrapersRoute from "./routes/allScrapers.route.js";

const app = express();

/* 🔥 route prefix */
app.use("/scrape", allScrapersRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👉 TotalWine Wine:     http://localhost:${PORT}/scrape/totalwine/wine`);
  console.log(`👉 TotalWine Spirits:  http://localhost:${PORT}/scrape/totalwine/spirits`);
  console.log(`👉 Specs Wine:         http://localhost:${PORT}/scrape/specs/wine`);
  console.log(`👉 Specs Spirits:      http://localhost:${PORT}/scrape/specs/spirits`);
});

