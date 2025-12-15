import React from "react";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";

const columns = [
  { key: "code", label: "Code" },
  { key: "product", label: "Product" }, // Description + Name
  { key: "category", label: "Category" },
  { key: "cost", label: "Cost" },
  { key: "total_stock", label: "Stock" },
  { key: "total_stock_value", label: "Total Stock Value" }, // ✅ NEW
  { key: "grn_date", label: "GRN Date" },
  { key: "remarks", label: "Remarks" },
  { key: "actions", label: "Actions" },
];

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
};

const truncateText = (text, maxLength = 50) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  return `Rs. ${Number(value).toLocaleString()}`;
};

const ProductTable = ({ products = [], onView = () => {} }) => {
  return (
    <Table
      columns={columns}
      data={products}
      emptyMessage="No products available."
      renderCell={(row, col) => {
        // ✅ Product column (Description + Name)
        if (col.key === "product") {
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{row.description || "-"}</span>
              <span className="text-xs text-gray-500">{row.name || "-"}</span>
            </div>
          );
        }

        if (col.key === "category") {
          return row.category?.name || "-";
        }

        if (col.key === "cost") {
          return formatCurrency(row.cost);
        }

        // ✅ NEW: Total Stock Value = cost × total_stock
        if (col.key === "total_stock_value") {
          const cost = Number(row.cost) || 0;
          const stock = Number(row.total_stock) || 0;
          return formatCurrency(cost * stock);
        }

        if (col.key === "grn_date") {
          return formatDate(row.grn_date);
        }

        if (col.key === "remarks") {
          return (
            <span title={row.remarks || ""} className="block max-w-xs truncate">
              {truncateText(row.remarks, 60)}
            </span>
          );
        }

        if (col.key === "actions") {
          return <AccentButton text="View" className="text-sm px-3 py-1" onClick={() => onView(row)} />;
        }

        return row[col.key] ?? "-";
      }}
    />
  );
};

export default ProductTable;
