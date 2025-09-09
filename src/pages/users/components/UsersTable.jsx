import React from "react";
import Table from "@/components/ui/Table";

const columns = [
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "Actions" },
];

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

const btnBase = "text-sm px-3 py-1 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-offset-1";
const btnView = `${btnBase} border-gray-400 text-gray-700 hover:bg-gray-50 focus:ring-gray-300`;
const btnEdit = `${btnBase} border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-300`;
const btnDelete = `${btnBase} border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-300`;

const UsersTable = ({ users = [], onView = () => {}, onEdit = () => {}, onDelete = () => {} }) => {
  return (
    <Table
      columns={columns}
      data={users}
      emptyMessage="No users available."
      renderCell={(row, col) => {
        if (col.key === "actions") {
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onView(row)}
                className={btnView}
                aria-label={`View ${row.full_name}`}
                title="View"
              >
                View
              </button>
              <button
                type="button"
                onClick={() => onEdit(row)}
                className={btnEdit}
                aria-label={`Edit ${row.full_name}`}
                title="Edit"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(row)}
                className={btnDelete}
                aria-label={`Delete ${row.full_name}`}
                title="Delete"
              >
                Delete
              </button>
            </div>
          );
        }

        if (col.key === "createdAt") return formatDate(row.createdAt);
        return row[col.key] ?? "-";
      }}
    />
  );
};

export default UsersTable;
