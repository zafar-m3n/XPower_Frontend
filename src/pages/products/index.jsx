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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await API.private.fetchAllProducts(page, 10, search);
      if (res.data.code === "OK") {
        setProducts(res.data.data.products || []);
        setPagination(res.data.data.pagination || { page: 1, totalPages: 1 });
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <div className="w-fit">
            <AccentButton text="Upload Product List" onClick={() => setIsUploadModalOpen(true)} />
          </div>
        </div>

        <ProductSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={(term) => fetchProducts(1, term)}
        />

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

      <ViewProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
      />

      <UploadExcelModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => fetchProducts(1, searchTerm)}
      />
    </DefaultLayout>
  );
};

export default Products;
