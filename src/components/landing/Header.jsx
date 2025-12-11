import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";
import { useAuth } from "../../context/AuthContext";
import LOGO from "../../assets/Logo/Logo-Horizontal01.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {isAuthenticated, user, logout }  = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 relative">
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <img 
              src={LOGO} 
              alt="Logo" 
              className="h-12 sm:h-14 lg:h-16 transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
            />
          </Link>
          <div className="hidden lg:flex lg:items-center lg:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#mision"
              className="text-primary-dark hover:text-primary-teal font-medium transition-all duration-300 relative group hover:scale-105"
            >
              Misión
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#vision"
              className="text-primary-dark hover:text-primary-teal font-medium transition-all duration-300 relative group hover:scale-105"
            >
              Visión
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#nosotros"
              className="text-primary-dark hover:text-primary-teal font-medium transition-all duration-300 relative group hover:scale-105"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Link
              to="/solicitud-estudio"
              className="text-white bg-primary-teal hover:bg-primary-dark px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Solicitud de Estudio
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                role={user?.role || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-primary-dark hover:text-primary-teal font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  <span className="relative z-10">Iniciar Sesión</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-dark hover:bg-primary-teal text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-orange/50 relative overflow-hidden group"
                >
                  <span className="relative z-10">Crear Cuenta</span>
                  <span className="absolute inset-0 bg-primary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-primary-dark hover:text-primary-teal hover:bg-gray-100 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

       {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#mision"
              className="block px-4 py-3 text-primary-dark hover:text-primary-teal hover:bg-primary-teal/10 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
            >
              Misión
            </a>
            <a
              href="#vision"
              className="block px-4 py-3 text-primary-dark hover:text-primary-teal hover:bg-primary-teal/10 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
            >
              Visión
            </a>
            <a
              href="#nosotros"
              className="block px-4 py-3 text-primary-dark hover:text-primary-teal hover:bg-primary-teal/10 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
            >
              Nosotros
            </a>
            <Link
              to="/solicitud-estudio"
              className="block px-4 py-3 text-white bg-primary-teal hover:bg-primary-dark font-medium transition-all duration-300 rounded-lg text-center"
            >
              Solicitud de Estudio
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            {isAuthenticated ? (
              <div className="px-4 py-3 space-y-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-purple-700 hover:bg-purple-50 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
                  >
                    Panel de Administración
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-primary-dark hover:text-primary-teal hover:bg-primary-teal/10 font-medium transition-all duration-300 hover:translate-x-2 rounded-lg"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-left bg-primary-dark hover:bg-primary-teal text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Crear Cuenta</span>
                  <span className="absolute inset-0 bg-primary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
