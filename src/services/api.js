// API service functions

const API_BASE_URL = "http://localhost:8080";

const parseResponse = async (response, fallbackMessage) => {
  const data = await response.json();

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

    return await parseResponse(response, "Login failed");
  } catch (error) {
    console.error("Error logging in:", error);
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

// Function to get all scholarships
export const getScholarships = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scholarships`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch scholarships");
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

// Function to create a scholarship
export const createScholarship = async (scholarshipData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scholarships`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scholarshipData),
    });

    return await parseResponse(response, "Failed to create scholarship");
  } catch (error) {
    console.error("Error creating scholarship:", error);
    throw error;
  }
};

// Function to update a scholarship
export const updateScholarship = async (id, scholarshipData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scholarships/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scholarshipData),
    });

    return await parseResponse(response, "Failed to update scholarship");
  } catch (error) {
    console.error("Error updating scholarship:", error);
    throw error;
  }
};

// Function to delete a scholarship
export const deleteScholarship = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scholarships/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to delete scholarship");
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    throw error;
  }
};

// Function to get scholarships for a specific admin
export const getScholarshipsByAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scholarships/admin/${adminId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch admin scholarships");
  } catch (error) {
    console.error("Error fetching admin scholarships:", error);
    throw error;
  }
};

// Function to get all financial aid
export const getFinancialAid = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch financial aid");
  } catch (error) {
    console.error("Error fetching financial aid:", error);
    throw error;
  }
};

// Function to get financial aid by id
export const getFinancialAidById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch financial aid");
  } catch (error) {
    console.error("Error fetching financial aid by id:", error);
    throw error;
  }
};

// Function to create financial aid
export const createFinancialAid = async (financialAidData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(financialAidData),
    });

    return await parseResponse(response, "Failed to create financial aid");
  } catch (error) {
    console.error("Error creating financial aid:", error);
    throw error;
  }
};

// Function to update financial aid
export const updateFinancialAid = async (id, financialAidData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(financialAidData),
    });

    return await parseResponse(response, "Failed to update financial aid");
  } catch (error) {
    console.error("Error updating financial aid:", error);
    throw error;
  }
};

// Function to delete financial aid
export const deleteFinancialAid = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to delete financial aid");
  } catch (error) {
    console.error("Error deleting financial aid:", error);
    throw error;
  }
};

// Function to get financial aid for a specific admin
export const getFinancialAidByAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/financial-aid/admin/${adminId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch admin financial aid");
  } catch (error) {
    console.error("Error fetching admin financial aid:", error);
    throw error;
  }
};

// Function to get applications for a specific student
export const getApplicationsByStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/application/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await parseResponse(response, "Failed to fetch student applications");
  } catch (error) {
    console.error("Error fetching student applications:", error);
    throw error;
  }
};

// Function to create a scholarship application
export const createApplication = async (applicationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    return await parseResponse(response, "Failed to submit application");
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};
