# 🛒 Multi-Vendor E-commerce API

A powerful backend RESTful API built with **Node.js**, **Express**, and **MongoDB** that supports multi-role access (Admin, Vendor, Customer) and features like filtering, sorting, pagination, aggregation, field limiting, authentication, authorization, and more.

---

## 🚀 Features

- ✅ JWT Authentication & Role-Based Authorization
- ✅ Vendor Shop & Product Management
- ✅ Order Placement & Management
- ✅ Product Filtering, Sorting, Pagination, Field Limiting
- ✅ MongoDB Aggregations (Analytics & Reports)
- ✅ Image Upload Support (Cloudinary or local)
- ✅ Review & Ratings System
- ✅ Advanced Error Handling & Validation
- ✅ Middleware for Protection, Logging, Rate-Limiting


---

## 🔧 Technologies Used

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for Authentication
- **Bcrypt** for Password Hashing
- **Multer** / **Cloudinary** for Image Uploads
- **Helmet**, **CORS**, **Rate Limiting** for Security
- **Joi** or **express-validator** for Validations

---

## 📌 API Endpoints

### 🔐 Auth (`/api/v1/auth`)
| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| POST   | `/register`    | User registration   |
| POST   | `/login`       | User login          |
| GET    | `/me`          | Get current user    |

---

### 👤 Users (`/api/v1/users`)
| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| GET    | `/`             | Get all users       |
| PATCH  | `/:id/role`     | Update user role    |

---

### 🏪 Shops (`/api/v1/shops`)
| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| POST   | `/`           | Create shop           |
| GET    | `/`           | Get all shops         |

---

### 📦 Products (`/api/v1/products`)
| Method | Endpoint      | Description                           |
|--------|---------------|---------------------------------------|
| POST   | `/`           | Create product                        |
| GET    | `/`           | Get products (with filter/sort/etc)   |
| GET    | `/:id`        | Get single product                    |

---

### 🛒 Orders (`/api/v1/orders`)
| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| POST   | `/`           | Place an order        |
| GET    | `/`           | Get my orders         |
| GET    | `/vendor`     | Get vendor orders     |

---

### ⭐ Reviews (`/api/v1/reviews`)
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| POST   | `/product/:id`          | Review a product      |
| GET    | `/product/:id`          | Get all reviews       |

---

### 📊 Admin (`/api/v1/admin`)
| Method | Endpoint          | Description                |
|--------|-------------------|----------------------------|
| GET    | `/dashboard/stats`| Get global analytics       |
| GET    | `/top-products`   | Get top selling products   |

---

## 📈 Filtering & Pagination Example

```http
GET /api/v1/products?category=electronics&price[lt]=1000&sort=price&limit=5&page=2&fields=name,price


