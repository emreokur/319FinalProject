# E-Commerce Web Application

A full-stack e-commerce application with a React frontend and a planned backend API.

## Implemented Features

### Frontend Components

#### Done By Ahmet Okur:

- **HomePage**: Main landing page showcasing featured products and categories.
- **AuthPage**: User authentication with login and registration functionality.
- **ProductsPage**: Displays all available products with filtering and sorting options.
- **ProductDetail**: Detailed view of individual products with specifications and purchase options.
- **NotFoundPage**: Custom 404 page for handling non-existent routes.

### Frontend Technical Implementation

- React with React Router for client-side routing
- Tailwind CSS for styling and responsive design
- Component-based architecture for maintainability
- React hooks for state management (useState, useEffect)
- Responsive design for mobile and desktop views

## Mock API Plans

The application currently uses mock data but is designed to connect to a RESTful API. The planned backend will:

- Provide authentication endpoints with JWT for secure user sessions
- Expose product data with filtering and search capabilities
- Handle order processing and payment integration
- Manage user data and preferences
- Support admin operations for inventory management

## Request Structures (Planned)

### Authentication

```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

### Products

```
GET /api/products
Query parameters:
  - category: string
  - search: string
  - sort: string (price-asc, price-desc, newest)
  - page: number
  - limit: number

Response:
{
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description",
      "images": ["url1", "url2"],
      "category": "Category",
      "inStock": true
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

