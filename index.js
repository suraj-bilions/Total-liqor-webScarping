import express from "express";

import totalwineWine from "./routes/totalwineWine.route.js";
import totalwineSpirits from "./routes/totalwineSpirits.route.js";
import specsWine from "./routes/specsWine.route.js";
import specsSpirits from "./routes/specsSpirits.route.js";

const app = express();

app.use("/scrape/totalwine/wine", totalwineWine);
app.use("/scrape/totalwine/spirits", totalwineSpirits);
app.use("/scrape/specs/wine", specsWine);
app.use("/scrape/specs/spirits", specsSpirits);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000"),
  console.log("🚀 Server running on http://localhost:3000/scrape/totalwine/wine"),
  console.log("🚀 Server running on http://localhost:3000/scrape/totalwine/spirits"),
  console.log("🚀 Server running on http://localhost:3000/scrape/specs/wine"),
  console.log("🚀 Server running on http://localhost:3000/scrape/specs/spirits"),

);
