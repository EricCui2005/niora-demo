"use client";

import { useState } from "react";
import InvoiceExtractor from "@/components/InvoiceExtractor";
import ProcurementChat from "@/components/ProcurementChat";

type Tab = "invoice" | "chat";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("invoice");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Procurement Decision Support
              </h1>
              <p className="text-emerald-600 text-sm font-medium mt-0.5">Powered by Azure AI</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "invoice"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invoice Extraction
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "chat"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Procurement Chat
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "invoice" ? <InvoiceExtractor /> : <ProcurementChat />}
        </div>
      </main>
    </div>
  );
}
