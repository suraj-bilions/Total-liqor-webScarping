
import { scrapeTotalWineService } from "../services/totalWine.service.js";

export async function scrapeTotalWine(baseURL, type) {
  try {
    return await scrapeTotalWineService(baseURL, type);
  } catch (error) {
    console.error("❌ TotalWine Controller Error:", error);
    throw error;
  }
}