import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

const WarehouseFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
    setLocation(initialData?.location || "");
  }, [initialData]);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    onSave({ id: initialData?.id, name: name.trim(), location: location.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Warehouse" : "Add Warehouse"} size="md">
      <div className="space-y-4">
        <TextInput
          label="Warehouse Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Main Depot"
        />
        <TextInput
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Colombo 03"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-800">
            Cancel
          </button>
          <div className="w-fit">
            <AccentButton text="Save" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WarehouseFormModal;
