import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Notification from "@/components/ui/Notification";
import Table from "@/components/ui/Table";
import AccentButton from "@/components/ui/AccentButton";
import Modal from "@/components/ui/Modal";
import WarehouseFormModal from "./WarehouseFormModal";

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  const loadWarehouses = async () => {
    try {
      const res = await API.private.fetchAllWarehouses();
      if (res.data.code === "OK") {
        setWarehouses(res.data.data.warehouses);
      }
    } catch {
      Notification.error("Failed to load warehouses");
    }
  };

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await API.private.updateWarehouse(data.id, {
          name: data.name,
          location: data.location,
        });
        Notification.success("Warehouse updated");
      } else {
        await API.private.createWarehouse({
          name: data.name,
          location: data.location,
        });
        Notification.success("Warehouse created");
      }
      setModalOpen(false);
      setSelectedWarehouse(null);
      loadWarehouses();
    } catch {
      Notification.error("Failed to save warehouse");
    }
  };

  const confirmDelete = (id) => {
    setWarehouseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!warehouseToDelete) return;
    try {
      await API.private.deleteWarehouse(warehouseToDelete);
      Notification.success("Warehouse deleted");
      setDeleteConfirmOpen(false);
      setWarehouseToDelete(null);
      loadWarehouses();
    } catch {
      Notification.error("Failed to delete warehouse");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Warehouse Name" },
    { key: "location", label: "Location" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (row, col) => {
    if (col.key === "actions") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedWarehouse(row);
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
    loadWarehouses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Warehouses</h2>
        <div className="w-fit">
          <AccentButton
            text="Add Warehouse"
            onClick={() => {
              setSelectedWarehouse(null);
              setModalOpen(true);
            }}
          />
        </div>
      </div>

      <div className="mx-auto">
        <Table columns={columns} data={warehouses} renderCell={renderCell} />
      </div>

      <WarehouseFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedWarehouse(null);
        }}
        onSave={handleSave}
        initialData={selectedWarehouse}
      />

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" size="md">
        <div className="space-y-4">
          <p>Are you sure you want to delete this warehouse?</p>
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

export default WarehouseList;
