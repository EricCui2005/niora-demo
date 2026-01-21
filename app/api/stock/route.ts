import { NextResponse } from "next/server";
import { loadStockData } from "@/lib/stock";

export async function GET() {
  try {
    const stockData = loadStockData();
    return NextResponse.json(stockData);
  } catch (error) {
    console.error("Error loading stock data:", error);
    return NextResponse.json(
      { error: "Failed to load stock data" },
      { status: 500 }
    );
  }
}
