import React, { useState } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import ReportSelector from "./components/ReportSelector";
import ReportTable from "./components/ReportTable";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <DefaultLayout>
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Available Reports</h2>
          <ReportSelector selected={selectedReport} setSelected={setSelectedReport} />
        </div>

        <div className="md:col-span-3">
          <ReportTable reportKey={selectedReport} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Reports;
