import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Loader2,
  Trash2,
  Edit,
  FileText,
  Plus,
  AlertCircle,
  Mail,
  Calendar,
  User,
  ClipboardList,
  Check,
  X,
  Eye,
  Phone,
  Archive,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  RotateCcw
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import ReminderModal from "../../components/invoices/ReminderModal";

// ==================== TAB BUTTON ====================
const TabButton = ({ active, onClick, children, count, color = "teal" }) => {
  const colorClasses = {
    teal: active ? "bg-primary-teal text-white" : "text-gray-600 hover:bg-gray-100",
    amber: active ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100",
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${colorClasses[color]}`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? "bg-white/20" : "bg-gray-200"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// ==================== INVOICES TAB ====================
const InvoicesTab = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.INVOICE.GET_ALL_INVOICES);
      setInvoices(response.data.sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)));
    } catch (err) {
      setError("Error al cargar las órdenes médicas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta orden médica?")) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter((inv) => inv._id !== id));
        toast.success("Orden eliminada");
      } catch (err) {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id);
    try {
      const newStatus = invoice.status === "Confirmado" ? "No confirmado" : "Confirmado";
      const response = await axiosInstance.put(API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id), { ...invoice, status: newStatus });
      setInvoices(invoices.map((inv) => (inv._id === invoice._id ? response.data : inv)));
      toast.success(`Estado: ${newStatus}`);
    } catch (err) {
      toast.error("Error al cambiar estado");
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (searchTerm) {
        const name = invoice.billTo?.clientName?.toLowerCase() || "";
        if (!name.includes(searchTerm.toLowerCase())) return false;
      }
      if (dateFilter) {
        const date = moment(invoice.invoiceDate).format("YYYY-MM-DD");
        if (date !== dateFilter) return false;
      }
      return true;
    });
  }, [invoices, searchTerm, dateFilter]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-teal" /></div>;
  }

  return (
    <div className="space-y-4">
      <ReminderModal isOpen={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} invoiceId={selectedInvoiceId} />
      
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            className="h-10 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate("/workspace/new")} icon={Plus}>
          Nueva Orden
        </Button>
      </div>

      {/* Table */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{invoices.length === 0 ? "No hay órdenes médicas" : "Sin resultados"}</p>
          {invoices.length === 0 && (
            <Button onClick={() => navigate("/workspace/new")} icon={Plus}>Crear Primera Orden</Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 cursor-pointer" onClick={() => navigate(`/workspace/${invoice._id}`)}>
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 cursor-pointer" onClick={() => navigate(`/workspace/${invoice._id}`)}>
                      {invoice.billTo.clientName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">${invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{moment(invoice.dueDate).format("DD/MM/YYYY")}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "Confirmado" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {invoice.status === "Confirmado" ? "Confirmado" : "No confirmado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStatusChange(invoice)}
                          disabled={statusChangeLoading === invoice._id}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                        >
                          {statusChangeLoading === invoice._id ? <Loader2 className="w-3 h-3 animate-spin" /> : invoice.status === "Confirmado" ? "Desconfirmar" : "Confirmar"}
                        </button>
                        <button onClick={() => navigate(`/workspace/${invoice._id}`)} className="p-1.5 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(invoice._id)} className="p-1.5 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                        {invoice.status !== "Confirmado" && (
                          <button onClick={() => { setSelectedInvoiceId(invoice._id); setIsReminderModalOpen(true); }} className="p-1.5 hover:bg-blue-50 rounded">
                            <Mail className="w-4 h-4 text-blue-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== SOLICITUDES TAB ====================
const ITEMS_PER_PAGE = 8;

const SolicitudesTab = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSolicitudes();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await axiosInstance.get(API_PATHS.SOLICITUD.GET_ALL, { params });
      setSolicitudes(response.data);
    } catch (error) {
      toast.error("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(solicitudes.length / ITEMS_PER_PAGE);
  const paginatedSolicitudes = solicitudes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await axiosInstance.put(API_PATHS.SOLICITUD.ACCEPT(id));
      await axiosInstance.post(API_PATHS.PATIENT.CREATE_FROM_SOLICITUD(id));
      toast.success("Solicitud aceptada");
      fetchSolicitudes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await axiosInstance.put(API_PATHS.SOLICITUD.REJECT(id), { reason: rejectReason });
      toast.success("Solicitud rechazada");
      fetchSolicitudes();
      setShowRejectModal(null);
      setRejectReason("");
    } catch (error) {
      toast.error("Error al rechazar");
    } finally {
      setProcessingId(null);
    }
  };

  const handleArchive = async (id) => {
    setProcessingId(id);
    try {
      await axiosInstance.put(API_PATHS.SOLICITUD.ARCHIVE(id));
      toast.success("Solicitud archivada");
      fetchSolicitudes();
    } catch (error) {
      toast.error("Error al archivar");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestore = async (id) => {
    setProcessingId(id);
    try {
      await axiosInstance.put(API_PATHS.SOLICITUD.RESTORE(id));
      toast.success("Solicitud restaurada");
      fetchSolicitudes();
    } catch (error) {
      toast.error("Error al restaurar");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
      accepted: { label: "Aceptada", color: "bg-emerald-100 text-emerald-700" },
      rejected: { label: "Rechazada", color: "bg-red-100 text-red-700" },
      archived: { label: "Archivada", color: "bg-gray-100 text-gray-600" },
    };
    const { label, color } = config[status] || config.pending;
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-teal" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {[
            { value: "pending", label: "Pendientes", icon: ClipboardList },
            { value: "accepted", label: "Aceptadas", icon: Check },
            { value: "rejected", label: "Rechazadas", icon: X },
            { value: "archived", label: "Archivadas", icon: Archive },
            { value: "all", label: "Todas", icon: Filter },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors ${
                statusFilter === value ? "bg-white shadow-sm text-primary-teal" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <button onClick={fetchSolicitudes} className="p-2 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* List */}
      {solicitudes.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay solicitudes {statusFilter !== "all" && `(${statusFilter})`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedSolicitudes.map((sol) => (
            <div key={sol._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === sol._id ? null : sol._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-teal/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{sol.patientName}</p>
                      <p className="text-sm text-gray-500">{sol.email || sol.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(sol.status)}
                    <span className="text-xs text-gray-400">{moment(sol.createdAt).format("DD/MM/YY")}</span>
                  </div>
                </div>
              </div>

              {expandedId === sol._id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                    {sol.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{sol.phone}</span>
                      </div>
                    )}
                    {sol.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{sol.email}</span>
                      </div>
                    )}
                    {sol.preferredDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{moment(sol.preferredDate).format("DD/MM/YYYY")}</span>
                      </div>
                    )}
                    {sol.studyType && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{sol.studyType}</span>
                      </div>
                    )}
                  </div>
                  {sol.notes && (
                    <p className="text-sm text-gray-600 mb-4 p-2 bg-white rounded border">{sol.notes}</p>
                  )}
                  {sol.rejectionReason && (
                    <p className="text-sm text-red-600 mb-4 p-2 bg-red-50 rounded border border-red-200">
                      <strong>Razón:</strong> {sol.rejectionReason}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {sol.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAccept(sol._id)}
                          disabled={processingId === sol._id}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {processingId === sol._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Aceptar
                        </button>
                        <button
                          onClick={() => setShowRejectModal(sol._id)}
                          disabled={processingId === sol._id}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          Rechazar
                        </button>
                      </>
                    )}
                    {sol.status !== "archived" && sol.status !== "pending" && (
                      <button
                        onClick={() => handleArchive(sol._id)}
                        disabled={processingId === sol._id}
                        className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archivar
                      </button>
                    )}
                    {sol.status === "archived" && (
                      <button
                        onClick={() => handleRestore(sol._id)}
                        disabled={processingId === sol._id}
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restaurar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Razón del rechazo (opcional)"
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-primary-teal/20"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectReason(""); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={processingId === showRejectModal}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {processingId === showRejectModal ? "Rechazando..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const Workspace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "orders");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SOLICITUD.GET_PENDING_COUNT);
      setPendingCount(response.data.count);
    } catch (e) {
      console.log("Could not fetch pending count");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Área de Trabajo</h1>
          <p className="text-gray-600 mt-1">Gestiona órdenes médicas y solicitudes de estudio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <TabButton active={activeTab === "orders"} onClick={() => handleTabChange("orders")}>
          <FileText className="w-4 h-4" />
          Órdenes Médicas
        </TabButton>
        <TabButton active={activeTab === "solicitudes"} onClick={() => handleTabChange("solicitudes")} count={pendingCount} color={pendingCount > 0 ? "amber" : "teal"}>
          <ClipboardList className="w-4 h-4" />
          Solicitudes
        </TabButton>
      </div>

      {/* Content */}
      {activeTab === "orders" && <InvoicesTab />}
      {activeTab === "solicitudes" && <SolicitudesTab />}
    </div>
  );
};

export default Workspace;


