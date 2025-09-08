let logoutTimerId = null;

const TOKEN_KEY = "xpower.token";
const USER_KEY = "xpower.user";
const EXPIRES_AT_KEY = "xpower.expiresAt";

const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const setAuthToken = (authToken, expiresAtMs = null) => {
  localStorage.setItem(TOKEN_KEY, authToken);
  if (expiresAtMs) {
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAtMs));
  } else {
    localStorage.removeItem(EXPIRES_AT_KEY);
  }
};

const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
};

const getUserData = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

const setUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

const isAuthenticated = () => !!getAuthToken();

/* ---------- JWT helpers ---------- */
const base64UrlDecode = (str) => {
  try {
    const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getJwtPayload = (tok) => {
  if (!tok) return null;
  const parts = tok.split(".");
  if (parts.length !== 3) return null;
  return base64UrlDecode(parts[1]);
};

const getTokenExpiryMs = () => {
  const tok = getAuthToken();
  const payload = getJwtPayload(tok);
  if (payload && typeof payload.exp === "number") {
    return payload.exp * 1000; // seconds -> ms
  }
  const stored = localStorage.getItem(EXPIRES_AT_KEY);
  return stored ? Number(stored) : null;
};

const isTokenExpired = () => {
  const tok = getAuthToken();
  if (!tok) return false;
  const expMs = getTokenExpiryMs();
  if (!expMs) return false;
  return expMs <= Date.now() + 5000;
};

const getTokenRemainingMs = () => {
  const expMs = getTokenExpiryMs();
  if (!expMs) return null;
  const rem = expMs - Date.now();
  return rem < 0 ? 0 : rem;
};

/* ---------- Auto logout scheduling ---------- */
const clearLogoutTimer = () => {
  if (logoutTimerId) {
    clearTimeout(logoutTimerId);
    logoutTimerId = null;
  }
};

const scheduleAutoLogout = (onLogout) => {
  clearLogoutTimer();
  if (!isAuthenticated()) return null;

  const remaining = getTokenRemainingMs();
  if (remaining === null) return null;
  if (remaining <= 0) {
    onLogout?.();
    return null;
  }
  logoutTimerId = setTimeout(() => onLogout?.(), remaining);
  return logoutTimerId;
};

const initAuthGuard = (onLogout, onLogin) => {
  if (isAuthenticated()) {
    if (isTokenExpired()) {
      onLogout?.();
    } else {
      scheduleAutoLogout(onLogout);
    }
  }

  window.addEventListener("storage", (e) => {
    if (e.key === TOKEN_KEY) {
      if (!e.newValue) {
        clearLogoutTimer();
        onLogout?.();
      } else {
        scheduleAutoLogout(onLogout);
        onLogin?.();
      }
    }
  });
};

const logout = (redirectTo = "/login") => {
  clearLogoutTimer();
  removeAuthToken();
  removeUserData();
  window.location.replace(redirectTo);
};

const token = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,

  getUserData,
  setUserData,
  removeUserData,

  isAuthenticated,

  // new exports
  getJwtPayload,
  isTokenExpired,
  getTokenRemainingMs,
  scheduleAutoLogout,
  initAuthGuard,
  logout,
};

export default token;
