import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";
import CategoryFormModal from "./components/CategoryFormModal";
import Modal from "@/components/ui/Modal";
import DefaultLayout from "@/layouts/DefaultLayout";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await API.private.fetchAllCategories();
      if (res.data.code === "OK") {
        setCategories(res.data.data.categories);
      }
    } catch {
      Notification.error("Failed to load categories");
    }
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
      loadCategories();
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
      loadCategories();
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

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
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

        <div className="max-w-md mx-auto">
          <Table columns={columns} data={categories} renderCell={renderCell} />
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

        <Modal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          title="Confirm Deletion"
          size="md"
        >
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
    </DefaultLayout>
  );
};

export default CategoryList;
