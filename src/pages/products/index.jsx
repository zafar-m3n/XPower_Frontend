import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import IconComponent from "@/components/ui/Icon";
import AccentButton from "@/components/ui/AccentButton";
import ProductTable from "./components/ProductTable";
import ViewProductModal from "./components/ViewProductModal";
import Pagination from "@/components/ui/Pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.private.fetchAllProducts(page, 10);
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

  useEffect(() => {
    fetchProducts(pagination.page);
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <div className="w-fit">
            <AccentButton text="Upload Product List" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>

        <div className="relative w-full">
          <input
            type="text"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-accent"
            placeholder="Search by name or code"
            disabled
          />
          <IconComponent
            icon="mdi:magnify"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            width={20}
          />
        </div>

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
    </DefaultLayout>
  );
};

export default Products;
