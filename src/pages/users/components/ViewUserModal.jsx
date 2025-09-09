import React from "react";
import Modal from "@/components/ui/Modal";

const InfoRow = ({ label, value }) => (
  <p className="text-sm text-gray-700">
    <span className="font-medium text-gray-800">{label}:</span> {value ?? "-"}
  </p>
);

const ViewUserModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      {user ? (
        <div className="space-y-3 text-gray-800 font-dm-sans">
          <h3 className="text-lg font-semibold text-gray-900">{user.full_name}</h3>
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Created" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"} />
          <InfoRow label="Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"} />
        </div>
      ) : (
        <p className="text-gray-600">No user selected.</p>
      )}
    </Modal>
  );
};

export default ViewUserModal;
