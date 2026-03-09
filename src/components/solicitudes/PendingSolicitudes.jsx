import { useState, useEffect } from 'react';
import { Check, X, Eye, Loader2, User, Phone, Mail, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';

const PendingSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SOLICITUD.GET_ALL, {
        params: { status: 'pending' }
      });
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      // Accept the solicitud
      await axiosInstance.put(API_PATHS.SOLICITUD.ACCEPT(id));
      
      // Create patient from solicitud
      await axiosInstance.post(API_PATHS.PATIENT.CREATE_FROM_SOLICITUD(id));
      
      toast.success('Solicitud aceptada y paciente registrado');
      setSolicitudes(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      console.error('Error accepting solicitud:', error);
      toast.error(error.response?.data?.message || 'Error al aceptar solicitud');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await axiosInstance.put(API_PATHS.SOLICITUD.REJECT(id), {
        reason: rejectReason
      });
      
      toast.success('Solicitud rechazada');
      setSolicitudes(prev => prev.filter(s => s._id !== id));
      setShowRejectModal(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting solicitud:', error);
      toast.error(error.response?.data?.message || 'Error al rechazar solicitud');
    } finally {
      setProcessingId(null);
    }
  };

  const getSelectedStudies = (solicitud) => {
    const studies = [];
    
    // 2D Studies
    const rad2D = solicitud.radiografia2D || {};
    if (rad2D.panoramica) studies.push('Panorámica');
    if (rad2D.panoramicaDientesHD) studies.push('Panorámica HD');
    if (rad2D.lateralCraneo) studies.push('Lateral de cráneo');
    if (rad2D.apCraneo) studies.push('A-P de cráneo');
    if (rad2D.paCraneo) studies.push('P-A de cráneo');
    if (rad2D.atmBocaAbierta) studies.push('ATM Boca Abierta');
    if (rad2D.atmBocaCerrada) studies.push('ATM Boca Cerrada');
    if (rad2D.senosParanasales) studies.push('Senos Paranasales');
    if (rad2D.towneInversa) studies.push('Towne Inversa');
    if (rad2D.hirtz) studies.push('Hirtz');
    if (rad2D.caldwell) studies.push('Caldwell');
    if (rad2D.waters) studies.push('Waters');
    if (rad2D.cavum) studies.push('Cavum');
    if (rad2D.carpal) studies.push('Carpal');

    // 3D Studies
    const tomo3D = solicitud.tomografia3D || {};
    if (tomo3D.tomoCampoAmplio) studies.push('Tomo Campo Amplio');
    if (tomo3D.tomoBimaxilar) studies.push('Tomo Bimaxilar');
    if (tomo3D.tomoMaxilar) studies.push('Tomo Maxilar');
    if (tomo3D.tomoMandibular) studies.push('Tomo Mandibular');
    if (tomo3D.tomoViasAereas) studies.push('Tomo Vías Aéreas');
    if (tomo3D.tomoSenosParanasales) studies.push('Tomo Senos Paranasales');
    if (tomo3D.tomoAtmUnilateral) studies.push('Tomo ATM Unilateral');
    if (tomo3D.tomoAtmBilateral) studies.push('Tomo ATM Bilateral');
    if (tomo3D.tomoZona5x5) studies.push('Tomo Zona 5x5');

    // Ortodoncia
    const orto = solicitud.ortodoncia || {};
    if (orto.ortodonciaPanoramica) studies.push('Ortodoncia Panorámica');
    if (orto.ortodonciaLateralCraneo) studies.push('Ortodoncia Lateral');
    if (orto.ortodonciaCefalometria) studies.push('Cefalometría');

    return studies;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-teal" />
      </div>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No hay solicitudes pendientes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solicitudes.map(solicitud => (
        <div 
          key={solicitud._id} 
          className="border rounded-lg bg-white shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => setExpandedId(expandedId === solicitud._id ? null : solicitud._id)}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-teal/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-teal" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{solicitud.nombrePaciente}</h4>
                <p className="text-sm text-gray-500">
                  {moment(solicitud.createdAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                {getSelectedStudies(solicitud).length} estudios
              </span>
              <Eye className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === solicitud._id ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === solicitud._id && (
            <div className="border-t p-4 bg-gray-50">
              {/* Patient Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{solicitud.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{solicitud.correoElectronico}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    {moment(solicitud.fechaNacimiento).format('DD/MM/YYYY')} ({solicitud.edad} años)
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Sexo:</span> {solicitud.sexo}
                </div>
              </div>

              {/* Studies */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Estudios Solicitados:</h5>
                <div className="flex flex-wrap gap-2">
                  {getSelectedStudies(solicitud).map((study, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {study}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interpretation & Purpose */}
              {solicitud.tomografia3D && (
                <div className="mb-4 text-sm">
                  {solicitud.tomografia3D.conInterpretacion && (
                    <span className="text-green-600 mr-4">✓ Con interpretación</span>
                  )}
                  {solicitud.tomografia3D.sinInterpretacion && (
                    <span className="text-gray-600 mr-4">Sin interpretación</span>
                  )}
                  {solicitud.tomografia3D.propositoTomografia && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">Propósito:</span> {solicitud.tomografia3D.propositoTomografia}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRejectModal(solicitud._id);
                  }}
                  disabled={processingId === solicitud._id}
                  className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccept(solicitud._id);
                  }}
                  disabled={processingId === solicitud._id}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  {processingId === solicitud._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Aceptar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo del rechazo (opcional)..."
              className="w-full border rounded p-3 mb-4 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={processingId === showRejectModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {processingId === showRejectModal ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Confirmar Rechazo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSolicitudes;





