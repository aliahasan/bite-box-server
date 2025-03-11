# 🛠 Bite-Box - Backend Overview

## 🚀 Introduction

The backend of **Bite-Box** is built using **TypeScript, Express.js, and Mongoose**, following a **modular architecture** to ensure scalability, maintainability, and security. It supports **role-based authentication**, transaction management with **MongoDB rollback**, and **aggregation pipelines** for optimized queries.

Key Features:

- **JWT Authentication** with secure session handling.
- **Role-Based Access Control (RBAC)** for customers and meal providers.
- **MongoDB Transactions & Rollback** for data consistency.
- **Aggregation Pipelines** for optimized query performance.
- **Image Uploads to Cloudinary** for meal and profile pictures.
- **Efficient and Modular Code Structure** for easy expansion.
- **SSLCommerz Payment Integration** for meal orders.
- **Order Tracking & Analytics** for both users and meal providers.

---

## 🏗 Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Storage:** Cloudinary (for image uploads)
- **Payment Gateway:** SSLCommerz
- **Architecture:** Modular with controllers, services, and middlewares
- **Error Handling:** Centralized error management
- **Logging:** Winston for structured logs

---

## 🔑 Authentication & Authorization

The application uses **JWT-based authentication** with **bcrypt** for password hashing.  
Users are categorized into **customers and meal providers**, and access control is enforced using **RBAC**.

### 🔐 User Authentication Flow:

1. **Registration** (`POST /api/auth/register`)

   - Hashes password using bcrypt before storing.
   - Assigns role (`customer` or `mealProvider`).

2. **Login** (`POST /api/auth/login`)

   - Verifies user credentials.
   - Generates and returns a JWT token.

3. **Protected Routes**

   - Uses a **JWT middleware** to restrict access.
   - Example:
     - Customers can only access `/api/customers/orders`.
     - Meal providers can only access `/api/providers/menu`.

4. **Role-Based Middleware**
   - Ensures users can only access authorized resources.

---

## 🛒 Meal Ordering & Payments

- Users can **browse meal plans**, **add meals to cart**, and **place orders**.
- SSLCommerz is integrated to **handle secure online payments**.
- Payment success triggers **order confirmation & status update**.

### 📝 Order Workflow:

1. **Customer selects meals & customizes order.**
2. **Payment processing through SSLCommerz.**
3. **Order status updated (`pending` → `in progress` → `delivered`).**
4. **Meal provider receives order details & prepares meals.**
5. **Customer can track order status.**

---

## 🗄 Database & Models (MongoDB with Mongoose)
