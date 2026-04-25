# UniEvent: Kolhapur District Event Management System

![UniEvent Banner](https://img.shields.io/badge/Project-UniEvent-blue?style=for-the-badge&logo=spring)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?style=flat-square&logo=springboot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql)
![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)

## 📌 Overview
**UniEvent** is a centralized inter-college event management platform specifically designed for institutions in the **Kolhapur District** affiliated with **Shivaji University**. The portal bridges the gap between various institutions (like KIT, DYP, DOT, etc.) by providing a unified space to discover, register, and manage cultural, sports, and technical events.

Built with **Spring Boot** and **PostgreSQL**, it offers a robust solution for tracking registrations, managing student coordinators, and showcasing event highlights through a modern web interface.

---

## 🚀 Key Features

### 🔹 For Students
- **Event Discovery:** Browse all upcoming events across Kolhapur district colleges.
- **Easy Registration:** One-click registration for events with dynamic form fields.
- **Event Feed:** View post-event highlights, photos, and like your favorite moments.
- **Email Notifications:** Receive instant confirmation emails upon registration.

### 🔹 For Coordinators & Admins
- **Dynamic Event Creation:** Enable or disable registration fields (Name, Phone, Payment, etc.) based on event requirements.
- **QR Code Integration:** Automated QR code generation for events and tracking.
- **Excel Export:** Download complete registration lists in `.xlsx` format for offline management (via Apache POI).
- **AfterPost Management:** Upload event photos and highlights to the public feed post-event.
- **Role-Based Access Control:** Secure JWT-based authentication ensuring data privacy and proper authorization.

---

## 🛠️ Tech Stack
- **Backend:** Java 17, Spring Boot 3.3.5
- **Security:** Spring Security & JSON Web Tokens (JWT)
- **Database:** PostgreSQL
- **Persistence:** Spring Data JPA (Hibernate)
- **Email Service:** Spring Boot Starter Mail (Gmail SMTP)
- **Reporting:** Apache POI (Excel Generation)
- **Frontend:** Thymeleaf, CSS, JavaScript
- **Build Tool:** Maven

---

## 📂 Project Structure
```bash
eventportal/
├── src/main/java/com/mohini/eventportal/
│   ├── config/            # Security & JWT configurations
│   ├── controller/        # REST & Web controllers
│   ├── model/             # JPA Entities (Event, User, Registration, etc.)
│   ├── repository/        # Data access layer
│   └── service/           # Business logic layer
├── src/main/resources/
│   ├── static/            # CSS, JS, and Images
│   ├── templates/         # Thymeleaf HTML views
│   └── application.properties # Core configurations
├── SQL FILE PROJECT.sql   # Database schema & initial setups
├── uploads/               # Local storage for QR codes & photos
└── pom.xml                # Maven dependencies
```

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites
- **JDK 17** or higher
- **PostgreSQL** installed and running
- **Maven**

### 2️⃣ Database Setup
1. Create a database named `eventportal` in PostgreSQL.
2. Update the `src/main/resources/application.properties` file:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/eventportal
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 3️⃣ Email Configuration (Optional)
To enable email notifications, update the SMTP settings:
```properties
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### 4️⃣ Run the Application
```bash
mvn clean install
mvn touch spring-boot:run
```
Access the application at `http://localhost:8081`.

---

## 📊 Database Schema
The system uses the following core tables:
- **`users`**: Manages Auth & Profile (Admin, Coordinator, Student).
- **`event`**: Stores event metadata, dynamic requirements, and QR paths.
- **`registration`**: Links users to events with participation details.
- **`afterpost`**: Stores post-event highlights, photos, and engagement (likes).

---

## 🤝 Contributing
Contributions are welcome! If you find any bugs or have feature suggestions, please open an issue or submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

