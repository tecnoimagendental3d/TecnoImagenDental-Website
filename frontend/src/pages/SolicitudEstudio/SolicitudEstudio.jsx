/**
 * SolicitudEstudio.jsx
 * 
 * Public-facing form for patients to request radiological studies.
 * This component allows patients to:
 * - Fill out personal information (name, DOB, phone, etc.)
 * - Select a requesting doctor from a dropdown
 * - Choose from various 2D X-ray, 3D CT scan, and orthodontic study options
 * - Download a PDF of the completed form
 * - Submit the request directly to the selected doctor
 * 
 * Key Features:
 * - Auto-calculation of age from date of birth
 * - Date inputs support both manual DD/MM/YYYY typing and calendar picker
 * - Form validation with visual feedback
 * - PDF generation using @react-pdf/renderer
 * - Real-time doctor search with name, email, and phone display
 * 
 * @component
 */

import React, { useRef, useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, Check, X, ArrowLeft, Send, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../assets/Logo/Logo-Horizontal01.png';
import SolicitudPDF from './SolicitudPDF';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const SolicitudEstudio = () => {
  // ==================== REFS ====================
  const formRef = useRef(null);              // Reference to the form container
  const datePickerRef = useRef(null);        // Hidden date picker for DOB calendar
  const fechaPickerRef = useRef(null);       // Hidden date picker for Fecha calendar

  // ==================== UI STATE ====================
  const [isGenerating, setIsGenerating] = useState(false);      // PDF generation in progress
  const [isSubmitting, setIsSubmitting] = useState(false);      // Form submission in progress
  const [isSubmitted, setIsSubmitted] = useState(false);        // Form successfully submitted
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);  // Doctor dropdown visibility

  // ==================== DOCTOR SELECTION STATE ====================
  const [doctorSearch, setDoctorSearch] = useState('');         // Search/display text for doctor input
  const [doctors, setDoctors] = useState([]);                   // List of approved doctors from API
  const [loadingDoctors, setLoadingDoctors] = useState(true);   // Loading state for doctors fetch
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');  // Email of selected doctor

  // ==================== DATE DISPLAY STATE ====================
  // These store the DD/MM/YYYY formatted strings for display
  // The actual dates are stored in formData as YYYY-MM-DD (ISO format)
  const [dobDisplay, setDobDisplay] = useState('');             // Date of birth display (DD/MM/YYYY)
  const [fechaDisplay, setFechaDisplay] = useState('');         // Current date display (DD/MM/YYYY)
  
  // ==================== FORM DATA STATE ====================
  // Main form data object containing all patient info and study selections
  const [formData, setFormData] = useState({
    // --- Patient Information ---
    fecha: '',                    // Request date (YYYY-MM-DD format internally)
    nombrePaciente: '',           // Patient's full name
    fechaNacimiento: '',          // Date of birth (YYYY-MM-DD format internally)
    edad: '',                     // Age (auto-calculated from DOB)
    telefono: '',                 // Phone number
    sexo: '',                     // Gender ('M' or 'F')
    doctorSolicitante: '',        // Requesting doctor's name
    correoElectronico: '',        // Doctor's email
    doctorPhone: '',              // Doctor's phone number
    
    // --- Radiografía 2D (2D X-Ray Studies) ---
    panoramica: false,            // Panoramic X-ray
    panoramicaDientesHD: false,   // HD Teeth Panoramic
    lateralCraneo: false,         // Lateral skull
    apCraneo: false,              // A-P skull
    paCraneo: false,              // P-A skull
    atmBocaAbierta: false,        // TMJ open mouth
    atmBocaCerrada: false,        // TMJ closed mouth
    senosParanasales: false,      // Paranasal sinuses 12x10
    towneInversa: false,          // Reverse Towne
    hirtz: false,                 // Hirtz projection
    caldwell: false,              // Caldwell projection
    waters: false,                // Waters projection
    cavum: false,                 // Cavum
    carpal: false,                // Carpal (wrist)
    
    // --- Tomografía 3D CBCT (3D CT Scans) ---
    tomoCampoAmplio: false,       // Wide field CT
    tomoBimaxilar: false,         // Bimaxillary 12x10
    tomoMaxilar: false,           // Maxillary 8x10
    tomoMandibular: false,        // Mandibular 8x10
    tomoViasAereas: false,        // Airways 12x10
    tomoSenosParanasales: false,  // Paranasal sinuses CT
    tomoAtmUnilateral: false,     // Unilateral TMJ 8x8
    tomoAtmUnilateralApertura: false,   // Unilateral TMJ - Open
    tomoAtmUnilateralOclusion: false,   // Unilateral TMJ - Closed
    tomoAtmBilateral: false,      // Bilateral TMJ 8x8
    tomoAtmBilateralApertura: false,    // Bilateral TMJ - Open
    tomoAtmBilateralOclusion: false,    // Bilateral TMJ - Closed
    tomoZona5x5: false,           // Zone CT 5x5
    conInterpretacion: false,     // With interpretation
    sinInterpretacion: false,     // Without interpretation
    propositoTomografia: '',      // Purpose/notes for CT scan
    
    // --- Estudio de Ortodoncia (Orthodontic Studies) ---
    ortodonciaPanoramica: false,       // Orthodontic panoramic
    ortodonciaLateralCraneo: false,    // Orthodontic lateral skull
    ortodonciaCefalometria: false,     // Cephalometry
    ortodonciaConFoto: false,          // With photo
    ortodonciaSinFoto: false,          // Without photo
  });

  // Autofill current date on mount
  useEffect(() => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setFechaDisplay(`${day}/${month}/${year}`); // DD/MM/YYYY format
    setFormData(prev => ({
      ...prev,
      fecha: dateStr,
    }));
  }, []);

  // Fetch approved doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_APPROVED_DOCTORS);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        // Fallback to empty array if API fails
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Auto-calculate age from birth date
  useEffect(() => {
    const { fechaNacimiento } = formData;
    
    if (fechaNacimiento) {
      // Parse date without timezone conversion
      const parts = fechaNacimiento.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        
        // Check if valid date
        if (!isNaN(birthDate.getTime()) && birthDate < today) {
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          // Adjust if birthday hasn't occurred this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (age >= 0 && age < 150) {
            setFormData(prev => ({ ...prev, edad: String(age) }));
          }
        }
      }
    }
  }, [formData.fechaNacimiento]);

  // Format date for display (DD/MM/YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for internal storage (with strict validation)
  const parseDDMMYYYY = (displayStr) => {
    if (!displayStr) return '';
    const parts = displayStr.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    if (!day || !month || !year || year.length !== 4) return '';
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (isNaN(d) || isNaN(m) || isNaN(y)) return '';
    if (m < 1 || m > 12) return '';
    if (y < 1900 || y > new Date().getFullYear() + 1) return '';
    
    // Validate day based on month (accounting for leap years)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Check for leap year
    if ((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)) {
      daysInMonth[1] = 29;
    }
    if (d < 1 || d > daysInMonth[m - 1]) return '';
    
    // Final validation: create a Date object and verify it matches
    const testDate = new Date(y, m - 1, d);
    if (testDate.getFullYear() !== y || testDate.getMonth() !== m - 1 || testDate.getDate() !== d) {
      return '';
    }
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY for display (no timezone conversion)
  const formatYYYYMMDDtoDDMMYYYY = (isoStr) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length !== 3) return '';
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  // Parse date string without timezone issues
  const parseDateLocal = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    return new Date(year, month - 1, day);
  };

  // Handle DOB text input (allow typing DD/MM/YYYY)
  const handleDobInput = (e) => {
    let value = e.target.value;
    // Allow only digits and slashes
    value = value.replace(/[^\d/]/g, '');
    
    // Auto-insert slashes as user types
    const digits = value.replace(/\//g, '');
    if (digits.length >= 2 && value.length <= 2) {
      value = digits.slice(0, 2) + '/';
    } else if (digits.length >= 4 && value.length <= 5) {
      value = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/';
    }
    
    // Limit to DD/MM/YYYY format length
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    setDobDisplay(value);
    
    // Try to parse and update internal state if valid
    const isoDate = parseDDMMYYYY(value);
    if (isoDate) {
      setFormData(prev => ({ ...prev, fechaNacimiento: isoDate }));
    } else if (value === '') {
      setFormData(prev => ({ ...prev, fechaNacimiento: '' }));
    }
  };

  // Handle date picker change
  const handleDatePickerChange = (e) => {
    const isoDate = e.target.value; // YYYY-MM-DD
    setFormData(prev => ({ ...prev, fechaNacimiento: isoDate }));
    setDobDisplay(formatYYYYMMDDtoDDMMYYYY(isoDate));
  };

  // Open the hidden date picker for DOB
  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.showPicker();
    }
  };

  // Handle Fecha text input (allow typing DD/MM/YYYY)
  const handleFechaInput = (e) => {
    let value = e.target.value;
    // Allow only digits and slashes
    value = value.replace(/[^\d/]/g, '');
    
    // Auto-insert slashes as user types
    const digits = value.replace(/\//g, '');
    if (digits.length >= 2 && value.length <= 2) {
      value = digits.slice(0, 2) + '/';
    } else if (digits.length >= 4 && value.length <= 5) {
      value = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/';
    }
    
    // Limit to DD/MM/YYYY format length
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    setFechaDisplay(value);
    
    // Try to parse and update internal state if valid
    const isoDate = parseDDMMYYYY(value);
    if (isoDate) {
      setFormData(prev => ({ ...prev, fecha: isoDate }));
    } else if (value === '') {
      setFormData(prev => ({ ...prev, fecha: '' }));
    }
  };

  // Handle Fecha date picker change
  const handleFechaPickerChange = (e) => {
    const isoDate = e.target.value; // YYYY-MM-DD
    setFormData(prev => ({ ...prev, fecha: isoDate }));
    setFechaDisplay(formatYYYYMMDDtoDDMMYYYY(isoDate));
  };

  // Open the hidden date picker for Fecha
  const openFechaPicker = () => {
    if (fechaPickerRef.current) {
      fechaPickerRef.current.showPicker();
    }
  };

  // Email validation
  const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validation logic
  const hasRadiografia2D = formData.panoramica || formData.panoramicaDientesHD || formData.lateralCraneo ||
    formData.apCraneo || formData.paCraneo || formData.atmBocaAbierta || formData.atmBocaCerrada ||
    formData.senosParanasales || formData.towneInversa || formData.hirtz || formData.caldwell ||
    formData.waters || formData.cavum || formData.carpal;

  const hasTomografia3D = formData.tomoCampoAmplio || formData.tomoBimaxilar || formData.tomoMaxilar ||
    formData.tomoMandibular || formData.tomoViasAereas || formData.tomoSenosParanasales ||
    formData.tomoAtmUnilateral || formData.tomoAtmBilateral || formData.tomoZona5x5;

  const hasAtLeastOneStudy = hasRadiografia2D || hasTomografia3D;

  const atmUnilateralValid = !formData.tomoAtmUnilateral || 
    (formData.tomoAtmUnilateral && (formData.tomoAtmUnilateralApertura || formData.tomoAtmUnilateralOclusion));

  const atmBilateralValid = !formData.tomoAtmBilateral || 
    (formData.tomoAtmBilateral && (formData.tomoAtmBilateralApertura || formData.tomoAtmBilateralOclusion));

  // Interpretation only required if 3D section is selected
  const interpretacionValid = !hasTomografia3D || 
    (hasTomografia3D && ((formData.conInterpretacion && !formData.sinInterpretacion) || 
    (!formData.conInterpretacion && formData.sinInterpretacion)));

  const ortodonciaTopSelected = formData.ortodonciaPanoramica || formData.ortodonciaLateralCraneo || formData.ortodonciaCefalometria;
  const ortodonciaFotoValid = !ortodonciaTopSelected || 
    (ortodonciaTopSelected && ((formData.ortodonciaConFoto && !formData.ortodonciaSinFoto) || (!formData.ortodonciaConFoto && formData.ortodonciaSinFoto)));

  // Personal info validation
  const personalInfoValid = formData.fecha && formData.nombrePaciente && formData.fechaNacimiento && 
    formData.edad && formData.telefono && (formData.sexo === 'M' || formData.sexo === 'F') && 
    formData.doctorSolicitante && isValidEmail(formData.correoElectronico);

  const isFormValid = personalInfoValid && hasAtLeastOneStudy && atmUnilateralValid && atmBilateralValid && interpretacionValid && ortodonciaFotoValid;
  
  // Track if user has attempted to submit (for showing validation errors)
  const [showValidation, setShowValidation] = useState(false);

  const getValidationMessage = () => {
    if (!personalInfoValid) return 'Complete toda la información personal del paciente';
    if (!hasAtLeastOneStudy) return 'Seleccione al menos un estudio en Radiografía 2D o Tomografía 3D';
    if (!atmUnilateralValid) return 'ATM Unilateral requiere Apertura u Oclusión';
    if (!atmBilateralValid) return 'ATM Bilateral requiere Apertura u Oclusión';
    if (!interpretacionValid) return 'Seleccione Con o Sin interpretación';
    if (!ortodonciaFotoValid) return 'Seleccione Con Foto o Sin Foto';
    return '';
  };

  const handleGenerateClick = () => {
    if (!isFormValid) {
      setShowValidation(true);
      return;
    }
    generatePDF();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberInput = (e, maxLength) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, maxLength);
    setFormData(prev => ({ ...prev, [name]: numericValue }));
  };

  const handlePhoneInput = (e) => {
    const { name, value } = e.target;
    const phoneValue = value.replace(/[^0-9+\-() ]/g, '');
    setFormData(prev => ({ ...prev, [name]: phoneValue }));
  };

  const handleInterpretacionChange = (field) => {
    if (field === 'conInterpretacion') {
      setFormData(prev => ({ ...prev, conInterpretacion: !prev.conInterpretacion, sinInterpretacion: false }));
    } else {
      setFormData(prev => ({ ...prev, sinInterpretacion: !prev.sinInterpretacion, conInterpretacion: false }));
    }
  };

  const handleOrtodonciaFotoChange = (field) => {
    if (field === 'ortodonciaConFoto') {
      setFormData(prev => ({ ...prev, ortodonciaConFoto: !prev.ortodonciaConFoto, ortodonciaSinFoto: false }));
    } else {
      setFormData(prev => ({ ...prev, ortodonciaSinFoto: !prev.ortodonciaSinFoto, ortodonciaConFoto: false }));
    }
  };

  const selectDoctor = (doctor) => {
    // Format: "Name (email / phone)" or "Name (email)" if no phone
    const contactInfo = doctor.phone 
      ? `${doctor.email} / ${doctor.phone}` 
      : doctor.email;
    const displayName = `${doctor.name} (${contactInfo})`;
    
    setFormData(prev => ({ 
      ...prev, 
      doctorSolicitante: doctor.name,
      correoElectronico: doctor.email || '',
      doctorPhone: doctor.phone || ''
    }));
    setDoctorSearch(displayName);
    setSelectedDoctorEmail(doctor.email);
    setShowDoctorDropdown(false);
  };

  // Submit solicitud to backend
  const handleSubmitSolicitud = async () => {
    if (!isFormValid) {
      setShowValidation(true);
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    if (!selectedDoctorEmail) {
      toast.error('Por favor seleccione un doctor de la lista');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        doctorEmail: selectedDoctorEmail,
        ...formData,
      };

      await axiosInstance.post(API_PATHS.SOLICITUD.CREATE, payload);
      
      setIsSubmitted(true);
      toast.success('¡Solicitud enviada exitosamente! El doctor será notificado.');
    } catch (error) {
      console.error('Error submitting solicitud:', error);
      toast.error(error.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(d => {
    const searchLower = doctorSearch.toLowerCase();
    return d.name.toLowerCase().includes(searchLower) ||
           (d.email && d.email.toLowerCase().includes(searchLower)) ||
           (d.phone && d.phone.includes(doctorSearch));
  });

  const generatePDF = async () => {
    if (!isFormValid) return;
    setIsGenerating(true);
    try {
      const fileName = `Solicitud_Estudio_${formData.nombrePaciente || 'Paciente'}_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`;
      const blob = await pdf(<SolicitudPDF formData={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#d4f0f4]">
      <Header />
      
      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto" style={{ maxWidth: '750px' }}>
          {/* Back Link & Action Buttons */}
          <div className="flex justify-between items-center mb-4 print:hidden">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-1 text-[#0b5b8a] hover:text-[#12c3cc] transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Solicitud de Estudio Radiológico</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Submit to Doctor Button */}
              <div className="relative group">
                <button
                  onClick={handleSubmitSolicitud}
                  disabled={isSubmitting || !isFormValid || isSubmitted || !selectedDoctorEmail}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded transition-colors ${
                    isFormValid && selectedDoctorEmail && !isSubmitted
                      ? 'bg-[#12c3cc] hover:bg-[#0fa8b0] cursor-pointer' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {isSubmitting ? 'Enviando...' : isSubmitted ? 'Enviado ✓' : 'Enviar al Doctor'}
                </button>
                {/* Dynamic Checklist Tooltip for Submit */}
                <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="font-semibold mb-2 text-gray-300 border-b border-gray-700 pb-1">Requisitos para enviar</div>
                  <div className="space-y-1.5">
                    <ChecklistItem label="Fecha" isValid={!!formData.fecha} />
                    <ChecklistItem label="Nombre del paciente" isValid={!!formData.nombrePaciente} />
                    <ChecklistItem label="Fecha de nacimiento" isValid={!!formData.fechaNacimiento} />
                    <ChecklistItem label="Edad" isValid={!!formData.edad} />
                    <ChecklistItem label="Teléfono" isValid={!!formData.telefono} />
                    <ChecklistItem label="Sexo" isValid={formData.sexo === 'M' || formData.sexo === 'F'} />
                    <ChecklistItem label="Doctor seleccionado de la lista" isValid={!!selectedDoctorEmail} />
                    <ChecklistItem label="Correo electrónico válido" isValid={isValidEmail(formData.correoElectronico)} />
                    <ChecklistItem label="Estudio seleccionado (2D o 3D)" isValid={hasAtLeastOneStudy} />
                    {formData.tomoAtmUnilateral && (
                      <ChecklistItem label="ATM Unilateral: Apertura u Oclusión" isValid={atmUnilateralValid} indent />
                    )}
                    {formData.tomoAtmBilateral && (
                      <ChecklistItem label="ATM Bilateral: Apertura u Oclusión" isValid={atmBilateralValid} indent />
                    )}
                    {hasTomografia3D && (
                      <ChecklistItem label="Interpretación (Con o Sin)" isValid={interpretacionValid} />
                    )}
                    {ortodonciaTopSelected && (
                      <ChecklistItem label="Ortodoncia: Con o Sin Foto" isValid={ortodonciaFotoValid} />
                    )}
                  </div>
                  <div className={`mt-2 pt-2 border-t border-gray-700 font-semibold ${isFormValid && selectedDoctorEmail ? 'text-green-400' : 'text-red-400'}`}>
                    {isFormValid && selectedDoctorEmail ? '✓ Listo para enviar' : '✗ Formulario incompleto'}
                  </div>
                  <div className="absolute -top-2 right-6 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
              
              {/* Download PDF Button */}
        <div className="relative group">
            <button
              onClick={handleGenerateClick}
              disabled={isGenerating || !isFormValid}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded transition-colors ${
                isFormValid 
                  ? 'bg-[#0b5b8a] hover:bg-[#094a6f] cursor-pointer' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Download size={16} />
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </button>
            {/* Dynamic Checklist Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="font-semibold mb-2 text-gray-300 border-b border-gray-700 pb-1">Requisitos del formulario</div>
              <div className="space-y-1.5">
                <ChecklistItem label="Fecha" isValid={!!formData.fecha} />
                <ChecklistItem label="Nombre del paciente" isValid={!!formData.nombrePaciente} />
                <ChecklistItem label="Fecha de nacimiento" isValid={!!formData.fechaNacimiento} />
                <ChecklistItem label="Edad" isValid={!!formData.edad} />
                <ChecklistItem label="Teléfono" isValid={!!formData.telefono} />
                <ChecklistItem label="Sexo" isValid={formData.sexo === 'M' || formData.sexo === 'F'} />
                <ChecklistItem label="Doctor solicitante" isValid={!!formData.doctorSolicitante} />
                <ChecklistItem label="Correo electrónico válido" isValid={isValidEmail(formData.correoElectronico)} />
                <ChecklistItem label="Estudio seleccionado (2D o 3D)" isValid={hasAtLeastOneStudy} />
                {formData.tomoAtmUnilateral && (
                  <ChecklistItem label="ATM Unilateral: Apertura u Oclusión" isValid={atmUnilateralValid} indent />
                )}
                {formData.tomoAtmBilateral && (
                  <ChecklistItem label="ATM Bilateral: Apertura u Oclusión" isValid={atmBilateralValid} indent />
                )}
                {hasTomografia3D && (
                  <ChecklistItem label="Interpretación (Con o Sin)" isValid={interpretacionValid} />
                )}
                {ortodonciaTopSelected && (
                  <ChecklistItem label="Ortodoncia: Con o Sin Foto" isValid={ortodonciaFotoValid} />
                )}
              </div>
              <div className={`mt-2 pt-2 border-t border-gray-700 font-semibold ${isFormValid ? 'text-green-400' : 'text-red-400'}`}>
                {isFormValid ? '✓ Listo para descargar' : '✗ Formulario incompleto'}
              </div>
              <div className="absolute -top-2 right-6 w-3 h-3 bg-gray-900 rotate-45"></div>
            </div>
          </div>
            </div>
        </div>

      {/* Form Container */}
      <div 
        ref={formRef}
        className="bg-white shadow-md"
        style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '12px', padding: '25px' }}
      >
        {/* Header - 2 Section Flexbox (1/3 Logo, 2/3 Content) */}
        <div className="flex bg-[#e8f4f8] rounded items-stretch" style={{ padding: '10px', marginBottom: '12px' }}>
          {/* Section 1: Logo (40%) */}
          <div className="flex items-center justify-center" style={{ flex: '0 0 40%', padding: '8px' }}>
            <img src={Logo} alt="Tecnoimagen Dental 3D" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          
          {/* Section 2: All Content (60%) */}
          <div className="flex flex-col justify-center" style={{ flex: '0 0 60%' }}>
            <h1 className="font-bold text-[#0b5b8a] text-right" style={{ fontSize: '16px', marginBottom: '4px' }}>
              SOLICITUD DE ESTUDIO RADIOLÓGICO
            </h1>
            <div className="flex flex-col items-end gap-1" style={{ marginBottom: '6px' }}>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="bg-[#1877F2] text-white rounded" style={{ fontSize: '11px', padding: '2px 8px' }}>TECNOIMAGEN DENTAL 3D</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="bg-[#25D366] text-white rounded" style={{ fontSize: '11px', padding: '2px 8px' }}>5724-7096</span>
              </div>
            </div>
            <div style={{ marginLeft: '10%' }}>
              <p className="font-bold text-gray-600 text-center" style={{ fontSize: '12px', marginBottom: '2px' }}>HORARIO DE ATENCIÓN:</p>
              <div className="flex justify-center gap-6" style={{ marginBottom: '4px' }}>
                <div className="text-center">
                  <p className="font-bold text-gray-600" style={{ fontSize: '11px' }}>Lunes a Viernes</p>
                  <p className="text-gray-600" style={{ fontSize: '11px' }}>8:30am - 12:00md</p>
                  <p className="text-gray-600" style={{ fontSize: '11px' }}>1:00pm - 5:00pm</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-600" style={{ fontSize: '11px' }}>Sábado</p>
                  <p className="text-gray-600" style={{ fontSize: '11px' }}>8:00am - 12:00md</p>
                </div>
              </div>
            </div>
            <p className="font-bold text-[#0b5b8a] text-right" style={{ fontSize: '11px' }}>
              CENTRO DE SALUD 1 C. AL NORTE, 20 VARAS AL ESTE, PALACAGÜINA
            </p>
          </div>
        </div>

        {/* Patient Information - Black text, light blue checkboxes */}
        <div style={{ marginBottom: '10px' }}>
          {/* Fecha */}
          <div className="flex items-end gap-2" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black" style={{ fontSize: '12px', marginRight: '8px' }}>Fecha:</label>
            <div className="relative">
              <input
                type="text"
                value={fechaDisplay}
                readOnly
                className="bg-gray-100 outline-none text-gray-600 cursor-not-allowed"
                style={{ fontSize: '12px', paddingBottom: '2px', width: '80px' }}
              />
              <div className="bg-gray-400" style={{ height: '1px' }}></div>
            </div>
          </div>

          {/* Nombre del Paciente */}
          <div className="flex items-end" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black whitespace-nowrap" style={{ fontSize: '12px', marginRight: '8px' }}>Nombre del Paciente:</label>
            <div className="flex-1">
              <input
                type="text"
                name="nombrePaciente"
                value={formData.nombrePaciente}
                onChange={handleInputChange}
                className={`w-full bg-transparent outline-none text-gray-800 ${showValidation && !formData.nombrePaciente ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px' }}
              />
              <div className={`${showValidation && !formData.nombrePaciente ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
            </div>
          </div>

          {/* Fecha de Nacimiento, Edad */}
          <div className="flex items-end gap-2" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black whitespace-nowrap" style={{ fontSize: '12px', marginRight: '8px' }}>Fecha de Nacimiento:</label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={dobDisplay}
                onChange={handleDobInput}
                placeholder="DD/MM/AAAA"
                className={`bg-transparent outline-none text-gray-800 ${showValidation && !formData.fechaNacimiento ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px', width: '100px' }}
              />
              <button
                type="button"
                onClick={openDatePicker}
                className="ml-1 p-1 hover:bg-gray-100 rounded transition-colors"
                title="Seleccionar del calendario"
              >
                <Calendar size={14} className="text-gray-500 hover:text-[#0b5b8a]" />
              </button>
              {/* Hidden date picker for calendar selection */}
              <input
                ref={datePickerRef}
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleDatePickerChange}
                max={new Date().toISOString().split('T')[0]}
                className="absolute opacity-0 pointer-events-none"
                style={{ width: '1px', height: '1px' }}
                tabIndex={-1}
              />
              <div className={`absolute bottom-0 left-0 right-8 ${showValidation && !formData.fechaNacimiento ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
            </div>
            <label className="font-bold text-black" style={{ fontSize: '12px', marginLeft: '20px', marginRight: '8px' }}>Edad:</label>
            <div style={{ width: '40px' }}>
              <input
                type="text"
                value={formData.edad}
                readOnly
                className={`w-full bg-gray-100 outline-none text-gray-800 text-center ${showValidation && !formData.edad ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px' }}
                placeholder="--"
              />
              <div className={`${showValidation && !formData.edad ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
            </div>
          </div>

          {/* Teléfono, Sexo */}
          <div className="flex items-end" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black" style={{ fontSize: '12px', marginRight: '8px' }}>Teléfono:</label>
            <div style={{ flex: '0.5', marginRight: '12px' }}>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handlePhoneInput}
                className={`w-full bg-transparent outline-none text-gray-800 ${showValidation && !formData.telefono ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px' }}
              />
              <div className={`${showValidation && !formData.telefono ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
            </div>
            <label className="font-bold text-black" style={{ fontSize: '12px', marginLeft: '20px', marginRight: '8px' }}>Sexo:</label>
            <div className={`flex items-center gap-4 ml-3 px-2 py-1 rounded ${showValidation && formData.sexo !== 'M' && formData.sexo !== 'F' ? 'ring-1 ring-red-500 animate-pulse' : ''}`}>
              <CheckboxField name="sexoM" label="M" checked={formData.sexo === 'M'} onChange={() => setFormData(prev => ({ ...prev, sexo: prev.sexo === 'M' ? '' : 'M' }))} color="lightblue" textColor="black" />
              <CheckboxField name="sexoF" label="F" checked={formData.sexo === 'F'} onChange={() => setFormData(prev => ({ ...prev, sexo: prev.sexo === 'F' ? '' : 'F' }))} color="lightblue" textColor="black" />
            </div>
          </div>

          {/* Dr. Solicitante with dropdown */}
          <div className="flex items-end relative" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black whitespace-nowrap" style={{ fontSize: '12px', marginRight: '8px' }}>Dr. (a) Solicitante:</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => { setDoctorSearch(e.target.value); setFormData(prev => ({ ...prev, doctorSolicitante: e.target.value })); }}
                onFocus={() => setShowDoctorDropdown(true)}
                onBlur={() => setTimeout(() => setShowDoctorDropdown(false), 200)}
                className={`w-full bg-transparent outline-none text-gray-800 ${showValidation && !formData.doctorSolicitante ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px' }}
              />
              <div className={`${showValidation && !formData.doctorSolicitante ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
              {showDoctorDropdown && filteredDoctors.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-20 max-h-48 overflow-auto">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor._id} onClick={() => selectDoctor(doctor)} 
                      className="px-2 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                      <div className="text-sm font-medium text-gray-800">{doctor.name}</div>
                      <div className="text-xs text-gray-500">{doctor.email}</div>
                      {doctor.phone && (
                        <div className="text-xs text-gray-400">📞 {doctor.phone}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {showDoctorDropdown && !loadingDoctors && filteredDoctors.length === 0 && doctorSearch && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-20 p-2 text-sm text-gray-500">
                  No se encontraron doctores
                </div>
              )}
              {showDoctorDropdown && loadingDoctors && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-20 p-2 text-sm text-gray-500">
                  Cargando doctores...
                </div>
              )}
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="flex items-end" style={{ marginBottom: '7px' }}>
            <label className="font-bold text-black whitespace-nowrap" style={{ fontSize: '12px', marginRight: '8px' }}>Correo Electrónico:</label>
            <div className="flex-1">
              <input
                type="email"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleInputChange}
                className={`w-full bg-transparent outline-none text-gray-800 ${showValidation && !isValidEmail(formData.correoElectronico) ? 'animate-pulse' : ''}`}
                style={{ fontSize: '12px', paddingBottom: '2px' }}
              />
              <div className={`${showValidation && !isValidEmail(formData.correoElectronico) ? 'bg-red-500' : 'bg-gray-400'}`} style={{ height: '1px' }}></div>
            </div>
          </div>
        </div>

        {/* Radiografía 2D Section - Blue text, dark blue checkboxes */}
        <div className={`transition-all ${
          showValidation && !hasAtLeastOneStudy ? 'animate-pulse' : ''
        }`} style={{ marginBottom: '10px' }}>
          <div className={`${showValidation && !hasAtLeastOneStudy ? 'bg-red-500' : 'bg-[#0b5b8a]'}`} style={{ height: '2px', marginBottom: '-10px' }}></div>
          <div className="flex justify-center" style={{ marginBottom: '8px' }}>
            <span className={`font-bold border-2 rounded bg-white ${
              showValidation && !hasAtLeastOneStudy ? 'text-red-500 border-red-500' : 'text-[#0b5b8a] border-[#0b5b8a]'
            }`} style={{ fontSize: '13px', padding: '4px 15px' }}>
              Radiografía 2D
            </span>
          </div>
          <div className="grid grid-cols-2" style={{ padding: '10px 10px 8px 10px' }}>
            <div>
              <CheckboxField name="panoramica" label="Panorámica" checked={formData.panoramica} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="panoramicaDientesHD" label="Panorámica dientes HD" checked={formData.panoramicaDientesHD} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="lateralCraneo" label="Lateral de cráneo" checked={formData.lateralCraneo} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="apCraneo" label="A-P de cráneo" checked={formData.apCraneo} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="paCraneo" label="P-A de cráneo" checked={formData.paCraneo} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="atmBocaAbierta" label="ATM Boca Abierta" checked={formData.atmBocaAbierta} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="atmBocaCerrada" label="ATM Boca Cerrada" checked={formData.atmBocaCerrada} onChange={handleInputChange} color="darkblue" textColor="blue" />
            </div>
            <div>
              <CheckboxField name="senosParanasales" label="Senos Paranasales 12x10" checked={formData.senosParanasales} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="towneInversa" label="Towne Inversa" checked={formData.towneInversa} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="hirtz" label="Hirtz" checked={formData.hirtz} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="caldwell" label="Caldwell" checked={formData.caldwell} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="waters" label="Waters" checked={formData.waters} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="cavum" label="Cavum" checked={formData.cavum} onChange={handleInputChange} color="darkblue" textColor="blue" />
              <CheckboxField name="carpal" label="Carpal" checked={formData.carpal} onChange={handleInputChange} color="darkblue" textColor="blue" />
            </div>
          </div>
        </div>

        {/* Tomografía 3D (CBCT) Section - Blue text, light blue checkboxes */}
        <div className={`transition-all ${
          showValidation && !hasAtLeastOneStudy ? 'animate-pulse' : ''
        }`} style={{ marginBottom: '10px' }}>
          <div className={`${showValidation && !hasAtLeastOneStudy ? 'bg-red-500' : 'bg-[#12c3cc]'}`} style={{ height: '2px', marginBottom: '-10px' }}></div>
          <div className="flex justify-center" style={{ marginBottom: '8px' }}>
            <span className={`font-bold border-2 rounded bg-white ${
              showValidation && !hasAtLeastOneStudy ? 'text-red-500 border-red-500' : 'text-[#0b5b8a] border-[#12c3cc]'
            }`} style={{ fontSize: '13px', padding: '4px 15px' }}>
              Tomografía 3D (CBCT)
            </span>
          </div>
          <div className="grid grid-cols-2" style={{ padding: '10px 10px 8px 10px' }}>
            <div>
              <CheckboxField name="tomoCampoAmplio" label="Tomografía de campo amplio" checked={formData.tomoCampoAmplio} onChange={handleInputChange} color="lightblue" textColor="blue" />
              <CheckboxField name="tomoBimaxilar" label="Tomografía Bimaxilar 12x10" checked={formData.tomoBimaxilar} onChange={handleInputChange} color="lightblue" textColor="blue" />
              <CheckboxField name="tomoMaxilar" label="Tomografía Maxilar 8x10" checked={formData.tomoMaxilar} onChange={handleInputChange} color="lightblue" textColor="blue" />
              <CheckboxField name="tomoMandibular" label="Tomografía Mandibular 8x10" checked={formData.tomoMandibular} onChange={handleInputChange} color="lightblue" textColor="blue" />
              <CheckboxField name="tomoViasAereas" label="Tomografía Vías aéreas 12x10" checked={formData.tomoViasAereas} onChange={handleInputChange} color="lightblue" textColor="blue" />
              <CheckboxField name="tomoSenosParanasales" label="Tomografía senos paranasales" checked={formData.tomoSenosParanasales} onChange={handleInputChange} color="lightblue" textColor="blue" />
            </div>
            <div>
              <CheckboxField name="tomoAtmUnilateral" label="Tomografía ATM Unilateral 8x8" checked={formData.tomoAtmUnilateral} onChange={handleInputChange} color="lightblue" textColor="blue" 
                hasError={formData.tomoAtmUnilateral && !atmUnilateralValid} />
              <div className="flex gap-3" style={{ marginLeft: '16px', marginTop: '2px' }}>
                <CheckboxField name="tomoAtmUnilateralApertura" label="Apertura" checked={formData.tomoAtmUnilateralApertura} onChange={handleInputChange} small color="lightblue" textColor="blue" />
                <CheckboxField name="tomoAtmUnilateralOclusion" label="Oclusión" checked={formData.tomoAtmUnilateralOclusion} onChange={handleInputChange} small color="lightblue" textColor="blue" />
              </div>
              <CheckboxField name="tomoAtmBilateral" label="Tomografía ATM Bilateral 8x8" checked={formData.tomoAtmBilateral} onChange={handleInputChange} color="lightblue" textColor="blue"
                hasError={formData.tomoAtmBilateral && !atmBilateralValid} />
              <div className="flex gap-3" style={{ marginLeft: '16px', marginTop: '2px' }}>
                <CheckboxField name="tomoAtmBilateralApertura" label="Apertura" checked={formData.tomoAtmBilateralApertura} onChange={handleInputChange} small color="lightblue" textColor="blue" />
                <CheckboxField name="tomoAtmBilateralOclusion" label="Oclusión" checked={formData.tomoAtmBilateralOclusion} onChange={handleInputChange} small color="lightblue" textColor="blue" />
              </div>
              <CheckboxField name="tomoZona5x5" label="Tomografía de zona 5x5" checked={formData.tomoZona5x5} onChange={handleInputChange} color="lightblue" textColor="blue" />
            </div>
          </div>
          
          {/* Interpretation - Required only if 3D selected */}
          <div className={`flex justify-center gap-8 transition-all ${
            showValidation && hasTomografia3D && !interpretacionValid ? 'bg-red-50 border-t border-b border-red-300' : ''
          }`} style={{ padding: '5px 0' }}>
            <CheckboxField name="conInterpretacion" label="Con interpretación" checked={formData.conInterpretacion} onChange={() => handleInterpretacionChange('conInterpretacion')} color="lightblue" textColor="blue" 
              hasError={showValidation && hasTomografia3D && !interpretacionValid} />
            <CheckboxField name="sinInterpretacion" label="Sin interpretación" checked={formData.sinInterpretacion} onChange={() => handleInterpretacionChange('sinInterpretacion')} color="lightblue" textColor="blue"
              hasError={showValidation && hasTomografia3D && !interpretacionValid} />
          </div>
          
          {/* Purpose - Optional */}
          <div style={{ padding: '0 10px 10px 10px' }}>
            <p className="text-center font-bold text-[#0b5b8a]" style={{ fontSize: '12px', marginBottom: '4px' }}>
              Indicar el propósito de la Tomografía <span className="text-gray-400 font-normal">(opcional)</span>
            </p>
            <textarea
              name="propositoTomografia"
              value={formData.propositoTomografia}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded outline-none resize-none"
              style={{ fontSize: '11px', padding: '6px', minHeight: '32px' }}
            />
          </div>
        </div>

        {/* Estudio de Ortodoncia Section - Orange lines/boxes, dark blue text */}
        <div style={{ marginBottom: '10px' }}>
          <div className="bg-[#e56c1a]" style={{ height: '2px', marginBottom: '-10px' }}></div>
          <div className="flex justify-center" style={{ marginBottom: '8px' }}>
            <span className="font-bold text-white bg-[#e56c1a] rounded" style={{ fontSize: '13px', padding: '4px 15px' }}>
              Estudio de Ortodoncia <span className="text-gray-200 font-normal">(opcional)</span>
            </span>
          </div>
          <div className="flex justify-center gap-5" style={{ marginBottom: '5px' }}>
            <CheckboxField name="ortodonciaPanoramica" label="Panorámica" checked={formData.ortodonciaPanoramica} onChange={handleInputChange} color="orange" textColor="darkblue" />
            <CheckboxField name="ortodonciaLateralCraneo" label="Lateral de cráneo" checked={formData.ortodonciaLateralCraneo} onChange={handleInputChange} color="orange" textColor="darkblue" />
            <CheckboxField name="ortodonciaCefalometria" label="Cefalometría" checked={formData.ortodonciaCefalometria} onChange={handleInputChange} color="orange" textColor="darkblue" />
          </div>
          <div className={`flex justify-center gap-5 transition-all ${
            showValidation && ortodonciaTopSelected && !ortodonciaFotoValid ? 'bg-red-50 py-1 rounded' : ''
          }`} style={{ marginBottom: '5px' }}>
            <CheckboxField name="ortodonciaConFoto" label="Con Foto" checked={formData.ortodonciaConFoto} onChange={() => handleOrtodonciaFotoChange('ortodonciaConFoto')} color="orange" textColor="darkblue" 
              hasError={showValidation && ortodonciaTopSelected && !ortodonciaFotoValid} />
            <CheckboxField name="ortodonciaSinFoto" label="Sin Foto" checked={formData.ortodonciaSinFoto} onChange={() => handleOrtodonciaFotoChange('ortodonciaSinFoto')} color="orange" textColor="darkblue"
              hasError={showValidation && ortodonciaTopSelected && !ortodonciaFotoValid} />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0b5b8a] text-center" style={{ padding: '8px', marginTop: '5px' }}>
          <p className="text-white font-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            "IMÁGENES PRECISAS, DIAGNÓSTICOS CONFIABLES"
          </p>
        </div>
      </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Number Input Component
const NumberInput = ({ name, value, onChange, placeholder, width, center, maxLength, hasError = false }) => (
  <div style={{ width }}>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full bg-transparent outline-none text-gray-800 ${hasError ? 'animate-pulse' : ''}`}
      style={{ fontSize: '12px', textAlign: center ? 'center' : 'left', paddingBottom: '2px' }}
    />
    <div className={hasError ? 'bg-red-500' : 'bg-gray-400'} style={{ height: '1px' }}></div>
  </div>
);

// Checkbox Field Component with color options
const CheckboxField = ({ name, label, checked, onChange, small = false, color = 'darkblue', textColor = 'gray', hasError = false }) => {
  const getCheckboxColor = () => {
    if (checked) {
      switch (color) {
        case 'lightblue': return 'bg-[#12c3cc] border-[#12c3cc]';
        case 'darkblue': return 'bg-[#0b5b8a] border-[#0b5b8a]';
        case 'orange': return 'bg-[#e56c1a] border-[#e56c1a]';
        default: return 'bg-[#0b5b8a] border-[#0b5b8a]';
      }
    }
    switch (color) {
      case 'lightblue': return 'bg-white border-[#12c3cc]';
      case 'darkblue': return 'bg-white border-[#0b5b8a]';
      case 'orange': return 'bg-white border-[#e56c1a]';
      default: return 'bg-white border-gray-500';
    }
  };

  const getTextColor = () => {
    switch (textColor) {
      case 'blue': return 'text-[#0b5b8a]';
      case 'darkblue': return 'text-[#0b3d5e]';
      case 'black': return 'text-black';
      default: return 'text-gray-700';
    }
  };

  return (
    <label className={`flex items-center cursor-pointer ${hasError ? 'animate-pulse' : ''}`} style={{ marginBottom: '4px', gap: '6px' }}>
      <div 
        className={`flex items-center justify-center border ${getCheckboxColor()} ${hasError ? 'ring-2 ring-red-500' : ''}`}
        style={{ width: '10px', height: '10px' }}
      >
        {checked && <span className="text-white" style={{ fontSize: '9px', lineHeight: 1 }}>✓</span>}
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="hidden" />
      <span className={getTextColor()} style={{ fontSize: small ? '10px' : '12px' }}>{label}</span>
    </label>
  );
};

// Checklist Item Component for tooltip
const ChecklistItem = ({ label, isValid, indent = false }) => (
  <div className={`flex items-center gap-2 ${indent ? 'ml-3' : ''}`}>
    {isValid ? (
      <Check size={12} className="text-green-400 flex-shrink-0" />
    ) : (
      <X size={12} className="text-red-400 flex-shrink-0" />
    )}
    <span className={isValid ? 'text-gray-300' : 'text-white'}>{label}</span>
  </div>
);

export default SolicitudEstudio;
