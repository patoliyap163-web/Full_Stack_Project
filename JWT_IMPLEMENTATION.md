# JWT Authentication Implementation

## Overview
This project now has JWT (JSON Web Token) authentication implemented. All authenticated API requests require a Bearer token in the Authorization header.

## How It Works

### 1. **Authentication Service** (`src/services/authService.jsx`)
Handles token and user data storage in localStorage:
```javascript
import { authService } from "../services/authService";

// Store token after login
authService.setToken(token);
authService.setUser(userData);

// Get token
const token = authService.getToken();

// Get user
const user = authService.getUser();

// Check if authenticated
if (authService.isAuthenticated()) { ... }

// Logout (clears token and user)
authService.logout();
```

### 2. **API Client** (`src/services/apiClient.jsx`)
Automatically adds Bearer token to all requests:
```javascript
import { apiRequest } from "../services/api";

// All requests automatically include: Authorization: Bearer <token>
const response = await apiRequest('/endpoint', {
  method: 'GET'
});

// POST request
const response = await apiRequest('/endpoint', {
  method: 'POST',
  body: { data: 'value' }
});
```

### 3. **Login Flow**
- User submits credentials to `/auth/login`
- Backend returns: `{ token: "JWT_TOKEN", data: {...userData}, message: "..." }`
- Token is automatically saved by `loginUser()` function
- User data and token persist in localStorage

### 4. **Automatic Token Injection**
Every API request includes:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 5. **Logout**
```javascript
import { authService } from "../services/authService";

authService.logout(); // Clears token and user, redirects to home
```

### 6. **Protected Routes**
- `ProtectedRoute` - Checks if user exists before rendering
- `PublicRoute` - Redirects logged-in users to their dashboard

## Usage Examples

### Making API Calls
```javascript
import { apiRequest } from "../services/api";

// GET request
const scholarships = await apiRequest('/scholarships', {
  method: 'GET'
});

// POST request with body
const application = await apiRequest('/applications', {
  method: 'POST',
  body: { scholarshipId: 123 }
});

// PUT request
const updated = await apiRequest('/scholarships/123', {
  method: 'PUT',
  body: { name: 'Updated Name' }
});
```

### Checking Authentication Status
```javascript
import { authService } from "../services/authService";

if (authService.isAuthenticated()) {
  const user = authService.getUser();
  console.log(user.name, user.role);
}
```

### Listening to Auth Changes
```javascript
useEffect(() => {
  const handleAuthChange = () => {
    const user = authService.getUser();
    setUser(user);
  };

  window.addEventListener("userChanged", handleAuthChange);
  return () => window.removeEventListener("userChanged", handleAuthChange);
}, []);
```

## Backend Requirements

The backend API should:

1. **Login endpoint** (`POST /auth/login`)
   - Accept: `{ email, password }`
   - Return: `{ token: "JWT_TOKEN", data: {...user}, message: "...", success: true }`

2. **Expect Bearer Token** in requests
   - All protected endpoints should check: `Authorization: Bearer <token>`
   - Return 401 if token is missing or invalid

3. **On 401 Response**
   - Frontend automatically logs out user
   - Redirects to `/login`

## Components Using JWT

| Component | Usage |
|-----------|-------|
| `Login.jsx` | Stores token after successful login |
| `Navbar.jsx` | Uses `authService.getUser()` for user display |
| `ProtectedRoute.jsx` | Checks authentication before rendering |
| `PublicRoute.jsx` | Redirects if already logged in |
| `api.jsx` | All functions use JWT token |

## Storage Details

**localStorage Keys:**
- `auth_token` - JWT token for authorization
- `user` - User profile data (id, name, email, role)

**Note:** Using localStorage means tokens persist across browser sessions. For additional security, consider:
- Setting token expiration times
- Implementing refresh token mechanism
- Using HTTPOnly cookies (backend-side)

## Example Backend Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

