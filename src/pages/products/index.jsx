import React, { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import IconComponent from "@/components/ui/Icon";
import AccentButton from "@/components/ui/AccentButton";
import ProductTable from "./components/ProductTable";
import ViewProductModal from "./components/ViewProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.private.fetchAllProducts();
      if (res.data.code === "OK") {
        setProducts(res.data.data.products || []);
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
    fetchProducts();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProductId(product.id);
    setIsModalOpen(true);
  };

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Placeholder search bar */}
            <div className="relative w-full md:w-72">
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

            <div className="w-fit">
              <AccentButton text="Add Product" onClick={() => setIsModalOpen(true)} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : (
          <ProductTable products={products} onView={handleViewProduct} />
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
