"use client";

import { useState } from "react";
import EmeraldWave from "./EmeraldWave";

interface InvoiceItem {
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
}

interface ExtractedInvoice {
  vendor: { name: string | null; address: string | null };
  customer: { name: string | null; address: string | null };
  invoiceId: string | null;
  invoiceDate: string | null;
  paymentTerm: string | null;
  items: InvoiceItem[];
  subtotal: string | null;
  tax: string | null;
  total: string | null;
  rawFields: Record<string, string>;
}

export default function InvoiceExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<ExtractedInvoice | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInvoiceData(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-invoice", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract invoice");
      }

      setInvoiceData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Extract Invoice Data
        </h2>
        <p className="text-gray-600">
          Upload a procurement invoice PDF to extract structured fields using
          Azure Document Intelligence.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="text-gray-700">
                <span className="font-medium">{file.name}</span>
                <span className="text-gray-500 ml-2">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg
                  className="w-10 h-10 mx-auto mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Click to upload PDF invoice
              </div>
            )}
          </div>
        </label>
      </div>

      {file && (
        <div className="space-y-4">
          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? "Analyzing invoice..." : "Extract Invoice Data"}
          </button>
          {isLoading && (
            <div className="rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/50">
              <div className="text-center text-sm text-emerald-700 pt-3 font-medium">
                Processing with Azure AI...
              </div>
              <EmeraldWave />
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {invoiceData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-3">
                Supplier Information
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Vendor:</span>{" "}
                  {invoiceData.vendor.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {invoiceData.vendor.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Invoice #:</span>{" "}
                  {invoiceData.invoiceId || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {invoiceData.invoiceDate || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-3">
                Customer Information
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {invoiceData.customer.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {invoiceData.customer.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Payment Terms:</span>{" "}
                  {invoiceData.paymentTerm || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {invoiceData.items.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Line Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-2">{item.description || "-"}</td>
                        <td className="px-4 py-2">{item.quantity || "-"}</td>
                        <td className="px-4 py-2">{item.unitPrice || "-"}</td>
                        <td className="px-4 py-2">{item.amount || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Totals</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-lg font-semibold text-gray-800">
                  {invoiceData.subtotal || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Tax</p>
                <p className="text-lg font-semibold text-gray-800">
                  {invoiceData.tax || "N/A"}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-200">
                <p className="text-sm text-emerald-600 font-medium">Total</p>
                <p className="text-xl font-bold text-emerald-700">
                  {invoiceData.total || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-700">
                View Raw Extracted Data
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showRawData ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showRawData && (
              <div className="border-t border-gray-200 p-4">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(invoiceData.rawFields, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
