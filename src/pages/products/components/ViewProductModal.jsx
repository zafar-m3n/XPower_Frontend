import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import IconComponent from "@/components/ui/Icon";

const ViewProductModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await API.private.fetchProductDetails(productId);
      if (res.data.code === "OK") {
        setProduct(res.data.data.product);
      } else {
        Notification.error(res.data.error || "Failed to fetch product details.");
      }
    } catch (err) {
      Notification.error("Error loading product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="xl">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : product ? (
        <div className="space-y-6 text-gray-800 font-dm-sans">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-800">Code:</span> {product.code}
              </p>
              <p>
                <span className="font-medium text-gray-800">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-medium text-gray-800">Category:</span> {product.category?.name || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Cost:</span>{" "}
                <span className="text-accent font-semibold">Rs. {product.cost}</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* Warehouse Breakdown */}
          <div>
            <h4 className="text-md font-bold text-gray-900 mb-2 flex items-center gap-2">
              <IconComponent icon="mdi:warehouse" width={20} /> Stock by Warehouse
            </h4>
            {product.stock_by_warehouse?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.stock_by_warehouse.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 shadow-sm"
                  >
                    <span className="font-medium text-gray-800">{item.warehouse}</span>
                    <span className="font-semibold text-accent">{item.quantity} pcs</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No warehouse data available.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No product details available.</p>
      )}
    </Modal>
  );
};

export default ViewProductModal;
