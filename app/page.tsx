"use client";

import { useState } from "react";
import InvoiceExtractor from "@/components/InvoiceExtractor";
import ProcurementChat from "@/components/ProcurementChat";

type Tab = "invoice" | "chat";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("invoice");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Procurement Decision Support
          </h1>
          <p className="text-gray-500 text-sm mt-1">Powered by Azure AI</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "invoice"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invoice Extraction
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "chat"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Procurement Chat
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === "invoice" ? <InvoiceExtractor /> : <ProcurementChat />}
        </div>
      </main>
    </div>
  );
}
