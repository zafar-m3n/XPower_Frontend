import React, { useEffect, useState, useRef } from "react";
import Table from "@/components/ui/Table";
import Spinner from "@/components/ui/Spinner";
import Notification from "@/components/ui/Notification";
import API from "@/services/index";
import AccentButton from "@/components/ui/AccentButton";

const reportConfig = {
  "low-stock": {
    title: "Low Stock Report",
    api: API.private.getLowStockReport,
    columns: [
      { key: "name", label: "Product Name" },
      { key: "code", label: "Code" },
      { key: "brand", label: "Brand" },
      { key: "cost", label: "Cost" },
      { key: "total_quantity", label: "Qty" },
    ],
    dataKey: "low_stock",
  },
  "out-of-stock": {
    title: "Out of Stock Report",
    api: API.private.getOutOfStockReport,
    columns: [
      { key: "name", label: "Product Name" },
      { key: "code", label: "Code" },
      { key: "brand", label: "Brand" },
      { key: "cost", label: "Cost" },
    ],
    dataKey: "out_of_stock",
  },
  "stock-by-warehouse": {
    title: "Stock by Warehouse",
    api: API.private.getStockByWarehouseReport,
    columns: [
      { key: "warehouse_name", label: "Warehouse" },
      { key: "location", label: "Location" },
      { key: "total_quantity", label: "Total Qty" },
    ],
    dataKey: "stock_by_warehouse",
  },
};

const ReportTable = ({ reportKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef();

  const config = reportConfig[reportKey];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await config.api();
      if (res.data.code === "OK") {
        setData(res.data.data[config.dataKey] || []);
      } else {
        Notification.error("Failed to fetch report.");
      }
    } catch (err) {
      Notification.error("Error loading report.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const response = await API.private.downloadReportPDF(reportKey);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.title}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      Notification.error("Failed to download PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    if (reportKey) fetchData();
  }, [reportKey]);

  if (!reportKey) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{config.title}</h2>
        <div className="w-fit">
          <AccentButton
            onClick={downloadPDF}
            loading={isGeneratingPDF}
            disabled={data.length === 0}
            text="Download PDF"
            spinner={<Spinner color="white" size="sm" />}
          />
        </div>
      </div>

      <div ref={printRef}>
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Table columns={config.columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default ReportTable;
