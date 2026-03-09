import { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU, ADMIN_NAVIGATION_MENU } from "../../utils/data";
import LOGO from "../../assets/Logo/Logo-Horizontal01.png";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-primary-teal/10 text-primary-dark shadow-sm shadow-primary-teal/20"
          : "text-gray-600 hover:bg-primary-teal/5 hover:text-primary-dark"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-primary-teal" : "text-gray-500 group-hover:text-primary-teal"
        }`}
      />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
};

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Determine active menu item from current location
  const getActiveNavItem = () => {
    if (activeMenu) return activeMenu;
    const path = location.pathname.replace(/^\//, "");
    // Match exact route or parent route in regular menu
    const menuItem = NAVIGATION_MENU.find(
      (item) => path === item.id || path.startsWith(item.id + "/")
    );
    if (menuItem) return menuItem.id;
    
    // Check admin menu
    const adminMenuItem = ADMIN_NAVIGATION_MENU.find(
      (item) => path === item.id || path.startsWith(item.id + "/")
    );
    return adminMenuItem ? adminMenuItem.id : "dashboard";
  };

  const activeNavItem = getActiveNavItem();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white border-gray-200 border-r`}
      >
        {/* Company Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 px-6">
          <Link className="flex items-center" to="/dashboard">
            <img 
              src={LOGO} 
              alt="Logo" 
              className={`transition-all duration-300 ${sidebarCollapsed ? "h-9 w-auto" : "h-12 w-auto"}`}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
          
          {/* Admin Navigation */}
          {user?.role === 'admin' && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200">
                {!sidebarCollapsed && (
                  <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Administración
                  </p>
                )}
                {ADMIN_NAVIGATION_MENU.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    isActive={activeNavItem === item.id}
                    onClick={handleNavigation}
                    isCollapsed={sidebarCollapsed}
                  />
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-primary-teal/5 hover:text-primary-dark"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-primary-teal" />
            {!sidebarCollapsed && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10 bg-opacity-25"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top navbar */}
        <header className="bg-white/80 border-gray-200 backdrop-blur-sm border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl transition-colors duration-200 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}
            <div>
              <h1 className="text-base font-semibold text-primary-dark">
                ¡Bienvenido de vuelta, {user?.name}!
              </h1>
              <p className="text-sm hidden sm:block text-gray-600">
                Aquí está el resumen de tus órdenes médicas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Profile dropdown */}
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
              showHomeLink={location.pathname.startsWith('/admin')}
            />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
