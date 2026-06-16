import * as XLSX from "xlsx";

export function exportToExcel<
  T extends Record<string, string | number | boolean | null | undefined>,
>(data: T[], headers: string[], keys: (keyof T)[], filename: string): void {
  const worksheetData = data.map((row) => {
    const obj: Record<string, string | number | boolean | null | undefined> =
      {};
    headers.forEach((header, idx) => {
      obj[header] = row[keys[idx]];
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
