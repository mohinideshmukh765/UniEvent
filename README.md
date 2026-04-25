# UniEvent: Kolhapur District Event Management System

![UniEvent Banner](https://img.shields.io/badge/Project-UniEvent-blue?style=for-the-badge&logo=spring)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=flat-square&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql)
![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)

## 📌 Overview
**UniEvent** is a centralized inter-college event management platform specifically designed for institutions in the **Kolhapur District** affiliated with **Shivaji University**. The portal bridges the gap between various institutions by providing a unified space to discover, register, and manage cultural, sports, and technical events.

Built with **Spring Boot** and **PostgreSQL**, it offers a robust solution for tracking registrations, managing student coordinators, and showcasing event highlights through a modern web interface.

---

## 🚀 Key Features

### 🔹 For Admins
- **Bulk College Onboarding:** Upload college details via Excel (`.xlsx`) to automatically create coordinator accounts and send credentials via email.
- **College Management:** Activate or deactivate college institutions and monitor their activity.
- **Global Dashboard:** Overview of total colleges, students, and events across the district.

### 🔹 For Coordinators (College Level)
- **Event Management:** Create and publish events with dynamic registration requirements (toggle fields like Name, Email, Phone, etc.).
- **Registration Control:** Review student registrations, approve or reject them with specific reasons.
- **QR Code Support:** Upload manual QR codes for event-specific payments or information.
- **Event Gallery:** Upload and manage up to 10 photos per event to showcase highlights.
- **After-Event Posts:** Create post-event updates with captions and feedback links.
- **Excel Export:** Download registration lists for any event in Excel format for offline tracking.

### 🔹 For Students
- **Event Discovery:** Browse upcoming events organized by various colleges in Kolhapur.
- **Registration Flux:** Register for events individually or in groups, with support for transaction ID and payment screenshot uploads.
- **Personalized Portal:** View status of own registrations and receive notifications for approvals/rejections.
- **Event Feed:** View highlights from past events and like shared moments.

---

## 🛠️ Tech Stack
- **Backend:** Java 17, Spring Boot 3.3.5
- **Security:** Spring Security & JWT (JSON Web Tokens)
- **Database:** PostgreSQL
- **Persistence:** Spring Data JPA (Hibernate)
- **Email Service:** Spring Boot Starter Mail (SMTP)
- **Reporting & Parsing:** Apache POI (Excel)
- **Frontend:** HTML, CSS, JavaScript (Thymeleaf templates)

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites
- **JDK 17** or higher
- **PostgreSQL**
- **Maven**

### 2️⃣ Database Setup
1. Create a database named `eventportal`.
2. Configure settings in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/eventportal
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 3️⃣ Email Configuration
Ensure you have an App Password if using Gmail:
```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### 4️⃣ College Onboarding Format
For bulk upload, use an Excel file with the following headers:
`CollegeCode` | `CollegeName` | `CoordinatorName` | `Email` | `Phone` | `City` | `District`

---

## 📂 Project Structure
```bash
eventportal/
├── src/main/java/com/mohini/eventportal/
│   ├── controller/        # Admin, Coordinator, Student, and Auth APIs
│   ├── service/           # Business logic (Excel, Email processing)
│   ├── model/             # Entities (Event, Post, College, User, Registration)
│   └── repository/        # PostgreSQL data access
├── src/main/resources/
│   ├── static/            # Frontend assets
│   └── templates/         # HTML views
├── SQL FILE PROJECT.sql   # Schema setups
└── uploads/               # Storage for photos, QR codes, and screenshots
```

---

## 🤝 Contributing
1. Fork the Project
2. Create Feature Branch
3. Submit a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
