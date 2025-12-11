import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Loader2, FileText, Plus, Users, Image, ClipboardList, ChevronRight, Calendar, Briefcase } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import Button from "../../components/ui/Button";

const StatCard = ({ icon: Icon, label, value, color, link }) => {
  const colorClasses = {
    blue: { bg: "bg-primary-teal/10", text: "text-primary-teal" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    amber: { bg: "bg-amber-100", text: "text-amber-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };

  const Content = () => (
    <div className={`p-5 rounded-xl border shadow-sm bg-white border-gray-200 hover:shadow-md transition-all ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colorClasses[color].text}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
        {link && <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
    </div>
  );

  if (link) {
    return <Link to={link}><Content /></Link>;
  }
  return <Content />;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalOrders: 0,
    totalImages: 0,
    pendingSolicitudes: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch invoices/orders
        const invoiceResponse = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
        const orders = invoiceResponse.data;

        // Fetch patients count
        let totalPatients = 0;
        try {
          const patientsResponse = await axiosInstance.get(API_PATHS.PATIENT.GET_ALL);
          totalPatients = patientsResponse.data.length;
        } catch (e) {
          console.log("Patients API not ready");
        }

        // Fetch pending solicitudes count
        let pendingSolicitudes = 0;
        try {
          const pendingResponse = await axiosInstance.get(API_PATHS.SOLICITUD.GET_PENDING_COUNT);
          pendingSolicitudes = pendingResponse.data.count;
        } catch (e) {
          console.log("Solicitudes API not ready");
        }

        // Fetch images count
        let totalImages = 0;
        try {
          const imagesResponse = await axiosInstance.get(API_PATHS.IMAGE.GET_ALL_IMAGES);
          totalImages = imagesResponse.data.length;
        } catch (e) {
          console.log("Images API not ready");
        }

        setStats({ 
          totalPatients, 
          totalOrders: orders.length,
          totalImages,
          pendingSolicitudes 
        });
        
        setRecentOrders(
          orders
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu actividad</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Pacientes"
          value={stats.totalPatients}
          color="blue"
        />
        <StatCard
          icon={FileText}
          label="Órdenes Médicas"
          value={stats.totalOrders}
          color="emerald"
          link="/workspace?tab=orders"
        />
        <StatCard
          icon={ClipboardList}
          label="Solicitudes Pendientes"
          value={stats.pendingSolicitudes}
          color="amber"
          link="/workspace?tab=solicitudes"
        />
        <StatCard
          icon={Image}
          label="Imágenes"
          value={stats.totalImages}
          color="purple"
          link="/imagenologia"
        />
      </div>

      {/* Alert for pending solicitudes */}
      {stats.pendingSolicitudes > 0 && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-amber-800">
                {stats.pendingSolicitudes} solicitud(es) pendiente(s)
              </p>
              <p className="text-sm text-amber-600">
                Hay solicitudes de estudio esperando tu revisión
              </p>
            </div>
          </div>
          <Link
            to="/workspace?tab=solicitudes"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
          >
            Revisar
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/workspace/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary-teal/5 hover:bg-primary-teal/10 transition-colors group"
            >
              <div className="p-2 bg-primary-teal/10 rounded-lg group-hover:bg-primary-teal/20">
                <Plus className="w-5 h-5 text-primary-teal" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Nueva Orden Médica</p>
                <p className="text-sm text-gray-500">Crear una orden para un paciente</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>

            <Link
              to="/workspace"
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
                <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
              <div>
                <p className="font-medium text-gray-800">Área de Trabajo</p>
                <p className="text-sm text-gray-500">Gestionar órdenes y solicitudes</p>
                </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>

            <Link
              to="/imagenologia"
              className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Subir Imagen</p>
                <p className="text-sm text-gray-500">Agregar nueva imagenología</p>
            </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Órdenes Recientes</h3>
            <Link to="/workspace" className="text-sm text-primary-teal hover:text-primary-dark font-medium flex items-center gap-1">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/workspace/${order._id}`)}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-teal/10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{order.billTo.clientName}</p>
                        <p className="text-sm text-gray-500">#{order.invoiceNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Confirmado" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status === "Confirmado" ? "Confirmado" : "Pendiente"}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {moment(order.invoiceDate).format("DD/MM/YY")}
                      </p>
                    </div>
                  </div>
                </div>
                ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
            </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Sin órdenes aún</h3>
              <p className="text-gray-500 mb-4 max-w-sm">
                Comienza creando tu primera orden médica
            </p>
              <Button onClick={() => navigate("/workspace/new")} icon={Plus}>
                Crear Orden
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
