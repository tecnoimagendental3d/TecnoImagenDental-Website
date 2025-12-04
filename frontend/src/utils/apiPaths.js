export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Signup
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/me", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/me", // update profile details (PUT)
    UPLOAD_AVATAR: "/api/auth/avatar", // Upload profile picture (POST)
    DELETE_AVATAR: "/api/auth/avatar", // Delete profile picture (DELETE)
  },

  INVOICE:{
    CREATE: "/api/invoices/",
    GET_ALL_INVOICES: "/api/invoices/",
    GET_INVOICE_BY_ID: (id)=>`/api/invoices/${id}`,
    UPDATE_INVOICE: (id)=>`/api/invoices/${id}`,
    DELETE_INVOICE: (id)=>`/api/invoices/${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: '/api/ai/parse-text',
    GENERATE_REMINDER: '/api/ai/generate-reminder',
    GET_DASHBOARD_SUMMARY: '/api/ai/dashboard-summary'
  },

  IMAGE: {
    UPLOAD: "/api/images/",
    GET_ALL_IMAGES: "/api/images/",
    GET_IMAGE_BY_ID: (id) => `/api/images/${id}`,
    DELETE_IMAGE: (id) => `/api/images/${id}`,
    DOWNLOAD_IMAGE: (id) => `/api/images/${id}/download`,
  },

  SOLICITUD: {
    CREATE: "/api/solicitudes/",
    GET_ALL: "/api/solicitudes/",
    GET_PENDING_COUNT: "/api/solicitudes/pending-count",
    GET_BY_ID: (id) => `/api/solicitudes/${id}`,
    ACCEPT: (id) => `/api/solicitudes/${id}/accept`,
    REJECT: (id) => `/api/solicitudes/${id}/reject`,
    ARCHIVE: (id) => `/api/solicitudes/${id}/archive`,
    RESTORE: (id) => `/api/solicitudes/${id}/restore`,
    DELETE: (id) => `/api/solicitudes/${id}`,
  },

  PATIENT: {
    CREATE: "/api/patients/",
    GET_ALL: "/api/patients/",
    GET_BY_ID: (id) => `/api/patients/${id}`,
    UPDATE: (id) => `/api/patients/${id}`,
    DELETE: (id) => `/api/patients/${id}`,
    CREATE_FROM_SOLICITUD: (solicitudId) => `/api/patients/from-solicitud/${solicitudId}`,
    UPLOAD_DOCUMENT: (id) => `/api/patients/${id}/documents`,
    DELETE_DOCUMENT: (id, docId) => `/api/patients/${id}/documents/${docId}`,
  }
};
