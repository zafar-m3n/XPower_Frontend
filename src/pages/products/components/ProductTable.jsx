import React from "react";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";

const columns = [
  { key: "name", label: "Product Name" },
  { key: "code", label: "Code" },
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" }, // category.name
  { key: "cost", label: "Cost" },
  { key: "total_stock", label: "Stock" },
  { key: "actions", label: "Actions" },
];

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

        return row[col.key];
      }}
    />
  );
};

export default ProductTable;
