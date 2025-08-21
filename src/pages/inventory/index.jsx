import React from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import CategoryList from "./components/CategoryList";
import WarehouseList from "./components/WarehousesList";

const Inventory = () => {
  return (
    <DefaultLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Setup</h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories section */}
          <div className="p-4 bg-white rounded-xl shadow">
            <CategoryList />
          </div>

          {/* Warehouses section */}
          <div className="p-4 bg-white rounded-xl shadow">
            <WarehouseList />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Inventory;
