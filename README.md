🚀 High-Throughput Order Processing System

Node.js • Express • PostgreSQL • Redis • BullMQ • Docker

This project is a high-performance order processing backend built with Node.js and Express.
It focuses on scalability, performance, and reliability, following backend best practices discussed during interviews.

🧱 Tech Stack

Node.js + Express – API layer

PostgreSQL – Primary database

pg (node-postgres) – Raw SQL queries (❌ No ORM)

Redis – Caching, metrics, rate limiting

BullMQ – Background job & queue processing

Docker & Docker Compose – Containerized setup

Zod – Request validation

Bull Board – Queue monitoring UI

⚙️ Project Setup & Run
1️⃣ Start the project
docker compose up -d --build


This will start:

API server

Worker service

PostgreSQL

Redis

🗄️ Database Setup

The project does not use any ORM (as discussed in the interview).

Uses the pg package with raw SQL for full control and performance.

Initial database schema is created using SQL migrations.

Indexes are added via migrations for:

created_at

status

user_id

Search optimization

This approach avoids ORM overhead and gives better performance for heavy queries.

📦 Order Processing Flow

User creates an order

Order is stored in PostgreSQL with status PENDING

Order is pushed to a BullMQ queue

Worker processes the job asynchronously

Order status is updated (COMPLETED / FAILED)

Processing time is calculated using timestamps

📊 Admin Features
🔹 Cursor-based Pagination (Date-based)

Admin order listing uses cursor-based pagination (created_at)

Avoids COUNT(*) on large datasets

More efficient than offset-based pagination for high-volume tables

Reason:
Calculating total orders for admin is a heavy query and does not scale well.

🔹 Filters & Search (Admin Orders)

Admin can filter orders by:

Date range

Order status

Search by:

product_name

amount

user_name

🧠 Caching Strategy (Redis)

Redis is used to cache frequently accessed data

TTL is set to 30 seconds

Cache metrics tracked:

Cache hits

Database hits

Cache hit ratio

This helps reduce database load under high traffic.

🚦 Rate Limiting

Rate limits are applied per user:

POST /orders → 5 requests/min

GET /orders → 30 requests/min

🛠️ Queue Monitoring

BullMQ queues are monitored using Bull Board.

📍 Access Queue Dashboard:

http://localhost:3000/bull_admin/queues

add postman collection also


This allows:

Viewing active jobs

Failed jobs

Retry attempts

Processing time

📦 Common Utilities

✅ Common API response format

✅ Global error handler

✅ Centralized logging

✅ Clean controller-service separation

🔐 Admin Credentials (Demo)
Email:    admin@yopmail.com
Password: Admin@123

🎯 Key Interview Highlights

❌ No ORM (uses pg directly)

✅ Cursor-based pagination for scalability

✅ Redis caching with TTL

✅ Async job processing using BullMQ

✅ Dockerized architecture

✅ Production-ready error handling

✅ Optimized SQL queries with indexes

📌 Future Improvements

Read replicas for PostgreSQL

Cron job to conform add all pending orders

Logger for grafana 

👨‍💻 Author

Chirag Thakar
Backend / Node.js Developer