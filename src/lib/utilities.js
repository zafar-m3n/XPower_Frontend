const getAuthToken = () => {
  return localStorage.getItem("xpower.token");
};

const setAuthToken = (authToken) => {
  localStorage.setItem("xpower.token", authToken);
};

const removeAuthToken = () => {
  localStorage.removeItem("xpower.token");
};

const getUserData = () => {
  const userData = localStorage.getItem("xpower.user");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

const setUserData = (userData) => {
  localStorage.setItem("xpower.user", JSON.stringify(userData));
};

const removeUserData = () => {
  localStorage.removeItem("xpower.user");
};

const isAuthenticated = () => {
  return !!getAuthToken();
};

const token = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,

  getUserData,
  setUserData,
  removeUserData,

  isAuthenticated,
};

export default token;
