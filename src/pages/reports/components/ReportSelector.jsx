import React from "react";

const reportList = [
  { key: "low-stock", label: "Low Stock Report" },
  { key: "out-of-stock", label: "Out of Stock Report" },
  { key: "stock-by-warehouse", label: "Stock by Warehouse" },
];

const ReportSelector = ({ selected, setSelected }) => {
  return (
    <div className="space-y-2">
      {reportList.map((report) => (
        <button
          key={report.key}
          onClick={() => setSelected(report.key)}
          className={`w-full text-left px-4 py-2 rounded border ${
            selected === report.key ? "bg-accent/10 border-accent text-accent" : "bg-white border-gray-200"
          } hover:bg-accent/5`}
        >
          {report.label}
        </button>
      ))}
    </div>
  );
};

export default ReportSelector;
