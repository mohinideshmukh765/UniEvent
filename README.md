<div align="center">

# 🎓 UniEvent: Enterprise Event Management Portal
**A Centralized Inter-College Event Management System for Kolhapur District**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)](https://openjdk.java.net/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Spring Security](https://img.shields.io/badge/Security-JWT%20%7C%20Spring-red?style=for-the-badge&logo=springsecurity)](#)

*Bridging the gap between institutions through a unified, secure, and highly dynamic event management ecosystem.*

</div>

---

## 📌 Executive Summary

**UniEvent** is a robust, full-stack enterprise web application designed to streamline the event coordination process across multiple colleges affiliated with Shivaji University in the Kolhapur District. 

Moving beyond standard CRUD operations, this platform solves real-world administrative bottlenecks by providing **bulk Excel onboarding**, **dynamic registration forms**, **automated email workflows**, and **secure payment integrations**. It features a strictly enforced Role-Based Access Control (RBAC) system for Admins, College Coordinators, and Students.

---

## 🚀 Key Technical Features (The "Wow" Factor)

### 1️⃣ Advanced Data Processing & Automation
- **Bulk Excel Parsing (Apache POI):** Admins can onboard entire colleges instantly by uploading `.xlsx` files. The system parses the data, creates secure coordinator accounts, and handles the automated database persistence.
- **Automated Email Workflows (JavaMailSender):** The platform automatically dispatches customized emails for account credentials, event registration approvals, and rejections.

### 2️⃣ Dynamic & Secure Operations
- **Stateless Authentication (JWT):** Implements robust Spring Security using JSON Web Tokens. Secures all REST endpoints and ensures completely stateless, scalable role-based access.
- **Dynamic Registration Engine:** Coordinators can dynamically toggle required fields (Name, Email, Phone, custom data) per event without requiring database schema changes, demonstrating highly flexible backend design.

### 3️⃣ Complete Event Lifecycle Management
- **Intelligent Payment Verification:** Students can upload payment screenshots and Transaction IDs. Coordinators review these proofs to explicitly approve or reject (with reasons) the registrations.
- **Media Management & QR Support:** Features secure multi-part file uploads for event galleries (up to 10 photos), dynamic QR codes for payments, and post-event highlight feeds.
- **Excel Report Generation:** Coordinators can export filtered lists of registered students directly to Excel for offline event day management.

---


### 🛠️ Technology Stack
*   **Backend Core:** Java 17, Spring Boot 3.3.5
*   **Security:** Spring Security, JWT (JSON Web Tokens), BCrypt Password Hashing
*   **Database & ORM:** PostgreSQL, Spring Data JPA, Hibernate
*   **Integrations:** Apache POI (Excel read/write), Spring Boot Starter Mail (SMTP)
*   **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Fetch API for async requests)

---

## 👥 Role-Based Capabilities

### 🛡️ Administrator Module
*   Upload college directories via Excel for instant system-wide onboarding.
*   Activate, deactivate, and manage institutional access.
*   Access a bird's-eye view analytics dashboard of total colleges, students, and events.

### 👨‍🏫 Coordinator Module (College Level)
*   Create rich events with custom registration parameters and QR codes.
*   Review student applications, verify payment screenshots, and issue approvals/rejections.
*   Publish post-event galleries.

### 🎓 Student Module
*   Discover and filter events hosted by various colleges across the district.
*   Register individually or as a team, uploading proof-of-payment.
*   Track real-time registration status via a personalized dashboard and receive alerts.
*   Engage with a dynamic "Event Feed" showcasing past event highlights.

---

## ⚙️ Local Development Setup

### 1️⃣ Prerequisites
- **JDK 17** or higher
- **PostgreSQL** (Running on default port 5432)
- **Maven** 3.8+

### 2️⃣ Database Initialization
Create a database named `eventportal` in PostgreSQL.
```sql
CREATE DATABASE eventportal;
```

Update your `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eventportal
spring.datasource.username=postgres
spring.datasource.password=your_secure_password
```

### 3️⃣ Email & Storage Configuration
Provide a valid App Password (e.g., Gmail) to enable the automated mailing system.
```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# The system automatically generates an 'uploads' directory in the project root
# for storing QR codes, payment screenshots, and gallery images.
```

### 4️⃣ Build and Run
```bash
mvn clean install
mvn spring-boot:run
```
The application will be available at `http://localhost:8080`.

---

## 📂 Project Structure Snapshot
```text
eventportal/
├── src/main/java/com/mohini/eventportal/
│   ├── config/            # App and CORS configuration
│   ├── security/          # JWT Filters, Auth entry points, Providers
│   ├── controller/        # REST endpoints (Admin, Coordinator, Student, Auth)
│   ├── service/           # Core business logic (Excel, Mail, Auth, Events)
│   ├── model/             # JPA Entities (User, Event, Registration, Post)
│   └── repository/        # Spring Data JPA Interfaces
├── src/main/resources/
│   └── static/            # Frontend Assets (HTML, CSS, JS divided by roles)
└── uploads/               # Dynamic local file storage
```

---

