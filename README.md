# Vuba Vuba Clone Microservices Architecture Documentation

## Table of Contents

1. **Overview**
2. **High-Level Architecture**
3. **Microservices & Responsibilities**
4. **Database Design (Tables & Fields)**
5. **Service Communication**
6. **Order & Notification Flow**
7. **Events & Listeners (per Service)**
8. **Project Structure**
9. **Extensibility & Best Practices**
10. **Enums**

---

## 1. Overview

This document describes the architecture for a food delivery platform (Vuba Vuba clone) using Node.js, Express, and microservices. The system enables users to order food, merchants to manage menus, riders to deliver, and admins to oversee operations—all with secure authentication, payment integration, and notifications.

---

## 2. High-Level Architecture

* **API Gateway:** Central entry point, JWT validation, request routing.
* **Auth Service:** User authentication, authorization, role management.
* **Merchant Service:** Merchant/restaurant management, menu CRUD.
* **Order Service:** Order processing, status tracking, order items, order history.
* **Payment Service:** Integration with KPAY for payments.
* **Rider Service:** Rider management and delivery assignment.
* **Notification Service:** Event-driven notifications (email/SMS/push).
* **Message Broker:** (RabbitMQ/Kafka) for inter-service events.
* **Database:** Each service owns its data/tables (PostgreSQL recommended).

---

## 3. Microservices & Responsibilities

### API Gateway

* Validates JWT tokens and user roles.
* Routes requests to appropriate services.
* Handles global error responses.

### Auth Service

* Registers users (customers, merchants, riders, admins).
* Handles login and JWT issuance.
* Manages user roles and password policies.
* **Admin Features:** View all users, activate/deactivate accounts, change roles, edit user profiles.

### Merchant Service

* Allows merchants to manage their restaurant profiles.
* Supports CRUD for menu items (food, prices, availability).
* Exposes menu browsing endpoints to customers.
* **Admin Features:** View all merchants, activate/deactivate merchants, edit/delete merchants, view all menus.

### Order Service

* Receives order requests from customers.
* Links orders to customers and merchants.
* Tracks order status: pending, ready, assigned, accepted, delivered, canceled.
* Manages order items (food, quantity, total).
* Tracks order history for user visibility.
* **Admin Features:** View all orders, filter/search, update/cancel orders, view order history.

### Payment Service

* Receives payment requests post-order.
* Integrates with payment integration like stripe or flutterwave for transaction processing.
* Updates payment status in order records.
* **Admin Features:** View all payments, refund payments, force status change, view payment history.

### Rider Service

* Manages rider profiles and availability.
* Handles delivery assignments and status (assigned, accepted, delivered).
* **Admin Features:** View all riders, activate/deactivate riders, assign orders to riders, manage delivery assignments.

### Notification Service

* Listens for events (order placed, order ready, delivered, payment success).
* Sends notifications via email, SMS, or push to customers, merchants, riders.
* **Admin Features:** View notification logs, resend notifications, configure templates.

---

## 4. Database Design (Tables & Fields)

### Auth Service

**users**

| Field          | Type      | Description                      |
| -------------- | --------- | -------------------------------- |
| id             | UUID      | Primary key                      |
| name           | String    | Full name                        |
| email          | String    | Unique email                     |
| phone          | String    | Unique phone                     |
| password       | String    | Hashed password                  |
| role           | Enum      | customer, merchant, rider, admin |
| created_at     | Timestamp | Registration date                |
| updated_at     | Timestamp | Last update                      |
| is_active      | Boolean   | Account active/deactivated       |

---

### Merchant Service

**merchants**

| Field          | Type      | Description         |
| -------------- | --------- | ------------------- |
| id             | UUID      | Primary key         |
| user_id        | UUID      | FK to users (owner) |
| business_name  | String    | Restaurant name     |
| address        | String    | Physical address    |
| phone          | String    | Contact number      |
| created_at     | Timestamp | Creation date       |
| is_active      | Boolean   | Merchant active/deactivated |

