import { ChevronDown, Shield, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  role,
  onLogout,
  showHomeLink = false,
}) => {
  const navigate = useNavigate();

  // Helper to get full avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    if (avatarPath.startsWith('data:')) return avatarPath;
    return `${BASE_URL}${avatarPath}`;
  };

  const avatarUrl = getAvatarUrl(avatar);
  const isAdmin = role === 'admin';

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl transition-colors duration-200 hover:bg-gray-50"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-9 w-9 object-cover rounded-xl"
          />
        ) : (
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
            isAdmin 
              ? 'bg-gradient-to-br from-purple-600 to-purple-400' 
              : 'bg-gradient-to-br from-primary-dark to-primary-teal'
          }`}>
            <span className="text-white font-semibold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-gray-900">{companyName}</p>
            {isAdmin && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border py-2 z-50 bg-white border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{companyName}</p>
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          {/* Home Link (shown in admin dashboard) */}
          {showHomeLink && (
            <a
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer text-gray-700 hover:bg-gray-50"
            >
              <Home className="w-4 h-4" />
              Home
            </a>
          )}

          {/* Admin Dashboard Link */}
          {isAdmin && (
            <a
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer text-purple-700 hover:bg-purple-50"
            >
              <Shield className="w-4 h-4" />
              Panel de Administración
            </a>
          )}

          <a
            onClick={() => navigate("/profile")}
            className="block px-4 py-2 text-sm transition-colors cursor-pointer text-gray-700 hover:bg-gray-50"
          >
            Ver Perfil
          </a>
          <div className="border-t mt-2 pt-2 border-gray-100">
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm transition-colors text-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
