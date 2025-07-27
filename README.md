# 🏛️ JECRC Grievance Portal

<div align="center">
  
  ![JECRC Logo](https://img.shields.io/badge/JECRC-University-red?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-2.0-gold?style=for-the-badge)
  ![Status](https://img.shields.io/badge/Status-Production_Ready-green?style=for-the-badge)
  
  <h3>Professional Grievance Management System for JECRC University</h3>
  <p><strong>Developed by:</strong> Ruchin Audichya (23BCON0208)</p>
  <p><strong>Supervised by:</strong> CP Beniwal Sir</p>
  
  [🚀 Quick Start](#-quick-start) • [📋 Features](#-key-features) • [📖 Documentation](#-documentation) • [🎯 Demo](#-demo-accounts)
  
</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Demo Accounts](#-demo-accounts)
- [Documentation](#-documentation)
- [Screenshots](#-screenshots)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **JECRC Grievance Portal** is a comprehensive web-based system designed to handle formal grievances from students, faculty, and staff with complete confidentiality and professional workflow management.

### 🌟 Why Choose JECRC Grievance Portal?

- **🔒 Anonymous Submissions** - Complete identity protection for sensitive issues
- **📋 Formal Workflow** - Professional grievance lifecycle management
- **📈 Multi-Level Escalation** - Hierarchical review system
- **🔐 Enterprise Security** - Row-level security and audit trails
- **📱 Responsive Design** - Works seamlessly on all devices

---

## 🚀 Key Features

### 1. Anonymous Grievance System 🔒
```
✅ Optional anonymous submission
✅ Identity protection for sensitive cases
✅ Confidentiality notice on every submission
✅ Secure handling of anonymous grievances
```

### 2. Professional Workflow Management 📋
```
Submitted → Under Review → Action Taken → Resolved → Appealed
```
- Formal status tracking
- Appeal mechanism for unsatisfactory resolutions
- Complete audit trail

### 3. Multi-Level Escalation System 📈
- Dean of Student Affairs
- Academic Council
- University Proctor
- Vice Chancellor

### 4. Role-Based Access Control 👥

| Role | Capabilities |
|------|-------------|
| **Students/Staff** | File grievances, track status, appeal decisions |
| **Resolvers** | Handle assigned grievances, escalate to authorities |
| **Administrators** | System management, analytics, user control |

### 5. Advanced Features 💡
- **Bulk Operations** - Handle multiple items efficiently
- **Knowledge Base** - Learn from resolved grievances
- **User History** - Complete grievance tracking
- **Real-time Updates** - Live status changes
- **File Attachments** - Support documents up to 10MB

---

## 🚀 Quick Start

### For Windows Users:
```batch
1. Extract the project files
2. Double-click START_PORTAL.bat
3. Portal opens at http://localhost:8080
```

### For Mac/Linux Users:
```bash
1. Extract the project files
2. Run: ./start_portal.sh
3. Portal opens at http://localhost:8080
```

---

## 🛠️ Technology Stack

<div align="center">
  
| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| React 18 | Supabase | PostgreSQL | Vite |
| TypeScript | Auth API | Row Level Security | Git |
| Tailwind CSS | Storage API | Real-time | npm |
| Shadcn UI | Edge Functions | Migrations | ESLint |

</div>

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git (optional)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git
   cd JECRC-Grievance-Portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🎯 Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Student** | student@jecrcu.edu.in | password123 | File & track grievances |
| **Staff** | staff@jecrcu.edu.in | password123 | Same as student |
| **Resolver** | resolver@jecrcu.edu.in | password123 | Handle grievances |
| **Admin** | admin@jecrcu.edu.in | password123 | Full system access |

---

## 📖 Documentation

### For Users
- [How to Use Guide](HOW_TO_USE.md) - Simple instructions for all users
- [Demo Guide](DEMO_GUIDE.md) - Complete testing instructions

### For Developers
- [Technical Documentation](TECH_STACK.md) - Architecture details
- [API Documentation](docs/API.md) - Backend integration

### For IT Team
- [Deployment Guide](docs/DEPLOYMENT.md) - Production setup
- [Maintenance Guide](docs/MAINTENANCE.md) - System upkeep

---

## 📸 Screenshots

<div align="center">
  
### Dashboard View
<img src="docs/images/dashboard.png" alt="Dashboard" width="600">

### File Grievance
<img src="docs/images/file-grievance.png" alt="File Grievance" width="600">

### Admin Portal
<img src="docs/images/admin-portal.png" alt="Admin Portal" width="600">

</div>

---

## 🔐 Security

### Built-in Security Features
- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Anonymous Submissions** - Complete identity protection
- ✅ **Encrypted Communications** - HTTPS/WSS protocols
- ✅ **Session Management** - Automatic timeout
- ✅ **Audit Logging** - Complete activity tracking
- ✅ **Input Validation** - XSS and SQL injection prevention

### Security Best Practices
1. Always use HTTPS in production
2. Regular database backups
3. Monitor audit logs
4. Update dependencies regularly
5. Use strong passwords

---

## 🤝 Contributing

We welcome contributions from the JECRC community!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software developed for JECRC University.

- ✅ Internal use within JECRC University
- ✅ Modification for institutional needs
- ✅ Educational and training purposes
- ❌ Commercial redistribution
- ❌ External licensing without permission

---

## 👨‍💻 Developer

<div align="center">
  
**Ruchin Audichya**  
B.Tech Computer Science (2023-2027)  
Roll No: 23BCON0208  
JECRC University, Jaipur

</div>

---

## 🙏 Acknowledgments

- **CP Beniwal Sir** - Project Supervisor
- **JECRC IT Cell** - Technical Support
- **JECRC University** - Infrastructure and Resources

---

<div align="center">
  
**Made with ❤️ for JECRC University**

*Empowering voices, resolving concerns, building trust.*

</div>