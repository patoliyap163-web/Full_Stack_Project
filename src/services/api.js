// API service functions

// Function to login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to register user
export const registerUser = async (name, email, password, role) => {
  try {
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering:', error);
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