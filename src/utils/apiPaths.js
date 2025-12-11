// In production (Vercel), API routes are relative
export const BASE_URL = process.env.REACT_APP_API_URL || "";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth?action=register",
    LOGIN: "/api/auth?action=login",
    GET_PROFILE: "/api/auth?action=me",
    UPDATE_PROFILE: "/api/auth?action=me",
    UPLOAD_AVATAR: "/api/avatar",
    DELETE_AVATAR: "/api/avatar",
    GET_APPROVED_DOCTORS: "/api/auth?action=doctors",
    REQUEST_PASSWORD_RESET: "/api/auth?action=request-password-reset",
  },

  ADMIN: {
    GET_ALL_DOCTORS: "/api/admin?action=doctors",
    CREATE_USER: "/api/admin?action=create-user",
    PASSWORD_RESET_REQUESTS: "/api/admin?action=password-reset-requests",
    UPDATE_USER: (id) => `/api/admin?action=update-user&id=${id}`,
    DELETE_USER: (id) => `/api/admin?action=delete-user&id=${id}`,
    CHANGE_STATUS: (id) => `/api/admin?action=change-status&id=${id}`,
    CLEAR_RESET_REQUEST: (id) => `/api/admin?action=clear-reset&id=${id}`,
  },

  INVOICE: {
    CREATE: "/api/invoices",
    GET_ALL_INVOICES: "/api/invoices",
    GET_INVOICE_BY_ID: (id) => `/api/invoices?id=${id}`,
    UPDATE_INVOICE: (id) => `/api/invoices?id=${id}`,
    DELETE_INVOICE: (id) => `/api/invoices?id=${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: "/api/ai?action=parse-text",
    GENERATE_REMINDER: "/api/ai?action=generate-reminder",
    GET_DASHBOARD_SUMMARY: "/api/ai?action=dashboard-summary",
  },

  IMAGE: {
    UPLOAD: "/api/upload",
    GET_ALL_IMAGES: "/api/images",
    GET_IMAGE_BY_ID: (id) => `/api/images?id=${id}`,
    DELETE_IMAGE: (id) => `/api/images?id=${id}`,
    DOWNLOAD_IMAGE: (id) => `/api/images?id=${id}`,
  },

  SOLICITUD: {
    CREATE: "/api/solicitudes",
    GET_ALL: "/api/solicitudes",
    GET_PENDING_COUNT: "/api/solicitudes?action=pending-count",
    GET_BY_ID: (id) => `/api/solicitudes?id=${id}`,
    ACCEPT: (id) => `/api/solicitudes?id=${id}&action=accept`,
    REJECT: (id) => `/api/solicitudes?id=${id}&action=reject`,
    ARCHIVE: (id) => `/api/solicitudes?id=${id}&action=archive`,
    RESTORE: (id) => `/api/solicitudes?id=${id}&action=restore`,
    DELETE: (id) => `/api/solicitudes?id=${id}`,
  },

  PATIENT: {
    CREATE: "/api/patients",
    GET_ALL: "/api/patients",
    GET_BY_ID: (id) => `/api/patients?id=${id}`,
    UPDATE: (id) => `/api/patients?id=${id}`,
    DELETE: (id) => `/api/patients?id=${id}`,
    CREATE_FROM_SOLICITUD: (solicitudId) => `/api/patients?solicitudId=${solicitudId}`,
    UPLOAD_DOCUMENT: (id) => `/api/patients?id=${id}&action=upload-doc`,
    DELETE_DOCUMENT: (id, docId) => `/api/patients?id=${id}&action=delete-doc&docId=${docId}`,
  },
};
