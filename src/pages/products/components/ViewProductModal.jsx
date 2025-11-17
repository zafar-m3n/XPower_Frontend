import React, { useEffect, useState } from "react";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import Modal from "@/components/ui/Modal";
import IconComponent from "@/components/ui/Icon";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB"); // 17/11/2025
};

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
            {/* Left: Image + basic info */}
            <div className="space-y-3">
              <div className="w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center aspect-video">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 text-sm py-6">
                    <IconComponent icon="mdi:image-off-outline" width={32} className="mb-2" />
                    <span>No image available</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                {product.description ? (
                  <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No description provided.</p>
                )}
              </div>
            </div>

            {/* Right: Meta fields */}
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-800">Code:</span> {product.code}
              </p>
              <p>
                <span className="font-medium text-gray-800">Brand:</span> {product.brand || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Category:</span> {product.category?.name || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Cost:</span>{" "}
                <span className="text-accent font-semibold">Rs. {product.cost}</span>
              </p>
              <p>
                <span className="font-medium text-gray-800">GRN Date:</span> {formatDate(product.grn_date)}
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

          {/* Remarks Section */}
          <div>
            <h4 className="text-md font-bold text-gray-900 mb-2 flex items-center gap-2">
              <IconComponent icon="mdi:note-text-outline" width={20} /> Remarks
            </h4>
            {product.remarks ? (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm text-gray-700 whitespace-pre-line">
                {product.remarks}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No remarks added for this product.</p>
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
