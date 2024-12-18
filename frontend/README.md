# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## **Project Setup Guide**

### **1. Overview**
Dự án sử dụng **React** cho Frontend và **Spring Boot** cho Backend.

---

### **2. Requirements**

- **Node.js** (>= 14.x) và **npm** (>= 6.x)
- **Java Development Kit** (JDK 17 hoặc mới hơn)
- **Maven** hoặc **Gradle** để build Backend.
- **IDE**:
   - Visual Studio Code (Frontend)
   - IntelliJ IDEA hoặc Eclipse (Backend)

---

### **3. Frontend Setup**

#### **3.1. Dependencies**

Các thư viện chính được sử dụng trong Frontend:
- **react-router-dom**: Quản lý routing.
- **react-bootstrap**: Giao diện Bootstrap.
- **Material UI**: Thư viện UI component.
- **react-icons**: Bộ biểu tượng.
- **react-select**: Dropdown tùy chỉnh.
- **axios**: Gọi API.
- **xlsx**, **exceljs**: Xử lý tệp Excel.
- **papaparse**: Đọc và xử lý tệp CSV.
- **file-saver**: Lưu tệp từ trình duyệt.
- **styled-components**: CSS-in-JS.
- **notyf**: Hiển thị thông báo dạng toast.
- **date-fns**: Xử lý định dạng thời gian.
- **eslint**: Linting mã nguồn.
- **vite**: Công cụ build nhanh cho React.

#### **3.2. Installation và Run**

1. **Clone dự án**:
   ```bash
   git clone <repository-link>
   cd frontend
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Chạy ứng dụng**:
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại `http://localhost:3000`.

4. **Build Production**:
   ```bash
   npm run build
   ```

---

### **4. Backend Setup**

#### **4.1. Dependencies**

Backend sử dụng **Spring Boot** và các thư viện mở rộng:

| **Spring Boot**               | **External Libraries**            |
|-------------------------------|----------------------------------|
| Spring Data JPA               | ModelMapper                      |
| Spring Boot DevTools          | Lombok                           |
| Spring Web                    | JSON Web Token (JWT)             |
| Spring Security               | Spring Filter                    |
| Spring Boot Starter Validation|                                  |

#### **4.2. Installation và Run**

1. **Clone dự án**:
   ```bash
   git clone <repository-link>
   cd backend
   ```

2. **Build và chạy Backend**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

3. **API Server** sẽ chạy tại `http://localhost:8080`.

---

### **5. Environment Variables**

Tạo file `.env` cho Frontend:

```env
VITE_API_URL=http://localhost:8080/api
```

---

### **6. Project Structure**

```plaintext
Project
├── frontend/             # React Application
│   ├── src/              # Source code
│   ├── public/           # Static files
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
└── backend/              # Spring Boot Application
    ├── src/main/         # Source code
    ├── pom.xml           # Backend dependencies
    └── application.yml   # Backend configuration
```

---

### **7. Run Full Project**

1. **Chạy Backend** trước.
2. **Chạy Frontend** và kết nối API tại `VITE_API_URL`.

---

### **8. References**

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/)
- [Material UI Documentation](https://mui.com/)
- [Axios Documentation](https://axios-http.com/)
- [JWT Guide](https://jwt.io/)

---
