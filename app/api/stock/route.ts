import { NextResponse } from "next/server";
import { loadStockData } from "@/lib/stock";
import { getUploadedCSV } from "@/lib/csv-store";

export async function GET() {
  try {
    const uploadedCSV = getUploadedCSV();
    const stockData = loadStockData(uploadedCSV);
    return NextResponse.json(stockData);
  } catch (error) {
    console.error("Error loading stock data:", error);
    return NextResponse.json(
      { error: "Failed to load stock data" },
      { status: 500 }
    );
  }
}
