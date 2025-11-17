import React from "react";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";

const columns = [
  { key: "name", label: "Product Name" },
  { key: "code", label: "Code" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" }, // category.name
  { key: "cost", label: "Cost" },
  { key: "grn_date", label: "GRN Date" }, // NEW
  { key: "total_stock", label: "Stock" },
  { key: "remarks", label: "Remarks" }, // NEW (truncated)
  { key: "actions", label: "Actions" },
];

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB"); // e.g. 17/11/2025
};

const truncateText = (text, maxLength = 50) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

const ProductTable = ({ products = [], onView = () => {} }) => {
  return (
    <Table
      columns={columns}
      data={products}
      emptyMessage="No products available."
      renderCell={(row, col) => {
        if (col.key === "actions") {
          return <AccentButton text="View" className="text-sm px-3 py-1" onClick={() => onView(row)} />;
        }

        if (col.key === "category") {
          return row.category?.name || "-";
        }

        if (col.key === "cost") {
          return `Rs. ${row.cost}`;
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

        return row[col.key];
      }}
    />
  );
};

export default ProductTable;
