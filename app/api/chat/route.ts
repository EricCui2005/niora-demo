import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import { loadStockData, stockToCSV } from "@/lib/stock";
import { getUploadedCSV } from "@/lib/csv-store";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" },
        { status: 400 }
      );
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json(
        { error: "Azure OpenAI credentials not configured" },
        { status: 500 }
      );
    }

    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: "2025-04-01-preview",
      deployment,
    });

    const uploadedCSV = getUploadedCSV();

    if (!uploadedCSV) {
      return NextResponse.json(
        { error: "No CSV data uploaded. Please upload a CSV file first." },
        { status: 400 }
      );
    }

    const stockData = loadStockData(uploadedCSV);
    const stockCSV = stockToCSV(stockData);
    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a procurement decision support assistant.
You help analyze inventory data and provide insights for procurement decisions.

Here is the current stock data (CSV format):
${stockCSV}

The CSV columns represent various aspects of the inventory. Analyze the data based on the column headers provided.
Today's date is ${today}.

Provide clear, actionable insights. Use tables when helpful.`;

    const response = await client.chat.completions.create({
      model: deployment,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_completion_tokens: 1000,
    });

    const assistantMessage = response.choices[0]?.message?.content || "";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: `Chat error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
