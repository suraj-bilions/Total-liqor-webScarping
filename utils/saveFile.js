import fs from "fs";
import XLSX from "xlsx";

export function saveData(data, jsonFile, excelFile, sheetName) {
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, excelFile);

  console.log("Files saved successfully");
}