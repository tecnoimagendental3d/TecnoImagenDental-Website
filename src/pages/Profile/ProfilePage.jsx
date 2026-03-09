import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, User, Mail, Stethoscope, Phone, Tag, Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import InputField from '../../components/ui/InputField';
import TextareaField from '../../components/ui/TextareaField';

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    doctorName: '',
    specialties: '',
    phone: '',
  });

  // Helper to get full avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('data:')) return avatarPath;
    return `${BASE_URL}${avatarPath}`;
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        doctorName: user.doctorName || user.businessName || '',
        specialties: user.specialties || user.address || '',
        phone: user.phone || '',
      });
      if (user.avatar) {
        setAvatarPreview(getAvatarUrl(user.avatar));
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB.');
        return;
      }

    // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
      setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

    // Upload the avatar
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update user context with new avatar
      updateUser({ avatar: response.data.avatar });
      setAvatarPreview(getAvatarUrl(response.data.avatar));
      toast.success('¡Foto de perfil actualizada!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Error al subir la imagen.');
      // Revert preview on error
      if (user?.avatar) {
        setAvatarPreview(getAvatarUrl(user.avatar));
      } else {
        setAvatarPreview(null);
      }
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.avatar) {
      setAvatarPreview(null);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await axiosInstance.delete(API_PATHS.AUTH.DELETE_AVATAR);
      updateUser({ avatar: '' });
      setAvatarPreview(null);
      toast.success('Foto de perfil eliminada');
    } catch (error) {
      toast.error('Error al eliminar la imagen.');
    } finally {
      setIsUploadingAvatar(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      }
    }
  };

  const handleImageClick = () => {
    if (!isUploadingAvatar) {
    fileInputRef.current?.click();
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Map form fields to API fields
      const dataToSend = {
        name: formData.name,
        businessName: formData.doctorName,
        address: formData.specialties,
        phone: formData.phone,
      };
      
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, dataToSend);
      updateUser(response.data);
      toast.success('¡Perfil actualizado exitosamente!');
    } catch (error) {
      toast.error('Error al actualizar el perfil.');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-teal" />
      </div>
    );
  }

  return (
     <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-semibold text-primary-dark">Mi Perfil</h3>
      </div>
      
      <form onSubmit={handleUpdateProfile}>
        <div className="p-6 space-y-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center pb-6 border-b border-slate-200">
            <label className="block text-sm font-medium text-primary-dark mb-4">Foto de Perfil</label>
            <div className="relative">
              <div 
                onClick={handleImageClick}
                className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200 group ${
                  isUploadingAvatar 
                    ? 'border-primary-teal/50 cursor-wait' 
                    : 'border-primary-teal/20 hover:border-primary-teal cursor-pointer'
                }`}
              >
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary-teal flex items-center justify-center">
                    <User className="w-12 h-12 text-white opacity-70" />
                  </div>
                )}
                
                {/* Overlay */}
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                )}
              </div>
              
              {/* Remove Button */}
              {avatarPreview && !isUploadingAvatar && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              disabled={isUploadingAvatar}
            />
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              Haz clic en la imagen para cambiar. Máximo 5MB (JPG, PNG, WEBP)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">Dirección de Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                readOnly 
                value={user?.email || ''} 
                className="w-full h-10 pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 disabled:cursor-not-allowed" 
                disabled 
              />
            </div>
          </div>

          <InputField 
            label="Nombre Completo" 
            name="name" 
            icon={User} 
            type="text" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Ingresa tu nombre completo" 
          />
          
          <div className="pt-6 border-t border-slate-200">
            <h4 className="text-lg font-medium text-primary-dark">Información del Doctor</h4>
            <p className="text-sm text-primary-dark mt-1 mb-4">
              Esto se usará para prellenar la sección "Emitir Desde" de tus órdenes médicas.
            </p>
            <div className="space-y-4">
              <InputField 
                label="Nombre del Doctor" 
                name="doctorName" 
                icon={Stethoscope} 
                type="text" 
                value={formData.doctorName} 
                onChange={handleInputChange} 
                placeholder="Dr. Juan Pérez" 
              />
              <TextareaField 
                label="Especialidades" 
                name="specialties" 
                icon={Tag} 
                value={formData.specialties} 
                onChange={handleInputChange} 
                placeholder="Odontología General, Ortodoncia, Implantes Dentales" 
              />
              <InputField 
                label="Teléfono" 
                name="phone" 
                icon={Phone} 
                type="tel" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="(+505) 8000 8000" 
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            type="submit" 
            disabled={isUpdating} 
            className="inline-flex items-center justify-center px-4 py-2 h-10 bg-primary-dark hover:bg-primary-teal text-white font-medium text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Check className="w-5 h-5 mr-2" />}
            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
