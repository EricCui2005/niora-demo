"use client";

import { useState, useEffect } from "react";

interface StockItem {
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

export default function StockTable() {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded && stockData.length === 0) {
      loadStockData();
    }
  }, [isExpanded, stockData.length]);

  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stock");
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error("Failed to load stock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <span className="font-medium text-gray-700">View Current Stock Data</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
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

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Drug Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Quantity
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Reorder Level
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Strength
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Form
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Location
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">
                    Expiry Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-gray-100 ${
                      item.quantity <= item.reorder_level
                        ? "bg-red-50"
                        : ""
                    }`}
                  >
                    <td className="px-3 py-2">{item.drug_name}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">{item.reorder_level}</td>
                    <td className="px-3 py-2">{item.strength}</td>
                    <td className="px-3 py-2">{item.dosage_form}</td>
                    <td className="px-3 py-2">{item.location}</td>
                    <td className="px-3 py-2">{item.expiry_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
