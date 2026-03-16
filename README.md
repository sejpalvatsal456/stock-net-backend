# Stock-Net Backend 📦

A robust API backend for an Inventory Management and ERP system. Built with modern Node.js (ES Modules), Express, and MongoDB.

## Features ✨
- **Role-Based Authentication**: Secure JWT flow with Manager and Staff permissions.
- **Master Data Management**: Handle Categories, Products, Warehouses, and precise internal Locations.
- **Advanced Inventory Logic**: Draft & Validation workflow to enforce precision tracking and block overdrawing.
- **Movement Ledger**: Immutable history tracking of stock entering, moving, and leaving facilities.
- **Dashboard Analytics**: Aggregated KPIs and alerts for live reporting.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js 
- **Database**: MongoDB with Mongoose ODM
- **Module System**: Standard ES Modules (`type: "module"`)
- **Security**: `bcrypt` (password hashing), `jsonwebtoken` (Auth)
- **Logging**: `winston` and `morgan` for production-grade request & error logging.

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally
- A MongoDB cluster (Atlas or local). Make sure your IP is whitelisted in Atlas!

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd stock-net-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Setup:
   Create a `.env` file in the root directory and configure it:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_NAME=stock-net-db
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
4. Start the server (uses nodemon for hot-reloading):
   ```bash
   npm start
   ```

## 🏗 Project Architecture

The codebase strictly follows a clean MVC (Models-Routes-Controllers) pattern.

```text
src/
├── config/        # Database initialization connections
├── controllers/   # Core business logic / calculations
├── middleware/    # Auth guards (protect, manager), Error handling
├── models/        # Mongoose DB schema definitions
├── routes/        # Express route aggregators 
├── utils/         # Global utilities (Winston logger config)
└── index.js       # Main application entry point
```

## 🧠 Core Business Logic (Crucial for Frontend/QA)

To ensure database integrity, this application uses a mandatory **Two-Step "Draft -> Validation"** workflow for all major inventory operations (Receipts, Deliveries, Transfers, Adjustments).

1. **Drafting**: Hitting a `POST` route (like `POST /api/receipts`) creates a temporary document, but **it does not affect your actual stock counts**.
2. **Validating**: To finalize the transaction and update the numbers, you must hit the validation endpoint (e.g., `POST /api/receipts/:id/validate`). 
   - Operations that fail business rules (e.g., trying to deliver 200 units when you only have 100 in stock) will automatically be blocked at the validation layer and throw a `400 Bad Request`.
   - Successful validations cascade to update `Stock` tables and add records to the `Movements` history logic.

*Note: You cannot store items in a `Warehouse` generally. Items are technically stored in a `Location` (Aisle 1, Shelf B) which belongs to that Warehouse.*

## 🔐 Authentication & Authorization

The API is secured using **JSON Web Tokens (JWT)**. 

### Roles
- **Manager**: Has full access, including creating users, validating major stock movements, and managing master data.
- **Staff**: Has read-only access to most endpoints and can draft receipts/deliveries, but may be restricted from validating or modifying core configurations.

### How it works
1. **Register/Login**: Users authenticate via `POST /api/auth/login`.
2. **Token**: The server returns a JWT token.
3. **Protected Routes**: To access secured endpoints, include the token in the request header:
   `Authorization: Bearer <token>`
4. **Middleware**: The `protect` middleware ensures the user is logged in, while the `manager` middleware restricts sensitive operations to managers.

## 🎛 Controllers & API Endpoints

The system is broken down into 13 core controllers. Most follow standard RESTful CRUD patterns, with the exception of the transaction endpoints which require the Draft/Validate sequence.

### 1. Identity & Auth (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate and receive a JWT

### 2. Master Data
- **Categories** (`/api/categories`): `GET`, `POST`, `PUT`, `DELETE` (Manage product groupings)
- **Products** (`/api/products`): `GET`, `POST`, `PUT`, `DELETE` (Manage the item catalog)
- **Warehouses** (`/api/warehouses`): `GET`, `POST`, `PUT`, `DELETE` (Physical facilities)
- **Locations** (`/api/locations`): `GET`, `POST`, `PUT`, `DELETE` (Specific aisles/shelves within a warehouse)

### 3. Inventory Transactions (Draft -> Validate)
- **Receipts (Incoming)** (`/api/receipts`)
  - `POST /` - Draft a new receipt
  - `POST /:id/validate` - Validate receipt, increase stock
- **Deliveries (Outgoing)** (`/api/deliveries`)
  - `POST /` - Draft a new delivery
  - `POST /:id/validate` - Validate delivery, decrease stock
- **Transfers (Internal)** (`/api/transfers`)
  - `POST /` - Draft a transfer between locations
  - `POST /:id/validate` - Validate transfer, move stock
- **Adjustments (Corrections)** (`/api/adjustments`)
  - `POST /` - Draft a stock adjustment for losses/extras
  - `POST /:id/validate` - Validate adjustment

### 4. Tracking & Analytics
- **Stock/Inventory** (`/api/inventory` or `/api/stock`): `GET` (View current, real-time stock levels across locations)
- **Movements** (`/api/movements`): `GET` (Read-only ledger of all historical stock changes)
- **Dashboard** (`/api/dashboard`): `GET /kpis` (Aggregated statistics for frontend charts)

## 🧪 Testing the API

For testing the application, you can use Postman, Insomnia or VS Code's "REST Client" extension to establish testing requests matching the core endpoints described above.

### Test Workflow Example
1. Create a Location and a Product.
2. Draft a Receipt (`POST /api/receipts`) targeting that Location.
3. Observe Inventory (`GET /api/inventory`) - *notice stock hasn't changed*.
4. Validate the Receipt (`POST /api/receipts/:id/validate`).
5. Observe Inventory again - *stock is updated!*