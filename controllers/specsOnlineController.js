import { scrapeSpecsOnlineService } from "../services/specsOnline.service.js";

export async function scrapeSpecsOnline(baseURL, type, maxPages) {
  try {
    return await scrapeSpecsOnlineService(baseURL, type, maxPages);
  } catch (error) {
    console.error("❌ SpecsOnline Controller Error:", error);
    throw error;
  }
}