**menu_items**

| Field        | Type      | Description           |
| ------------ | --------- | --------------------- |
| id           | UUID      | Primary key           |
| merchant_id  | UUID      | FK to merchants       |
| name         | String    | Item name             |
| description  | String    | Item description      |
| price        | Decimal   | Item price            |
| available    | Boolean   | Is item available?    |
| image_url    | String    | Item image (optional) |
| created_at   | Timestamp | Creation date         |
| updated_at   | Timestamp | Last update           |

---

### Order Service

**orders**

| Field             | Type      | Description                                             |
| ----------------- | --------- | ------------------------------------------------------- |
| id                | UUID      | Primary key                                             |
| customer_id       | UUID      | FK to users                                             |
| merchant_id       | UUID      | FK to merchants                                         |
| status            | Enum      | pending, ready, assigned, accepted, delivered, canceled |
| total_price       | Decimal   | Total order price                                       |
| payment_status    | Enum      | pending, paid, failed, refunded                         |
| delivery_address  | String    | Delivery address                                        |
| created_at        | Timestamp | Order creation                                          |
| updated_at        | Timestamp | Last update                                             |

**order_items**

| Field          | Type    | Description             |
| -------------- | ------- | ----------------------- |
| id             | UUID    | Primary key             |
| order_id       | UUID    | FK to orders            |
| menu_item_id   | UUID    | FK to menu_items        |
| quantity       | Integer | Quantity ordered        |
| unit_price     | Decimal | Price per item          |
| total_price    | Decimal | unit_price * quantity   |

**order_history**

| Field      | Type      | Description                 |
| ---------- | --------- | --------------------------- |
| id         | UUID      | Primary key                 |
| order_id   | UUID      | FK to orders                |
| status     | Enum      | order_status (see below)    |
| created_at | Timestamp | Status change timestamp     |

---

### Payment Service

**payments**

| Field           | Type      | Description                       |
| --------------- | --------- | --------------------------------- |
| id              | UUID      | Primary key                       |
| order_id        | UUID      | FK to orders                      |
| method          | Enum      | KPAY, MobileMoney, Card, etc.     |
| status          | Enum      | initiated, paid, failed, refunded |
| transaction_id  | String    | KPAY transaction ID               |
| amount          | Decimal   | Amount paid                       |
| created_at      | Timestamp | Payment timestamp                 |
| updated_at      | Timestamp | Last update                       |

---

### Rider Service

**riders**

| Field         | Type      | Description        |
| ------------- | --------- | ------------------ |
| id            | UUID      | Primary key        |
| user_id       | UUID      | FK to users        |
| vehicle_type  | Enum      | bike, scooter, car |
| is_available  | Boolean   | Rider availability |
| created_at    | Timestamp | Registration date  |
| updated_at    | Timestamp | Last update        |
| is_active     | Boolean   | Rider active/deactivated |

**delivery_assignments**

| Field         | Type      | Description                   |
| ------------- | --------- | ----------------------------- |
| id            | UUID      | Primary key                   |
| order_id      | UUID      | FK to orders                  |
| rider_id      | UUID      | FK to riders                  |
| assigned_by   | UUID      | Admin user ID                 |
| status        | Enum      | assigned, accepted, delivered |
| assigned_at   | Timestamp | Assignment date               |
| accepted_at   | Timestamp | Rider acceptance date         |
| delivered_at  | Timestamp | Delivery date                 |

---

### Notification Service

* **Stateless (no database tables required).**
* Listens to events and sends notifications via external providers (email, SMS, push).
* May optionally log notification events for admin/audit purposes.

---

## 5. Service Communication

* **Synchronous:** HTTP REST via API Gateway (request-response).
* **Asynchronous:** Events via Message Broker (RabbitMQ).

  * E.g., Order placed, payment successful, order ready, delivery assigned.
  * Notification Service subscribes to relevant events.

---

