import { BarChart2, FileText, LayoutDashboard, Mail, Sparkles, Users, Image, Shield, Briefcase } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "Tomografía 3D",
    description:
      "Imágenes tridimensionales de alta resolución para diagnósticos precisos en implantología, ortodoncia y cirugía maxilofacial.",
  },
  {
    icon: BarChart2,
    title: "Radiografía Panorámica",
    description:
      "Visualización completa de la estructura dental y maxilar en una sola imagen para evaluaciones integrales.",
  },
  {
    icon: Mail,
    title: "Cefalometría Digital",
    description:
      "Análisis cefalométrico preciso para planificación de tratamientos ortodónticos y ortognáticos.",
  },
  {
    icon: FileText,
    title: "Entrega Digital",
    description:
      "Resultados disponibles en formato digital con acceso rápido y seguro para profesionales y pacientes.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "La calidad de las tomografías 3D de Tecno Imagen Dental ha mejorado significativamente mis diagnósticos. El servicio es rápido y profesional.",
    author: "Dr. Carlos Mendoza",
    title: "Cirujano Maxilofacial",
    avatar: "https://placehold.co/100x100/0b2f77/ffffff?text=CM"
  },
  {
    quote: "Excelente precisión en las cefalometrías. Me permite planificar tratamientos ortodónticos con total confianza. Altamente recomendado.",
    author: "Dra. María González",
    title: "Ortodoncista",
    avatar: "https://placehold.co/100x100/12c3cc/ffffff?text=MG"
  },
  {
    quote: "El acceso digital a los estudios es muy conveniente. Puedo revisar las imágenes con mis pacientes de forma inmediata. Servicio de primera.",
    author: "Dr. Roberto Silva",
    title: "Implantólogo Dental",
    avatar: "https://placehold.co/100x100/e56c1a/ffffff?text=RS"
  }
];

export const FAQS = [
  {
    question: "¿Qué tipos de estudios de imagenología dental ofrecen?",
    answer: "Ofrecemos tomografía computarizada 3D (CBCT), radiografías panorámicas, cefalometrías digitales, radiografías periapicales y oclusales. Todos nuestros estudios utilizan tecnología de última generación."
  },
  {
    question: "¿Cuánto tiempo tarda en estar listo mi estudio?",
    answer: "La mayoría de nuestros estudios están disponibles en formato digital el mismo día. Las tomografías 3D y estudios especializados pueden estar listos en 24-48 horas dependiendo de la complejidad."
  },
  {
    question: "¿Necesito cita previa para realizar un estudio?",
    answer: "Recomendamos agendar una cita para garantizar disponibilidad y reducir tiempos de espera. Sin embargo, también atendemos pacientes sin cita según disponibilidad."
  },
  {
    question: "¿Cómo puedo acceder a mis resultados?",
    answer: "Los resultados están disponibles a través de nuestra plataforma digital segura. Recibirás un enlace de acceso por correo electrónico o puedes consultarlos directamente desde tu cuenta en nuestro portal."
  },
  {
    question: "¿Es segura la radiación de los estudios dentales?",
    answer: "Sí, utilizamos equipos de última generación con dosis mínimas de radiación. Nuestras tomografías 3D emiten significativamente menos radiación que las tomografías médicas convencionales."
  },
  {
    question: "¿Trabajan con aseguradoras dentales?",
    answer: "Sí, trabajamos con las principales aseguradoras dentales. Te recomendamos verificar la cobertura de tu plan antes de tu cita. Nuestro equipo puede ayudarte con la documentación necesaria."
  },
  {
    question: "¿Puedo solicitar estudios para mis pacientes como profesional dental?",
    answer: "Por supuesto. Ofrecemos cuentas especiales para profesionales dentales con acceso a historial de estudios, facturación simplificada y entrega prioritaria de resultados."
  }
];

// Navigation items configuration (Doctor/Admin Portal)
export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Panel de Control", icon: LayoutDashboard },
  { id: "workspace", name: "Área de Trabajo", icon: Briefcase },
  { id: "imagenologia", name: "Imagenología", icon: Image },
  { id: "profile", name: "Perfil", icon: Users },
];

// Admin-only navigation items
export const ADMIN_NAVIGATION_MENU = [
  { id: "admin", name: "Administración", icon: Shield },
];
