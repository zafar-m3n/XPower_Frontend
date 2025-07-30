import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/form/TextInput";
import AccentButton from "@/components/ui/AccentButton";

const CategoryFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    onSave({ id: initialData?.id, name: name.trim() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Category" : "Add Category"} size="md">
      <div className="space-y-4">
        <TextInput
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electronics"
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

export default CategoryFormModal;