## 6. Order & Notification Flow

1. **User Registration/Login:** Auth Service issues JWT.
2. **Merchant Menu Management:** Merchant Service allows menu CRUD.
3. **Placing an Order:** Customer sends order request via API Gateway to Order Service.
4. **Payment Processing:** Order Service requests Payment Service .
5. **Order Status Update:** Merchant marks order as ready.
6. **Assignment to Rider:** Admin assigns ready order to available rider (via Rider Service).
7. **Delivery Process:** Rider accepts assignment, marks order as delivered.
8. **Order History:** User sees updated order status/history at each step.
9. **Notifications:**
   * Order placed: Notify customer, merchant.
   * Payment success: Notify customer.
   * Order ready: Notify admin, rider.
   * Delivery assigned: Notify rider.
   * Delivered: Notify customer, merchant.

---

## 7. Events & Listeners (per Service)

Below are the main events each service publishes and listens to, along with their typical payloads:

### **Order Service**

* **Publishes:**
  * `order.placed` – `{ orderId, customerId, merchantId, orderItems, totalPrice }`
  * `order.ready` – `{ orderId, merchantId }`
  * `order.canceled` – `{ orderId, customerId, merchantId }`
  * `order.delivered` – `{ orderId, riderId, customerId }`
* **Listens to:**
  * `payment.success` (from Payment Service)
  * `payment.failed` (from Payment Service)
  * `assignment.created` (from Rider Service)
  * `delivery.accepted` (from Rider Service)
  * `delivery.delivered` (from Rider Service)

---

### **Merchant Service**

* **Publishes:**
  * `menu.updated` – `{ merchantId, menuItems }`
  * `order.ready` (when a merchant marks an order as ready)
* **Listens to:**
  * `order.placed` (to receive new orders for merchant)
  * `order.canceled` (to update merchant dashboard)

---

### **Payment Service**

* **Publishes:**
  * `payment.success` – `{ paymentId, orderId, amount, customerId }`
  * `payment.failed` – `{ paymentId, orderId, error }`
* **Listens to:**
  * `order.placed` (to initiate payment process)

---

### **Rider Service**

* **Publishes:**
  * `delivery.accepted` – `{ assignmentId, riderId, orderId }`
  * `delivery.delivered` – `{ assignmentId, riderId, orderId }`
* **Listens to:**
  * `assignment.created` (to receive new delivery assignments)
  * `order.ready` (to prepare for delivery)

---

### **Notification Service**

* **Listens to (main events):**
  * `order.placed` (notify customer, merchant)
  * `payment.success` (notify customer)
  * `payment.failed` (notify customer)
  * `order.ready` (notify admin, rider)
  * `assignment.created` (notify rider)
  * `delivery.accepted` (notify customer, merchant)
  * `delivery.delivered` (notify customer, merchant, admin)
  * `order.canceled` (notify customer, merchant)
* **Publishes:**
  * Notifies via email/SMS/push (no events, direct external calls).

---

## 8. Project Structure

```
vubavuba-platform/
├── api-gateway/              # Routing & JWT
├── auth-service/             # User management
├── merchant-service/         # Restaurants & menus
├── order-service/            # Orders & items
├── payment-service/          # Payment integration
├── rider-service/            # Riders & assignments
├── notification-service/     # Event-driven notifications
├── docker-compose.yml        # Service orchestration
├── README.md
```

Each service contains its own:

* `src/controllers/` (request handlers)
* `src/models/` (database schemas)
* `src/routes/` (Express routes)
* `src/services/` (business logic)
* `src/app.js` (entry point)

---

## 9. Extensibility & Best Practices

* **Loose Coupling:** Each service operates independently, communicates via events.
* **Single Responsibility:** Each service has a focused domain (auth, orders, payments, etc).
* **Security:** JWT, role-based access, secure payment integration.
* **Scalability:** Horizontal scaling possible for each microservice.
* **Documentation:** Swagger/OpenAPI docs per service.



