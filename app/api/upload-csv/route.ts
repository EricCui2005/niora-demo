import { NextRequest, NextResponse } from "next/server";
import { setUploadedCSV } from "@/lib/csv-store";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      );
    }

    const content = await file.text();

    // Validate CSV has content
    if (!content.trim()) {
      return NextResponse.json(
        { error: "CSV file is empty" },
        { status: 400 }
      );
    }

    // Store the CSV content
    setUploadedCSV(content);

    return NextResponse.json({
      message: "CSV uploaded successfully",
      fileName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Error uploading CSV:", error);
    return NextResponse.json(
      { error: `Upload error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
