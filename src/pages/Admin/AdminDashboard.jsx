import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Search,
  Trash2,
  Phone,
  Building2,
  MoreVertical,
  UserCheck,
  UserX,
  Users,
  Edit,
  KeyRound,
  Eye,
  EyeOff,
  X,
  Archive,
  UserPlus,
  Shield
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

// ==================== MODALS ====================

// Create User Modal
const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    status: 'approved',
    businessName: '',
    phone: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '', email: '', password: '', role: 'doctor',
        status: 'approved', businessName: '', phone: '', address: '',
      });
      setErrors({});
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const dataToSend = { ...formData };
      if (dataToSend.role === 'admin') {
        delete dataToSend.businessName;
        delete dataToSend.phone;
        delete dataToSend.address;
        delete dataToSend.status;
      }
      await axiosInstance.post(API_PATHS.ADMIN.CREATE_USER, dataToSend);
      toast.success(`${formData.role === 'admin' ? 'Administrador' : 'Doctor'} creado exitosamente`);
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Crear Usuario</h2>
              <p className="text-sm text-gray-500">Agregar doctor o administrador</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center ${
                  formData.role === 'doctor' ? 'border-primary-teal bg-primary-teal/5 text-primary-teal' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                <User className="w-5 h-5" /><span className="font-medium">Doctor</span>
              </button>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center ${
                  formData.role === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                <Shield className="w-5 h-5" /><span className="font-medium">Admin</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre completo"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.name ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.email ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.password ? 'border-red-300' : 'border-gray-300'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {formData.role === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Inicial</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none">
                  <option value="approved">Aprobado</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
                <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Nombre del consultorio"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(+505) 8000-0000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Ciudad"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
                </div>
              </div>
            </>
          )}

          {formData.role === 'admin' && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700"><Shield className="w-4 h-4 inline mr-1" />Los administradores tienen acceso completo al panel.</p>
            </div>
          )}
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100">Cancelar</button>
          <button onClick={handleSubmit} disabled={isLoading}
            className={`flex-1 py-2.5 px-4 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${formData.role === 'admin' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {isLoading ? 'Creando...' : `Crear ${formData.role === 'admin' ? 'Admin' : 'Doctor'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit User Modal
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', businessName: '', phone: '', address: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', email: user.email || '', password: '',
        businessName: user.businessName || '', phone: user.phone || '', address: user.address || '',
      });
      setErrors({});
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Requerido';
    if (!formData.email.trim()) newErrors.email = 'Requerido';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;
      await axiosInstance.put(API_PATHS.ADMIN.UPDATE_USER(user._id), dataToSend);
      toast.success('Usuario actualizado');
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-teal/10 rounded-xl"><Edit className="w-5 h-5 text-primary-teal" /></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Editar Usuario</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {user.passwordResetRequested && (
          <div className="mx-6 mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-700 font-medium">Solicitó cambio de contraseña</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input name="name" value={formData.name} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.name ? 'border-red-300' : 'border-gray-300'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.email ? 'border-red-300' : 'border-gray-300'}`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña {user.passwordResetRequested && <span className="text-orange-600">(Solicitada)</span>}
            </label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                placeholder="Dejar vacío para no cambiar"
                className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none ${errors.password ? 'border-red-300' : 'border-gray-300'}`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultorio</label>
            <input name="businessName" value={formData.businessName} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input name="address" value={formData.address} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal outline-none" />
            </div>
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100">Cancelar</button>
          <button onClick={handleSubmit} disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-primary-teal text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTS ====================

