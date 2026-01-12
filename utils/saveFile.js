import fs from "fs";
import XLSX from "xlsx";

export function saveData(data, jsonFile, excelFile, sheetName, append = false) {
  /* ---------- JSON ---------- */
  let jsonData = [];

  if (append && fs.existsSync(jsonFile)) {
    jsonData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  }

  jsonData.push(...data);
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));

  /* ---------- EXCEL ---------- */
  let workbook;
  let worksheet;

  if (append && fs.existsSync(excelFile)) {
    workbook = XLSX.readFile(excelFile);
    worksheet = workbook.Sheets[sheetName];
    const existingData = XLSX.utils.sheet_to_json(worksheet);
    const updatedData = [...existingData, ...data];
    worksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = worksheet;
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  XLSX.writeFile(workbook, excelFile);
}
