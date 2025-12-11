import { BarChart2, FileText, LayoutDashboard, Mail, Sparkles, Users, Image, Shield, Briefcase } from "lucide-react";

export const FEATURES = [
  {
    icon: Sparkles,
    title: "Lorem Ipsum Dolor",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: BarChart2,
    title: "Consectetur Adipiscing",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    icon: Mail,
    title: "Sed Do Eiusmod",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    icon: FileText,
    title: "Magna Aliqua",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    author: "Lorem Ipsum",
    title: "Dolor Sit Amet",
    avatar: "https://placehold.co/100x100/0b2f77/ffffff?text=LI"
  },
  {
    quote: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: "Consectetur",
    title: "Adipiscing Elit",
    avatar: "https://placehold.co/100x100/12c3cc/ffffff?text=CA"
  },
  {
    quote: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    author: "Sed Do",
    title: "Eiusmod Tempor",
    avatar: "https://placehold.co/100x100/e56c1a/ffffff?text=SD"
  }
];

export const FAQS = [
  {
    question: "Lorem ipsum dolor sit amet?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    question: "Consectetur adipiscing elit?",
    answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt."
  },
  {
    question: "Sed do eiusmod tempor?",
    answer: "Magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
  },
  {
    question: "Ut enim ad minim veniam?",
    answer: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore."
  },
  {
    question: "Duis aute irure dolor?",
    answer: "Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim."
  },
  {
    question: "Magna aliqua ut enim?",
    answer: "Ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse."
  },
  {
    question: "Excepteur sint occaecat?",
    answer: "Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
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
