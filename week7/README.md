# JWT Authentication with CRUD Operations

This project demonstrates JWT authentication with protected routes and CRUD operations for products and orders.

## Features

- User registration and login with JWT authentication
- Protected routes in both frontend and backend
- Password hashing with bcrypt
- CRUD operations for products and orders
- User-specific data access

## Project Structure

- **Backend**: Node.js with Express and MongoDB
- **Frontend**: React with Vite

## Setup and Running

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/user` - Get user data (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create order (protected)
- `PUT /api/orders/:id` - Update order (protected)
- `DELETE /api/orders/:id` - Delete order (protected)

## Testing with Postman

1. **Register a User**:
   - Method: POST
   - URL: http://localhost:5000/api/auth/register
   - Headers: Content-Type: application/json
   - Body:
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }
     ```

2. **Login**:
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Headers: Content-Type: application/json
   - Body:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Response will include a JWT token

3. **Create Product (Protected)**:
   - Method: POST
   - URL: http://localhost:5000/api/products
   - Headers: 
     - Content-Type: application/json
     - x-auth-token: [JWT token from login response]
   - Body:
     ```json
     {
       "name": "Test Product",
       "price": 29.99,
       "category": "Electronics",
       "stock": 10
     }
     ```

4. **Get User Data (Protected)**:
   - Method: GET
   - URL: http://localhost:5000/api/auth/user
   - Headers: 
     - x-auth-token: [JWT token from login response]