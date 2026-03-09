# TecnoImagen Dental 3D

A comprehensive dental imaging management system for radiological study requests, patient management, and medical image storage.

## 🏥 Overview

TecnoImagen Dental 3D is a web application designed for dental imaging centers to:
- Receive and manage radiological study requests from patients
- Allow doctors to review, accept, or reject study requests
- Store and organize medical images (X-rays, CT scans, etc.)
- Generate PDF forms for study requests
- Manage patient records

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React-PDF** - PDF generation
- **Lucide React** - Icons
- **Moment.js** - Date formatting
- **React Hot Toast** - Notifications

### Backend (Vercel Serverless)
- **Vercel Serverless Functions** - API endpoints
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing

### Deployment
- **Vercel** - Hosting and serverless functions
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
tecnoimagen/
├── frontend/                    # React application
│   ├── api/                     # Vercel serverless functions
│   │   ├── _lib/                # Shared utilities
│   │   │   ├── auth.js          # JWT authentication helpers
│   │   │   └── db.js            # MongoDB connection
│   │   ├── _models/             # Mongoose models
│   │   │   ├── User.js          # User/Doctor model
│   │   │   ├── Solicitud.js     # Study request model
│   │   │   ├── Patient.js       # Patient model
│   │   │   ├── Image.js         # Medical image model
│   │   │   └── Invoice.js       # Medical order model
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── admin.js             # Admin management endpoints
│   │   ├── solicitudes.js       # Study request endpoints
│   │   ├── patients.js          # Patient management endpoints
│   │   ├── images.js            # Image management endpoints
│   │   └── invoices.js          # Medical order endpoints
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Basic UI elements
│   │   │   ├── layout/          # Layout components
│   │   │   ├── landing/         # Landing page sections
│   │   │   └── auth/            # Auth-related components
│   │   ├── pages/               # Page components
│   │   │   ├── SolicitudEstudio/# Study request form
│   │   │   ├── Workspace/       # Doctor workspace
│   │   │   ├── Imagenologia/    # Image management
│   │   │   ├── Dashboard/       # Main dashboard
│   │   │   ├── Admin/           # Admin panel
│   │   │   └── Auth/            # Login/Signup pages
│   │   ├── context/             # React context providers
│   │   ├── utils/               # Utility functions
│   │   └── assets/              # Static assets
│   ├── public/                  # Public static files
│   ├── package.json
│   └── vercel.json              # Vercel configuration
├── backend/                     # Express backend (local dev only)
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for deployment)

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REACT_APP_API_URL=                    # Leave empty for relative URLs
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Mythellaneous/tecnoimagen.git
cd tecnoimagen

# Install frontend dependencies
cd frontend
npm install
```

### Development

For local development with Vercel serverless functions:

```bash
cd frontend
vercel dev
```

Or for frontend-only development (requires deployed API):

```bash
cd frontend
npm start
```

### Deployment

The project is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the **Root Directory** to `frontend`
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📋 Features

### Public Features
- **Study Request Form** (`/solicitud-estudio`)
  - Patients can fill out radiological study request forms
  - Select from 2D X-rays, 3D CT scans, and orthodontic studies
  - Auto-calculate age from birth date
  - Select requesting doctor from dropdown
  - Download PDF of completed form
  - Submit request directly to doctor

### Doctor Features
- **Workspace** (`/workspace`)
  - View pending study requests
  - Accept or reject requests
  - Manage medical orders
  - Archive processed requests

- **Imagenología** (`/imagenologia`)
  - Upload medical images (JPG, PNG)
  - Search images by patient name
  - Filter by date
  - Download individual or multiple images
  - Preview images in modal

- **Dashboard** (`/dashboard`)
  - Overview of activity
  - Quick access to features

### Admin Features
- **Admin Dashboard** (`/admin`)
  - Approve/reject doctor registrations
  - Manage user accounts
  - Handle password reset requests

## 🔐 Authentication

The system uses JWT-based authentication:
- Doctors must register and be approved by an admin
- Tokens are stored in localStorage
- Protected routes require valid authentication

### User Roles
- **Doctor** - Can access workspace, manage patients and images
- **Admin** - Full system access, user management

## 📄 API Endpoints

### Authentication (`/api/auth`)
| Method | Query Param | Description |
|--------|-------------|-------------|
| POST | `action=register` | Register new doctor |
| POST | `action=login` | Login user |
| GET | `action=me` | Get current user |
| PUT | `action=me` | Update profile |
| GET | `action=doctors` | Get approved doctors (public) |

### Solicitudes (`/api/solicitudes`)
| Method | Query Param | Description |
|--------|-------------|-------------|
| POST | - | Create new solicitud |
| GET | - | Get all solicitudes for doctor |
| GET | `action=pending-count` | Get pending count |
| PUT | `id=xxx&action=accept` | Accept solicitud |
| PUT | `id=xxx&action=reject` | Reject solicitud |

### Images (`/api/images`)
| Method | Query Param | Description |
|--------|-------------|-------------|
| GET | - | Get all images |
| GET | `id=xxx` | Get/download image |
| DELETE | `id=xxx` | Delete image |

## 🎨 UI Components

The project uses custom UI components with Tailwind CSS:
- `Button` - Styled button with variants
- `InputField` - Form input with label
- `SelectField` - Dropdown select
- `TextareaField` - Multi-line input

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🌐 Internationalization

The application is in **Spanish** as it's designed for a Spanish-speaking market in Nicaragua.

## 📝 Date Formats

All dates use **DD/MM/YYYY** format (day/month/year) to match local conventions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for TecnoImagen Dental 3D.

## 📞 Support

For support, contact TecnoImagen Dental 3D at:
- WhatsApp: 5724-7096
- Facebook: TECNOIMAGEN DENTAL 3D
- Location: Centro de Salud 1 C. al Norte, 20 Varas al Este, Palacagüina
