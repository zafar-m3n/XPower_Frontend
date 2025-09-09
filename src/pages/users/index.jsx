import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import AccentButton from "@/components/ui/AccentButton";
import Pagination from "@/components/ui/Pagination";

import UsersTable from "./components/UsersTable";
import ViewUserModal from "./components/ViewUserModal";
import UserFormModal from "./components/UserFormModal";
import UserSearchBar from "./components/UserSearchBar";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [activeUser, setActiveUser] = useState(null); // object or null

  const [searchTerm, setSearchTerm] = useState("");

  // Backend returns { code:"OK", data: { data: rows, meta: { page, pages } } }
  const fetchUsers = async (page = 1, q = "") => {
    setLoading(true);
    try {
      const res = await API.private.fetchAllUsers({ page, limit: 10, q });
      if (res.data.code === "OK") {
        const payload = res.data.data || {};
        const list = payload.data || [];
        const meta = payload.meta || { page: 1, pages: 1 };

        setUsers(list);
        setPagination({ page: meta.page || 1, totalPages: meta.pages || 1 });
      } else {
        Notification.error(res.data.error || "Failed to fetch users.");
      }
    } catch (err) {
      Notification.error("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchUsers(page, searchTerm);
  };

  const handleOpenCreate = () => {
    setFormMode("create");
    setActiveUser(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setFormMode("edit");
    setActiveUser(user);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (user) => {
    setActiveUser(user);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (!user?.id) return;
    if (!confirm(`Delete user "${user.full_name}"? This cannot be undone.`)) return;

    try {
      const res = await API.private.deleteUser(user.id);
      if (res.data.code === "OK") {
        Notification.success("User deleted.");
        fetchUsers(pagination.page, searchTerm);
      } else {
        Notification.error(res.data.error || "Failed to delete user.");
      }
    } catch {
      Notification.error("Error deleting user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Users</h2>
          <div className="w-fit">
            <AccentButton text="Create User" onClick={handleOpenCreate} />
          </div>
        </div>

        <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={(term) => fetchUsers(1, term)} />

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <>
            <UsersTable users={users} onView={handleOpenView} onEdit={handleOpenEdit} onDelete={handleDelete} />
            <Pagination
              className="mt-6"
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* View Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setActiveUser(null);
        }}
        user={activeUser}
      />

      {/* Create / Edit Modal */}
      <UserFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialUser={activeUser}
        onClose={() => {
          setIsFormModalOpen(false);
          setActiveUser(null);
        }}
        onSuccess={() => fetchUsers(pagination.page, searchTerm)}
      />
    </DefaultLayout>
  );
};

export default UsersPage;
