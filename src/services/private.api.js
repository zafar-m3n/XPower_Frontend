import instance from "@/lib/axios";

/* ========================== */
/* User: Auth Functions       */
/* ========================== */

const registerUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/register", data, {
    headers: instance.publicHeaders(),
  });
};

const loginUser = async (data) => {
  return await instance.apiClient.post("/api/v1/auth/login", data, {
    headers: instance.publicHeaders(),
  });
};

/* ========================== */
/* Product Functions          */
/* ========================== */

const fetchAllProducts = async (page = 1, limit = 10, search = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search.trim() !== "") {
    params.append("search", search.trim());
  }

  return await instance.apiClient.get(`/api/v1/products?${params.toString()}`, {
    headers: instance.defaultHeaders(),
  });
};

const fetchProductDetails = async (id) => {
  return await instance.apiClient.get(`/api/v1/products/${id}`, {
    headers: instance.defaultHeaders(),
  });
};

const uploadProductsExcel = async (formData) => {
  return await instance.apiClient.post("/api/v1/products/upload", formData, {
    headers: {
      ...instance.defaultHeaders("multipart/form-data"),
    },
  });
};

/* ========================== */
/* Report & Dashboard         */
/* ========================== */

const getDashboardStats = async () => {
  return await instance.apiClient.get("/api/v1/reports/dashboard", {
    headers: instance.defaultHeaders(),
  });
};

const getLowStockReport = async () => {
  return await instance.apiClient.get("/api/v1/reports/low-stock", {
    headers: instance.defaultHeaders(),
  });
};

const getStockByWarehouseReport = async () => {
  return await instance.apiClient.get("/api/v1/reports/stock-by-warehouse", {
    headers: instance.defaultHeaders(),
  });
};

const getOutOfStockReport = async () => {
  return await instance.apiClient.get("/api/v1/reports/out-of-stock", {
    headers: instance.defaultHeaders(),
  });
};

const downloadReportPDF = async (type) => {
  return await instance.apiClient.get(`/api/v1/reports/pdf/${type}`, {
    headers: instance.defaultHeaders(),
    responseType: "blob",
  });
};

/* ========================== */
/* Export API                 */
/* ========================== */

const privateAPI = {
  // Auth
  registerUser,
  loginUser,

  // Products
  fetchAllProducts,
  fetchProductDetails,
  uploadProductsExcel,

  // Reports
  getDashboardStats,
  getLowStockReport,
  getStockByWarehouseReport,
  getOutOfStockReport,
  downloadReportPDF,
};

export default privateAPI;
