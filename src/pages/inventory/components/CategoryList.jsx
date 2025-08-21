import React, { useEffect, useState, useCallback } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";
import CategoryFormModal from "./CategoryFormModal";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination"; // <-- adjust path if needed

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10); // you can expose this with a select later
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = useCallback(
    async (page = currentPage, perPage = limit) => {
      try {
        setLoading(true);
        // If your API wrapper expects query params, pass them here:
        // e.g., API.private.fetchAllCategories({ page, limit: perPage })
        const res = await API.private.fetchAllCategories({ page, limit: perPage });

        if (res.data?.code === "OK") {
          const payload = res.data.data;
          setCategories(payload.categories || []);
          setCurrentPage(payload.pagination?.page ?? page);
          setTotalPages(payload.pagination?.totalPages ?? 1);
          setTotal(payload.pagination?.total ?? 0);
        } else {
          Notification.error("Failed to load categories");
        }
      } catch {
        Notification.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await API.private.updateCategory(data.id, { name: data.name });
        Notification.success("Category updated");
      } else {
        await API.private.createCategory({ name: data.name });
        Notification.success("Category created");
      }
      setModalOpen(false);
      setSelectedCategory(null);
      // Reload same page
      loadCategories(currentPage, limit);
    } catch {
      Notification.error("Failed to save category");
    }
  };

  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await API.private.deleteCategory(categoryToDelete);
      Notification.success("Category deleted");
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);

      // After deletion, it’s possible the current page becomes empty (e.g., deleting the last item on last page).
      // We’ll compute a safe next page and then load.
      const possibleLastPage = Math.max(1, Math.ceil((total - 1) / limit));
      const nextPage = Math.min(currentPage, possibleLastPage);
      setCurrentPage(nextPage);
      await loadCategories(nextPage, limit);
    } catch {
      Notification.error("Failed to delete category");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Category Name" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (row, col) => {
    if (col.key === "actions") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setModalOpen(true);
            }}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => confirmDelete(row.id)}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      );
    }
    return row[col.key];
  };

  // Load on first mount + whenever page/limit changes
  useEffect(() => {
    loadCategories(currentPage, limit);
  }, [currentPage, limit, loadCategories]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>

        <div className="flex items-center gap-4">
          {/* Optional page size selector; hide if you don’t want it */}
          {/* <select
            className="border rounded px-2 py-1 text-sm bg-white"
            value={limit}
            onChange={(e) => { setCurrentPage(1); setLimit(Number(e.target.value)); }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select> */}

          <div className="w-fit">
            <AccentButton
              text="Add Category"
              onClick={() => {
                setSelectedCategory(null);
                setModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {/* You can show a skeleton/spinner if loading */}
        {loading ? (
          <div className="p-6 text-gray-500">Loading…</div>
        ) : (
          <Table columns={columns} data={categories} renderCell={renderCell} />
        )}
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          Showing page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span> • Total <span className="font-medium">{total}</span>{" "}
          categories
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSave}
        initialData={selectedCategory}
      />

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" size="md">
        <div className="space-y-4">
          <p>Are you sure you want to delete this category?</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </button>
            <div className="w-fit">
              <AccentButton text="Delete" onClick={handleDelete} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
