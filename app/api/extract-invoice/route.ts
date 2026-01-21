import { NextRequest, NextResponse } from "next/server";
import DocumentIntelligence, {
  AnalyzeOperationOutput,
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const endpoint = process.env.AZURE_DOC_INTELLIGENCE_ENDPOINT;
    const key = process.env.AZURE_DOC_INTELLIGENCE_KEY;

    if (!endpoint || !key) {
      return NextResponse.json(
        { error: "Azure Document Intelligence credentials not configured" },
        { status: 500 }
      );
    }

    const client = DocumentIntelligence(endpoint, { key });

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-invoice")
      .post({
        contentType: "application/json",
        body: {
          base64Source: base64Content,
        },
      });

    if (isUnexpected(initialResponse)) {
      return NextResponse.json(
        { error: "Failed to analyze document" },
        { status: 500 }
      );
    }

    const poller = getLongRunningPoller(client, initialResponse);
    const result = (await poller.pollUntilDone())
      .body as AnalyzeOperationOutput;

    if (result.status !== "succeeded" || !result.analyzeResult?.documents) {
      return NextResponse.json(
        { error: "No invoice data could be extracted" },
        { status: 400 }
      );
    }

    const invoice = result.analyzeResult.documents[0];
    const fields = invoice.fields || {};

    const extractedData = {
      vendor: {
        name: fields.VendorName?.content || null,
        address: fields.VendorAddress?.content || null,
      },
      customer: {
        name: fields.CustomerName?.content || null,
        address: fields.CustomerAddress?.content || null,
      },
      invoiceId: fields.InvoiceId?.content || null,
      invoiceDate: fields.InvoiceDate?.content || null,
      paymentTerm: fields.PaymentTerm?.content || null,
      items:
        fields.Items?.valueArray?.map(
          (item: { valueObject?: Record<string, { content?: string }> }) => ({
            description: item.valueObject?.Description?.content || "",
            quantity: item.valueObject?.Quantity?.content || "",
            unitPrice: item.valueObject?.UnitPrice?.content || "",
            amount: item.valueObject?.Amount?.content || "",
          })
        ) || [],
      subtotal: fields.SubTotal?.content || null,
      tax: fields.TotalTax?.content || null,
      total: fields.InvoiceTotal?.content || null,
      rawFields: Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
          key,
          (value as { content?: string })?.content || String(value),
        ])
      ),
    };

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("Error extracting invoice:", error);
    return NextResponse.json(
      { error: `Failed to extract invoice: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
