import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import AccentButton from "@/components/ui/AccentButton";
import GrayButton from "@/components/ui/GrayButton";
import Notification from "@/components/ui/Notification";
import API from "@/services/index";

const INIT = { full_name: "", email: "", password: "" };

const UserFormModal = ({ isOpen, onClose, mode = "create", initialUser = null, onSuccess = () => {} }) => {
  const [form, setForm] = useState(INIT);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "edit" && initialUser) {
      setForm({ full_name: initialUser.full_name || "", email: initialUser.email || "", password: "" });
    } else if (isOpen && mode === "create") {
      setForm(INIT);
    }
  }, [isOpen, mode, initialUser]);

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "create") {
        const res = await API.private.createUser(form);
        if (res.data.code === "OK") {
          Notification.success("User created.");
          onSuccess();
          onClose();
        } else {
          Notification.error(res.data.error || "Failed to create user.");
        }
      } else {
        const payload = { full_name: form.full_name, email: form.email };
        if (form.password?.trim()) payload.password = form.password;

        const res = await API.private.updateUser(initialUser.id, payload);
        if (res.data.code === "OK") {
          Notification.success("User updated.");
          onSuccess();
          onClose();
        } else {
          Notification.error(res.data.error || "Failed to update user.");
        }
      }
    } catch {
      Notification.error("Request failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      title={mode === "create" ? "Create User" : "Edit User"}
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={onChange}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="jane@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-accent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "create" ? "Password" : "Password (leave blank to keep unchanged)"}
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder={mode === "create" ? "••••••" : "Leave blank to keep current password"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-accent"
            {...(mode === "create" ? { required: true, minLength: 6 } : {})}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <GrayButton text="Cancel" type="button" onClick={onClose} disabled={submitting} />
          <AccentButton
            text={submitting ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
            type="submit"
            disabled={submitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
