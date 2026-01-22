import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import { loadStockData, stockToCSV } from "@/lib/stock";

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

    const stockData = loadStockData();
    const stockCSV = stockToCSV(stockData);
    const today = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are a procurement decision support assistant for a hospital pharmacy.
You help analyze drug inventory data and provide insights for procurement decisions.

Here is the current stock data (CSV format):
${stockCSV}

Key columns:
- drug_name: Name of the drug
- quantity: Current stock quantity
- reorder_level: Minimum stock level before reorder is needed
- strength: Drug strength/dosage
- dosage_form: Form (Tablet, Injection, etc.)
- reorder_quantity: Standard reorder amount
- location: Storage location
- batch_number: Batch identifier
- expiry_date: Expiration date (YYYY-MM-DD format)

When analyzing stockout risk, compare quantity to reorder_level.
A drug is at risk if quantity <= reorder_level.
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
