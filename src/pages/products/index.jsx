import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import AccentButton from "@/components/ui/AccentButton";
import ProductTable from "./components/ProductTable";
import ViewProductModal from "./components/ViewProductModal";
import UploadExcelModal from "./components/UploadExcelModal";
import Pagination from "@/components/ui/Pagination";
import ProductSearchBar from "./components/ProductSearchBar";
import Select from "@/components/form/Select"; // 👈 use your custom Select

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10); // page size state

  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      // use the current limit state instead of hardcoded 10
      const res = await API.private.fetchAllProducts(page, limit, search);
      if (res.data.code === "OK") {
        setProducts(res.data.data.products || []);
        // backend already returns page, totalPages, limit
        setPagination(res.data.data.pagination || { page: 1, totalPages: 1, limit });
      } else {
        Notification.error(res.data.error || "Failed to fetch products.");
      }
    } catch (err) {
      Notification.error("Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchProducts(page, searchTerm);
  };

  const handleViewProduct = (product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  // When component mounts, load with default limit
  useEffect(() => {
    fetchProducts(1, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When limit changes, reset to page 1 and refetch with current search
  useEffect(() => {
    fetchProducts(1, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  // newLimit is the primitive value from Select (e.g. 10, 25, 50, 100)
  const handleLimitChange = (newLimit) => {
    if (!newLimit) return;
    setLimit(Number(newLimit));
  };

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header + Upload button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <div className="w-fit">
            <AccentButton text="Upload Product List" onClick={() => setIsUploadModalOpen(true)} />
          </div>
        </div>

        {/* Search bar + page size selector */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <ProductSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={(term) => {
              setSearchTerm(term);
              fetchProducts(1, term);
            }}
          />

          {/* Page size dropdown – to the right of search bar */}
          <div className="flex items-center gap-2 text-sm md:w-auto w-full">
            <span className="text-gray-600 whitespace-nowrap">Show</span>
            <div className="min-w-[120px]">
              <Select
                value={limit}
                onChange={handleLimitChange}
                options={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
                placeholder="Rows"
              />
            </div>
            <span className="text-gray-600 whitespace-nowrap">per page</span>
          </div>
        </div>

        {/* Table + pagination */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <>
            <ProductTable products={products} onView={handleViewProduct} />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          </>
        )}
      </div>

      {/* View product modal */}
      <ViewProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
      />

      {/* Upload Excel modal */}
      <UploadExcelModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => fetchProducts(1, searchTerm)}
      />
    </DefaultLayout>
  );
};

export default Products;
