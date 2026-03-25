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

// Function to apply for a scholarship
// export const applyForScholarship = async (scholarshipId, description) => {
//   try {
//     const response = await fetch('/api/scholarships/apply', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ scholarshipId, description }),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Error applying for scholarship:', error);
//     throw error;
//   }
// };

// Function to express interest in financial aid
// export const expressInterestInAid = async (aidId, description) => {
//   try {
//     const response = await fetch('/api/financial-aid/interest', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ aidId, description }),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Error expressing interest in aid:', error);
//     throw error;
//   }
// };