const StatCard = ({ title, value, icon: Icon, color, active, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <button onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all text-left w-full ${active ? 'ring-2 ring-primary-teal border-primary-teal' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    approved: { label: 'Aprobado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    rejected: { label: 'Rechazado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    archived: { label: 'Archivado', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Archive },
  };
  const { label, color, icon: Icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
};

const UserCard = ({ doctor, onEdit, onChangeStatus, onDelete, processingId }) => {
  const [showActions, setShowActions] = useState(false);
  const isProcessing = processingId === doctor._id;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

  const getAvailableStatusActions = () => {
    const actions = [];
    if (doctor.status !== 'approved') actions.push({ status: 'approved', label: 'Aprobar', icon: UserCheck, color: 'text-emerald-600 hover:bg-emerald-50' });
    if (doctor.status !== 'pending') actions.push({ status: 'pending', label: 'Pendiente', icon: Clock, color: 'text-amber-600 hover:bg-amber-50' });
    if (doctor.status !== 'rejected') actions.push({ status: 'rejected', label: 'Rechazar', icon: UserX, color: 'text-red-600 hover:bg-red-50' });
    if (doctor.status !== 'archived') actions.push({ status: 'archived', label: 'Archivar', icon: Archive, color: 'text-gray-600 hover:bg-gray-50' });
    return actions;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all ${doctor.passwordResetRequested ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${doctor.passwordResetRequested ? 'bg-orange-100' : 'bg-primary-teal/10'}`}>
            {doctor.passwordResetRequested ? <KeyRound className="w-5 h-5 text-orange-600" /> : <User className="w-5 h-5 text-primary-teal" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-800 truncate">{doctor.name}</h3>
              <StatusBadge status={doctor.status} />
              {doctor.passwordResetRequested && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700">
                  <KeyRound className="w-2.5 h-2.5" />PASS
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
              <Mail className="w-3.5 h-3.5" /><span className="truncate">{doctor.email}</span>
            </div>
            {(doctor.phone || doctor.businessName) && (
              <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
                {doctor.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{doctor.phone}</span>}
                {doctor.businessName && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{doctor.businessName}</span>}
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              <Calendar className="w-3 h-3 inline mr-1" />{formatDate(doctor.createdAt)}
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <button onClick={() => setShowActions(!showActions)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 top-8 z-20 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button onClick={() => { onEdit(doctor); setShowActions(false); }} disabled={isProcessing}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-teal hover:bg-primary-teal/5 disabled:opacity-50">
                  <Edit className="w-4 h-4" />Editar
                </button>
                <div className="border-t border-gray-100 my-1" />
                {getAvailableStatusActions().map((action) => (
                  <button key={action.status} onClick={() => { onChangeStatus(doctor._id, action.status, doctor.name); setShowActions(false); }}
                    disabled={isProcessing} className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${action.color} disabled:opacity-50`}>
                    <action.icon className="w-4 h-4" />{action.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1" />
                <button onClick={() => { onDelete(doctor._id, doctor.name); setShowActions(false); }} disabled={isProcessing}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick actions for pending or password reset */}
      {(doctor.status === 'pending' || doctor.passwordResetRequested) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {doctor.passwordResetRequested && (
            <button onClick={() => onEdit(doctor)} disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-sm font-medium disabled:opacity-50">
              <KeyRound className="w-3.5 h-3.5" />Cambiar Pass
            </button>
          )}
          {doctor.status === 'pending' && (
            <>
              <button onClick={() => onChangeStatus(doctor._id, 'rejected', doctor.name)} disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}Rechazar
              </button>
              <button onClick={() => onChangeStatus(doctor._id, 'approved', doctor.name)} disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 text-sm font-medium disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}Aprobar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_DOCTORS);
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChangeStatus = async (id, newStatus, name) => {
    const labels = { pending: 'pendiente', approved: 'aprobado', rejected: 'rechazado', archived: 'archivado' };
    if (newStatus === 'rejected' || newStatus === 'archived') {
      if (!window.confirm(`¿${newStatus === 'rejected' ? 'Rechazar' : 'Archivar'} a ${name}?`)) return;
    }
    try {
      setProcessingId(id);
      await axiosInstance.put(API_PATHS.ADMIN.CHANGE_STATUS(id), { status: newStatus });
      toast.success(`${name} marcado como ${labels[newStatus]}`);
      setDoctors(prev => prev.map(doc => doc._id === id ? { ...doc, status: newStatus } : doc));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar estado');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar permanentemente a ${name}?`)) return;
    try {
      setProcessingId(id);
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(id));
      toast.success(`${name} eliminado`);
      setDoctors(prev => prev.filter(doc => doc._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    } finally {
      setProcessingId(null);
    }
  };

  // Stats
  const counts = {
    all: doctors.length,
    pending: doctors.filter(d => d.status === 'pending').length,
    approved: doctors.filter(d => d.status === 'approved').length,
    rejected: doctors.filter(d => d.status === 'rejected').length,
    archived: doctors.filter(d => d.status === 'archived').length,
    passwordReset: doctors.filter(d => d.passwordResetRequested).length,
  };

  // Filter
  const filteredDoctors = doctors
    .filter(doc => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'passwordReset') return doc.passwordResetRequested;
      return doc.status === activeFilter;
    })
    .filter(doc => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return doc.name.toLowerCase().includes(q) || doc.email.toLowerCase().includes(q) || (doc.businessName && doc.businessName.toLowerCase().includes(q));
    });

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-primary-teal" /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchDoctors} className="flex items-center gap-2 px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-dark">
          <RefreshCw className="w-4 h-4" />Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Gestiona usuarios, aprobaciones y contraseñas</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchDoctors} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Actualizar</span>
          </button>
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <UserPlus className="w-4 h-4" /><span className="hidden sm:inline">Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Total" value={counts.all} icon={Users} color="blue" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
        <StatCard title="Pendientes" value={counts.pending} icon={Clock} color="amber" active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')} />
        <StatCard title="Aprobados" value={counts.approved} icon={UserCheck} color="green" active={activeFilter === 'approved'} onClick={() => setActiveFilter('approved')} />
        <StatCard title="Rechazados" value={counts.rejected} icon={UserX} color="red" active={activeFilter === 'rejected'} onClick={() => setActiveFilter('rejected')} />
        <StatCard title="Archivados" value={counts.archived} icon={Archive} color="gray" active={activeFilter === 'archived'} onClick={() => setActiveFilter('archived')} />
        {counts.passwordReset > 0 && (
          <StatCard title="Contraseñas" value={counts.passwordReset} icon={KeyRound} color="orange" active={activeFilter === 'passwordReset'} onClick={() => setActiveFilter('passwordReset')} />
        )}
      </div>

      {/* Alerts */}
      {counts.pending > 0 && activeFilter !== 'pending' && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{counts.pending} usuario(s) pendiente(s) de aprobación</span>
          </div>
          <button onClick={() => setActiveFilter('pending')} className="text-sm text-amber-700 font-medium hover:underline">Ver</button>
        </div>
      )}

      {counts.passwordReset > 0 && activeFilter !== 'passwordReset' && (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-700">
            <KeyRound className="w-4 h-4" />
            <span className="text-sm font-medium">{counts.passwordReset} solicitud(es) de cambio de contraseña</span>
          </div>
          <button onClick={() => setActiveFilter('passwordReset')} className="text-sm text-orange-700 font-medium hover:underline">Ver</button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Buscar por nombre, email o consultorio..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal" />
      </div>

      {/* User Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">{searchQuery ? 'Sin resultados' : 'No hay usuarios'}</h3>
          <p className="text-gray-500">{searchQuery ? 'Intenta otro término' : activeFilter === 'passwordReset' ? 'No hay solicitudes de contraseña' : 'No hay usuarios en esta categoría'}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <UserCard key={doctor._id} doctor={doctor} onEdit={setEditingUser} onChangeStatus={handleChangeStatus} onDelete={handleDelete} processingId={processingId} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-sm text-gray-500 text-center">
        Mostrando <strong>{filteredDoctors.length}</strong> de <strong>{doctors.length}</strong> usuarios
      </div>

      {/* Modals */}
      <EditUserModal isOpen={!!editingUser} onClose={() => setEditingUser(null)} user={editingUser} onSave={fetchDoctors} />
      <CreateUserModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={fetchDoctors} />
    </div>
  );
};

export default AdminDashboard;


