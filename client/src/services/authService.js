import api from "../api/axios";

// ==========================================
// REGISTER
// ==========================================

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (userData) => {
  const response = await api.post(
    "/auth/login",
    userData
  );

  return response.data;
};


// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};