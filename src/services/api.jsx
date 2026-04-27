// API service functions
import { authService } from "./authService";
import apiCall from "./apiClient";

const API_BASE_URL = "http://localhost:8080";

const parseResponse = async (response, fallbackMessage) => {
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// Function to login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseResponse(response, "Login failed");

    if (data.token) {
      console.log("🔐 Login successful - storing token:", `${data.token.substring(0, 20)}...`);
      authService.setToken(data.token);
      authService.setUser(data.data);
      console.log("✅ Token and user stored in sessionStorage");
    } else {
      console.log("❌ No token received in login response");
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Function to logout user
export const logoutUser = async () => {
  const token = authService.getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};

    if (!response.ok) {
      throw new Error(data?.message || "Logout failed");
    }

    return data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Function to register user
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    return await parseResponse(response, "Registration failed");
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

// Generic API call with JWT interceptor
export const apiRequest = apiCall;

// Function to get all scholarships
export const getScholarships = async () => {
  try {
    return await apiCall("/api/scholarships", {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

// Function to create a scholarship
export const createScholarship = async (scholarshipData) => {
  try {
    return await apiCall("/api/scholarships", {
      method: "POST",
      body: scholarshipData,
    });
  } catch (error) {
    console.error("Error creating scholarship:", error);
    throw error;
  }
};

// Function to update a scholarship
export const updateScholarship = async (id, scholarshipData) => {
  try {
    return await apiCall(`/api/scholarships/${id}`, {
      method: "PUT",
      body: scholarshipData,
    });
  } catch (error) {
    console.error("Error updating scholarship:", error);
    throw error;
  }
};

// Function to delete a scholarship
export const deleteScholarship = async (id) => {
  try {
    return await apiCall(`/api/scholarships/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    throw error;
  }
};

// Function to get scholarships for a specific admin
export const getScholarshipsByAdmin = async (adminId) => {
  try {
    return await apiCall(`/api/scholarships/admin/${adminId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching admin scholarships:", error);
    throw error;
  }
};

// Function to get all financial aid
export const getFinancialAid = async () => {
  try {
    return await apiCall("/api/financial-aid", {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching financial aid:", error);
    throw error;
  }
};

// Function to get financial aid by id
export const getFinancialAidById = async (id) => {
  try {
    return await apiCall(`/api/financial-aid/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching financial aid by id:", error);
    throw error;
  }
};

// Function to create financial aid
export const createFinancialAid = async (financialAidData) => {
  try {
    return await apiCall("/api/financial-aid", {
      method: "POST",
      body: financialAidData,
    });
  } catch (error) {
    console.error("Error creating financial aid:", error);
    throw error;
  }
};

// Function to update financial aid
export const updateFinancialAid = async (id, financialAidData) => {
  try {
    return await apiCall(`/api/financial-aid/${id}`, {
      method: "PUT",
      body: financialAidData,
    });
  } catch (error) {
    console.error("Error updating financial aid:", error);
    throw error;
  }
};

// Function to delete financial aid
export const deleteFinancialAid = async (id) => {
  try {
    return await apiCall(`/api/financial-aid/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting financial aid:", error);
    throw error;
  }
};

// Function to get financial aid for a specific admin
export const getFinancialAidByAdmin = async (adminId) => {
  try {
    return await apiCall(`/api/financial-aid/admin/${adminId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching admin financial aid:", error);
    throw error;
  }
};

// Function to get applications for a specific student
export const getApplicationsByStudent = async (studentId) => {
  try {
    return await apiCall(`/api/application/student/${studentId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching student applications:", error);
    throw error;
  }
};

// Function to get applications for a specific admin
export const getApplicationsByAdmin = async (adminId) => {
  try {
    return await apiCall(`/api/application/admin/${adminId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error fetching admin applications:", error);
    throw error;
  }
};

// Function to create a scholarship application
export const createApplication = async (applicationData) => {
  try {
    return await apiCall("/api/application", {
      method: "POST",
      body: applicationData,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

// Function to update application status
export const updateApplicationStatusById = async (id, status) => {
  try {
    return await apiCall(`/api/application/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

// Function to get student profile by user id
export const getStudentProfileByUserId = async (userId) => {
  try {
    const response = await apiCall(`/student-profile/${userId}`, {
      method: "GET",
    });

    if (response.status === 404 || response.status === 204) {
      return { success: true, data: {} };
    }

    return response;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

// Function to update student profile by user id
export const updateStudentProfileByUserId = async (userId, profileData) => {
  try {
    return await apiCall(`/student-profile/${userId}`, {
      method: "PUT",
      body: profileData,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

// Function to get admin profile by user id
export const getAdminProfileByUserId = async (userId) => {
  try {
    const response = await apiCall(`/admin-profile/${userId}`, {
      method: "GET",
    });

    if (response.status === 404 || response.status === 204) {
      return { success: true, data: {} };
    }

    return response;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

// Function to update admin profile by user id
export const updateAdminProfileByUserId = async (userId, profileData) => {
  try {
    return await apiCall(`/admin-profile/${userId}`, {
      method: "PUT",
      body: profileData,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};
