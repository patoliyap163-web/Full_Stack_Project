// API service functions

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