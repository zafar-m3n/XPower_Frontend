import React, { useEffect, useMemo, useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import API from "@/services/index";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import AccentButton from "@/components/ui/AccentButton";
import Select from "@/components/form/Select";
import TextInput from "@/components/form/TextInput";

const StockOut = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(false);

  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [referenceNo, setReferenceNo] = useState("");
  const [remarks, setRemarks] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // 1. Fetch Products for dropdown
  // ==========================
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      // large limit so dropdown has all products
      const res = await API.private.fetchAllProducts(1, 1000, "");
      if (res.data.code === "OK") {
        setProducts(res.data.data.products || []);
      } else {
        Notification.error(res.data.error || "Failed to load products.");
      }
    } catch (err) {
      Notification.error("Error loading products.");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: `${p.name} (${p.code})`,
      })),
    [products]
  );

  // ==========================
  // 2. Fetch Warehouses for selected product
  // ==========================
  const fetchWarehousesForProduct = async (productId) => {
    if (!productId) return;

    setWarehouses([]);
    setWarehousesLoading(true);

    try {
      const res = await API.private.fetchWarehousesForProduct(productId);
      if (res.data.code === "OK") {
        const apiWarehouses = res.data.data.warehouses || [];
        const enriched = apiWarehouses.map((w) => ({
          ...w,
          quantityOut: "", // user-entered value
        }));
        setWarehouses(enriched);
      } else {
        Notification.error(res.data.error || "Failed to load warehouses.");
      }
    } catch (err) {
      Notification.error("Error loading warehouses for product.");
    } finally {
      setWarehousesLoading(false);
    }
  };

  const handleProductChange = (value) => {
    // value is primitive because of your Select wrapper
    setSelectedProductId(value);
    setWarehouses([]);

    if (value) {
      fetchWarehousesForProduct(value);
    }
  };

  // ==========================
  // 3. Handle quantity changes per warehouse
  // ==========================
  const handleQuantityChange = (warehouseId, value) => {
    const sanitized = value.replace(/[^\d]/g, ""); // digits only
    setWarehouses((prev) => prev.map((w) => (w.warehouse_id === warehouseId ? { ...w, quantityOut: sanitized } : w)));
  };

  const totalQuantityOut = useMemo(
    () =>
      warehouses.reduce((sum, w) => {
        const qty = Number(w.quantityOut || 0);
        return sum + (Number.isNaN(qty) ? 0 : qty);
      }, 0),
    [warehouses]
  );

  // ==========================
  // 4. Submit Stock Out
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      Notification.error("Please select a product.");
      return;
    }

    const lines = warehouses
      .map((w) => ({
        warehouseId: w.warehouse_id,
        quantity: Number(w.quantityOut || 0),
        available: Number(w.available_quantity || 0),
      }))
      .filter((l) => l.quantity > 0);

    if (lines.length === 0) {
      Notification.error("Please enter a quantity to out for at least one warehouse.");
      return;
    }

    const invalidLine = lines.find((l) => l.quantity > l.available);
    if (invalidLine) {
      Notification.error("One of the warehouse quantities exceeds the available stock. Please adjust and try again.");
      return;
    }

    const payload = {
      productId: selectedProductId,
      transactionDate: transactionDate || new Date().toISOString().slice(0, 10),
      reference_no: referenceNo || undefined,
      remarks: remarks || undefined,
      lines: lines.map((l) => ({
        warehouseId: l.warehouseId,
        quantity: l.quantity,
      })),
    };

    setSubmitting(true);
    try {
      const res = await API.private.createStockOut(payload);
      if (res.data.code === "OK") {
        Notification.success("Stock out recorded successfully.");

        // Refresh warehouses to show updated quantities
        await fetchWarehousesForProduct(selectedProductId);

        // Reset per-call fields
        setReferenceNo("");
        setRemarks("");
      } else {
        Notification.error(res.data.error || "Failed to record stock out.");
      }
    } catch (err) {
      Notification.error("Error while recording stock out.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // Render
  // ==========================

  return (
    <DefaultLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Stock Out</h2>
          <p className="text-sm text-gray-500 max-w-md">
            Record stock leaving the system by selecting a product, choosing the warehouses, and entering the quantities
            and date.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product + Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Select */}
            <div>
              {productsLoading ? (
                <div className="flex items-center h-10">
                  <Spinner />
                </div>
              ) : (
                <Select
                  label="Product"
                  value={selectedProductId}
                  onChange={handleProductChange}
                  options={productOptions}
                  placeholder="Select a product..."
                  isClearable
                />
              )}
            </div>

            {/* Date */}
            <TextInput
              label="Transaction Date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>

          {/* Reference + Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Reference No (optional)"
              placeholder="Invoice / GRN / Note ref"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
            />
            <TextInput
              label="Remarks (optional)"
              placeholder="Any notes about this stock out"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Warehouses + Quantities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Warehouses &amp; Quantities</h3>
              <span className="text-xs text-gray-500">
                Total quantity out: <span className="font-semibold">{totalQuantityOut}</span>
              </span>
            </div>

            {!selectedProductId && (
              <p className="text-xs text-gray-500">Select a product above to see its warehouses and available stock.</p>
            )}

            {selectedProductId && warehousesLoading && (
              <div className="flex justify-center items-center h-20">
                <Spinner />
              </div>
            )}

            {selectedProductId && !warehousesLoading && warehouses.length === 0 && (
              <p className="text-xs text-red-500">No stock records found for this product in any warehouse.</p>
            )}

            {selectedProductId && !warehousesLoading && warehouses.length > 0 && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Warehouse</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Location</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">Available</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">Quantity Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouses.map((w) => {
                      const available = Number(w.available_quantity || 0);
                      const outQty = Number(w.quantityOut || 0);
                      const exceeds = outQty > available;

                      return (
                        <tr key={w.warehouse_id} className="border-t border-gray-100 align-top">
                          <td className="px-4 py-2 text-gray-800">{w.warehouse_name}</td>
                          <td className="px-4 py-2 text-gray-500">
                            {w.location || <span className="italic text-gray-400">N/A</span>}
                          </td>
                          <td className="px-4 py-2 text-right text-gray-800">{available}</td>
                          <td className="px-4 py-2 text-right">
                            <TextInput
                              type="number"
                              placeholder="0"
                              value={w.quantityOut}
                              onChange={(e) => handleQuantityChange(w.warehouse_id, e.target.value)}
                              className="w-24 text-right"
                              error={exceeds ? "Exceeds available stock" : undefined}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <AccentButton
              text={submitting ? "Processing..." : "Record Stock Out"}
              onClick={handleSubmit}
              disabled={submitting}
            />
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default StockOut;
