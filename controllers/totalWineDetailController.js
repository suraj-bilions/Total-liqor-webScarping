import { scrapeTotalWineDetailsFromFileService } from "../services/totalWineDetail.service.js";

export async function scrapeTotalWineWithDetails() {
  try {
    await scrapeTotalWineDetailsFromFileService();
    return { success: true };
  } catch (error) {
    console.error("❌ TotalWine Detail Controller Error:", error);
    throw error;
  }
}
