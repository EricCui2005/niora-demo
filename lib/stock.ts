export interface StockItem {
  drug_name: string;
  quantity: number;
  reorder_level: number;
  strength: string;
  dosage_form: string;
  unit_of_measure: string;
  reorder_quantity: number;
  location: string;
  batch_number: string;
  expiry_date: string;
  notes: string;
}

export function loadStockData(csvContent?: string | null): StockItem[] {
  if (!csvContent) {
    return [];
  }

  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const item: Record<string, string | number> = {};

    headers.forEach((header, index) => {
      const value = values[index] || "";
      if (["quantity", "reorder_level", "reorder_quantity"].includes(header)) {
        item[header] = parseFloat(value) || 0;
      } else {
        item[header] = value;
      }
    });

    return item as unknown as StockItem;
  });
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  return values;
}

export function stockToCSV(items: StockItem[]): string {
  const headers = [
    "drug_name",
    "quantity",
    "reorder_level",
    "strength",
    "dosage_form",
    "unit_of_measure",
    "reorder_quantity",
    "location",
    "batch_number",
    "expiry_date",
    "notes",
  ];

  const rows = items.map((item) =>
    headers.map((h) => item[h as keyof StockItem] ?? "").join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
