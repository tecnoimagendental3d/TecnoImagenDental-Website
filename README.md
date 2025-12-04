# Tecnoimagen Dental 3D

A full-stack web application for a dental radiology clinic, featuring patient study request forms, doctor portal management, and admin controls.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [User Roles & Authentication](#user-roles--authentication)
- [Site Map](#site-map)
- [API Endpoints](#api-endpoints)
- [Key Features](#key-features)

---

## Overview

Tecnoimagen Dental 3D is a clinic management system that allows:
- **Patients** to fill out radiological study request forms and download PDFs
- **Doctors** to manage medical orders and access imaging services (after admin approval)
- **Admins** to approve/reject doctor registrations and manage the system

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **@react-pdf/renderer** - PDF generation
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js + Express 5** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **@google/genai** - AI features

---

## Project Structure

```
tecnoimagen/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication & user management
│   │   ├── invoiceController.js  # Medical orders/invoices
│   │   ├── imageController.js    # Image management
│   │   └── aiController.js       # AI features
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT & role protection
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── User.js               # Doctor/Admin model
│   │   ├── Patient.js            # Patient records (managed by doctors)
│   │   ├── Solicitud.js          # Study request submissions
│   │   ├── Invoice.js            # Medical orders
│   │   └── Image.js              # Uploaded images
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/*
│   │   ├── solicitudRoutes.js    # /api/solicitudes/*
│   │   ├── patientRoutes.js      # /api/patients/*
│   │   ├── invoiceRoutes.js      # /api/invoices/*
│   │   ├── imageRoutes.js        # /api/images/*
│   │   └── aiRoutes.js           # /api/ai/*
│   ├── uploads/                  # Uploaded files storage
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Images, logos, PDFs, videos
│   │   ├── components/
│   │   │   ├── auth/             # ProtectedRoute, AdminRoute
│   │   │   ├── landing/          # Header, Hero, Features, Footer
│   │   │   ├── layout/           # DashboardLayout, ProfileDropdown
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── invoices/         # Invoice-specific components
│   │   │   └── solicitudes/      # Solicitud management components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication state
│   │   ├── pages/
│   │   │   ├── Admin/            # PendingApprovals
│   │   │   ├── Auth/             # Login, SignUp
│   │   │   ├── Dashboard/        # Main dashboard
│   │   │   ├── Invoices/         # Medical orders CRUD
│   │   │   ├── Imagenologia/     # Imaging services
│   │   │   ├── LandingPage/      # Public homepage
│   │   │   ├── Profile/          # User profile
│   │   │   └── SolicitudEstudio/ # Patient study request form
│   │   ├── utils/
│   │   │   ├── apiPaths.js       # API endpoint constants
│   │   │   ├── axiosInstance.js  # Configured Axios
│   │   │   ├── data.js           # Navigation & static data
│   │   │   └── helper.js         # Utility functions
│   │   ├── App.jsx               # Routes configuration
│   │   └── index.js              # Entry point
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd tecnoimagen
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Default Admin Account (auto-created on startup)
ADMIN_NAME=Administrator
ADMIN_EMAIL=admin@tecnoimagen.com
ADMIN_PASSWORD=YourSecurePassword123!

# Google AI (optional, for AI features)
GOOGLE_API_KEY=your_google_ai_api_key
```

Start the backend:
```bash
npm run dev    # Development with hot reload
npm start      # Production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000`
The backend runs on `http://localhost:5000`

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `MONGO_URI` | MongoDB connection string | **Yes** |
| `JWT_SECRET` | Secret for JWT signing | **Yes** |
| `ADMIN_NAME` | Default admin display name | No |
| `ADMIN_EMAIL` | Default admin email | No |
| `ADMIN_PASSWORD` | Default admin password | No |
| `GOOGLE_API_KEY` | Google AI API key | No |

> **Note:** If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, the server automatically creates an admin account on startup if it doesn't exist.

---

## User Roles & Authentication

### Roles

| Role | Description | Access |
|------|-------------|--------|
| **Admin** | System administrator | Full access, approve doctors, manage users |
| **Doctor** | Healthcare provider | Dashboard, invoices, imaging (after approval) |

### Registration Flow

1. **Doctor signs up** → Account created with `status: 'pending'`
2. **Doctor tries to login** → Blocked with message "pending approval"
3. **Admin approves** → Doctor's `status` becomes `'approved'`
4. **Doctor can now login** → Full portal access

### Account Statuses

| Status | Description |
|--------|-------------|
| `pending` | Awaiting admin approval |
| `approved` | Can access the portal |
| `rejected` | Registration denied |

---

## Site Map

### Public Routes (No authentication)

| Path | Page | Description |
|------|------|-------------|
| `/` | Landing Page | Public homepage with features, testimonials |
| `/login` | Login | User authentication |
| `/signup` | Sign Up | Doctor registration (pending approval) |
| `/solicitud-estudio` | Study Request Form | Patient form to request radiological studies |

### Protected Routes (Doctors & Admins)

| Path | Page | Description |
|------|------|-------------|
| `/dashboard` | Dashboard | Main dashboard with stats and overview |
| `/invoices` | All Invoices | List of medical orders |
| `/invoices/new` | Create Invoice | Create new medical order |
| `/invoices/:id` | Invoice Detail | View/edit specific order |
| `/imagenologia` | Imagenología | Imaging services management |
| `/profile` | Profile | User profile settings |

### Admin-Only Routes

| Path | Page | Description |
|------|------|-------------|
| `/admin/pending-approvals` | Pending Approvals | Approve/reject doctor registrations |

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new doctor (pending) |
| `POST` | `/login` | Public | Login user |
| `GET` | `/me` | Protected | Get current user |
| `PUT` | `/me` | Protected | Update profile |
| `GET` | `/doctors` | Public | Get approved doctors (for forms) |

### Admin Routes (`/api/auth/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/pending-doctors` | Admin | List pending registrations |
| `GET` | `/doctors` | Admin | List all doctors (with filters) |
| `PUT` | `/approve/:id` | Admin | Approve a doctor |
| `PUT` | `/reject/:id` | Admin | Reject a doctor |
| `POST` | `/create-admin` | Admin | Create new admin |
| `DELETE` | `/user/:id` | Admin | Delete a user |

### Invoices (`/api/invoices`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Protected | List user's invoices |
| `POST` | `/` | Protected | Create invoice |
| `GET` | `/:id` | Protected | Get invoice by ID |
| `PUT` | `/:id` | Protected | Update invoice |
| `DELETE` | `/:id` | Protected | Delete invoice |

### Images (`/api/images`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/upload` | Protected | Upload image |
| `GET` | `/` | Protected | List images |
| `DELETE` | `/:id` | Protected | Delete image |

### Solicitudes (`/api/solicitudes`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Public | Create new study request (patient submits) |
| `GET` | `/` | Protected | List doctor's solicitudes (supports `?status=` filter) |
| `GET` | `/pending-count` | Protected | Get count of pending solicitudes |
| `GET` | `/:id` | Protected | Get solicitud details |
| `PUT` | `/:id/accept` | Protected | Accept a solicitud (from any status except accepted) |
| `PUT` | `/:id/reject` | Protected | Reject a solicitud (from any status except rejected) |
| `PUT` | `/:id/archive` | Protected | Archive a solicitud (from any status except archived) |
| `PUT` | `/:id/restore` | Protected | Restore to pending (from archived/rejected) |
| `DELETE` | `/:id` | Protected | Delete a solicitud |

### Patients (`/api/patients`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/` | Protected | Create new patient record |
| `GET` | `/` | Protected | List doctor's patients |
| `POST` | `/from-solicitud/:id` | Protected | Create patient from accepted solicitud |
| `GET` | `/:id` | Protected | Get patient details |
| `PUT` | `/:id` | Protected | Update patient info |
| `DELETE` | `/:id` | Protected | Delete patient |
| `POST` | `/:id/documents` | Protected | Upload document to patient file |
| `DELETE` | `/:id/documents/:docId` | Protected | Delete document from patient |

---

## Key Features

### 📋 Patient Study Request Form (`/solicitud-estudio`)
- Public form for patients to request radiological studies
- Dynamic PDF generation with `@react-pdf/renderer`
- Form validation with dynamic checklist tooltips
- Auto-fills doctor information from database
- Supports 2D radiography, 3D tomography, and orthodontic studies
- **Submits request to selected doctor** for approval
- Both "Send to Doctor" and "Download PDF" buttons have validation tooltips

### 👨‍⚕️ Doctor Portal
- Dashboard with medical order statistics
- **Solicitudes management** with:
  - Status filtering (All, Pending, Accepted, Rejected, Archived)
  - Pagination (5 items per page)
  - Flexible status transitions (Accept/Reject/Archive from any state)
  - Expandable cards with patient details and requested studies
- **Patient management** - Doctors maintain patient records (not user accounts)
- **Document uploads** - Store images and documents per patient
- Create and manage medical orders
- Image management for radiology

### 🔐 Admin Panel
- Approve/reject doctor registrations
- View all pending requests
- Manage system users

### 🎨 UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Toast notifications
- Professional dental clinic branding

---

## Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'doctor' | 'admin',
  status: 'pending' | 'approved' | 'rejected',
  businessName: String,
  address: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Solicitud Schema
```javascript
{
  doctor: ObjectId (ref: User),       // Assigned doctor
  status: 'pending' | 'accepted' | 'rejected' | 'archived',
  fecha: Date,
  nombrePaciente: String,
  fechaNacimiento: Date,
  edad: Number,
  telefono: String,
  sexo: 'M' | 'F',
  doctorSolicitante: String,
  correoElectronico: String,
  radiografia2D: { ... },             // 2D study selections
  tomografia3D: { ... },              // 3D study selections
  ortodoncia: { ... },                // Orthodontic study selections
  doctorNotes: String,                // Notes or rejection reason
  createdAt: Date,
  updatedAt: Date
}
```

### Solicitud Status Transitions
- **Pending** → Can be: Accepted, Rejected, or Archived
- **Accepted** → Can be: Rejected or Archived
- **Rejected** → Can be: Accepted or Archived
- **Archived** → Can be: Accepted or Rejected

> A solicitud can transition to any status except its current one.

### Patient Schema
```javascript
{
  doctor: ObjectId (ref: User),       // Managing doctor
  nombre: String,
  fechaNacimiento: Date,
  edad: Number,
  telefono: String,
  sexo: 'M' | 'F',
  correoElectronico: String,
  direccion: String,
  notas: String,
  documents: [{                       // Uploaded files
    name: String,
    type: 'image' | 'pdf' | 'document' | 'other',
    url: String,
    uploadedAt: Date,
    notes: String
  }],
  solicitudes: [ObjectId],            // Linked solicitudes
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice Schema
```javascript
{
  user: ObjectId (ref: User),
  invoiceNumber: String,
  clientName: String,
  // ... other invoice fields
  createdAt: Date,
  updatedAt: Date
}
```

---

## Development Notes

### MongoDB Atlas Setup
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use `0.0.0.0/0` for development)
4. Get connection string and add to `.env`

### First Admin Account
The system automatically creates an admin account on startup using env variables. Alternatively, you can manually create one in MongoDB:

```javascript
{
  name: "Admin",
  email: "admin@example.com",
  password: "<bcrypt-hashed-password>",
  role: "admin",
  status: "approved"
}
```

### Common Issues

1. **MongoDB Connection Error**: Ensure your IP is whitelisted in Atlas
2. **Doctor can't login**: Check if their account status is 'approved'
3. **PDF not generating**: Ensure all required form fields are filled
4. **Can't send solicitud**: Select a doctor from the dropdown (not just type a name)
5. **Solicitud validation error**: All patient info fields are required

---

## License

Private - All rights reserved.

---

## Contact

Tecnoimagen Dental 3D
- Facebook: TECNOIMAGEN DENTAL 3D
- WhatsApp: 5724-7096
- Location: Centro de Salud 1 C. al Norte, 20 Varas al Este, Palacagüina

