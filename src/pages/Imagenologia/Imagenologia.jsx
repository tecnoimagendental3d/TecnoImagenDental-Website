import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Loader2,
  Trash2,
  Search,
  Plus,
  X,
  Download,
  Image as ImageIcon,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import TextareaField from "../../components/ui/TextareaField";
import { BASE_URL } from "../../utils/apiPaths";

const Imagenologia = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    image: null,
    patientName: "",
    description: "",
    date: moment().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    fetchImages();
  }, [searchTerm, dateFilter]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (dateFilter) params.append("date", dateFilter);

      const response = await axiosInstance.get(
        `${API_PATHS.IMAGE.GET_ALL_IMAGES}?${params.toString()}`
      );
      setImages(response.data);
    } catch (error) {
      toast.error("Error al cargar las imágenes.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Solo se permiten archivos JPG, JPEG y PNG.");
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 10MB.");
        return;
      }

      setUploadForm({ ...uploadForm, image: file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadForm.image) {
      toast.error("Por favor selecciona una imagen.");
      return;
    }

    if (!uploadForm.patientName.trim()) {
      toast.error("El nombre completo del paciente es obligatorio.");
      return;
    }

    if (!uploadForm.date) {
      toast.error("La fecha es obligatoria.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadForm.image);
      formData.append("patientName", uploadForm.patientName);
      formData.append("description", uploadForm.description);
      formData.append("date", uploadForm.date);

      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Imagen subida exitosamente.");
      setImages([response.data, ...images]);
      setIsUploadModalOpen(false);
      setUploadForm({
        image: null,
        patientName: "",
        description: "",
        date: moment().format("YYYY-MM-DD"),
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al subir la imagen."
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")
    ) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.IMAGE.DELETE_IMAGE(id));
      toast.success("Imagen eliminada exitosamente.");
      setImages(images.filter((img) => img._id !== id));
      setSelectedImages(selectedImages.filter((imgId) => imgId !== id));
      if (previewImage && previewImage._id === id) {
        setPreviewImage(null);
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen.");
      console.error(error);
    }
  };

  const handleDownload = async (image) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.IMAGE.DOWNLOAD_IMAGE(image._id),
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", image.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error al descargar la imagen.");
      console.error(error);
    }
  };

  const handleDownloadMultiple = async () => {
    if (selectedImages.length === 0) {
      toast.error("Por favor selecciona al menos una imagen.");
      return;
    }

    try {
      for (const imageId of selectedImages) {
        const image = images.find((img) => img._id === imageId);
        if (image) {
          await handleDownload(image);
          // Small delay to avoid overwhelming the browser
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }
      toast.success(`${selectedImages.length} imagen(es) descargada(s).`);
      setSelectedImages([]);
    } catch (error) {
      toast.error("Error al descargar las imágenes.");
      console.error(error);
    }
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const getImageUrl = (image) => {
    // For Vercel Blob, use the url directly; for legacy, construct from path
    if (image.url) {
      return image.url;
    }
    // Fallback for legacy images with path
    const imagePath = image.path?.startsWith('/') ? image.path : `/${image.path}`;
    return `${BASE_URL}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-dark">
            Imagenologia
          </h1>
          <p className="text-sm text-primary-dark mt-1">
            Gestiona todas tus imágenes médicas
          </p>
        </div>
        <div className="flex gap-2">
          {selectedImages.length > 0 && (
            <Button
              onClick={handleDownloadMultiple}
              icon={Download}
              variant="outline"
            >
              Descargar Seleccionadas ({selectedImages.length})
            </Button>
          )}
          <Button onClick={() => setIsUploadModalOpen(true)} icon={Plus}>
            Subir Imagen
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre del paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            />
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-primary-dark mb-2">
            No hay imágenes
          </h3>
          <p className="text-primary-dark mb-6 max-w-md mx-auto">
            Comienza subiendo tu primera imagen médica.
          </p>
          <Button onClick={() => setIsUploadModalOpen(true)} icon={Plus}>
            Subir Imagen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={getImageUrl(image)}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                  onClick={() => setPreviewImage(image)}
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageSelection(image._id);
                    }}
                    className={`p-2 rounded-lg ${
                      selectedImages.includes(image._id)
                        ? "bg-primary-teal text-white"
                        : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image._id);
                    }}
                    className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {selectedImages.includes(image._id) && (
                  <div className="absolute top-2 left-2 bg-primary-teal text-white p-1 rounded">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-teal rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-primary-dark truncate">
                    {image.patientName}
                  </p>
                </div>
                {image.description && (
                  <div className="flex items-start gap-2 mb-1">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {image.description}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    {moment(image.date).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center ml-[130px] bg-black/50 backdrop-blur-md" style={{ width: '100%', height: '100%' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-[65vh] overflow-hidden flex flex-col m-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-primary-dark to-primary-teal">
              <h2 className="text-xl font-bold text-white">
                Subir Imagen
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Form Content */}
            <form id="upload-form" onSubmit={handleUpload} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Imagen (JPG, JPEG, PNG) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-teal transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                    required
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-12 h-12 bg-primary-teal/10 rounded-full flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-primary-teal" />
                    </div>
                    <span className="text-sm text-gray-600 mb-1">
                      {uploadForm.image ? uploadForm.image.name : "Haz clic para seleccionar una imagen"}
                    </span>
                    <span className="text-xs text-gray-500">
                      JPG, JPEG o PNG (máx. 10MB)
                    </span>
                  </label>
                </div>
              </div>

              {/* Patient Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    label="Nombre Completo del Paciente *"
                    name="patientName"
                    value={uploadForm.patientName}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, patientName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={uploadForm.date}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all"
                    required
                  />
                </div>
              </div>

              {/* Description Section */}
              <div>
                <TextareaField
                  label="Descripción de Imagenologia"
                  name="description"
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

            </form>
            
            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-5 bg-gray-50 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <button
                type="submit"
                form="upload-form"
                disabled={uploading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-dark to-primary-teal hover:from-primary-teal hover:to-primary-dark text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Subiendo..." : "Subir Imagen"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full mx-4 max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-800" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={getImageUrl(previewImage)}
                alt={previewImage.originalName}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Paciente</p>
                    <p className="font-medium text-primary-dark">
                      {previewImage.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fecha</p>
                    <p className="font-medium text-primary-dark">
                      {moment(previewImage.date).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  {previewImage.description && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Descripción</p>
                      <p className="text-primary-dark">
                        {previewImage.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleDownload(previewImage)}
                    icon={Download}
                    variant="outline"
                  >
                    Descargar
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(previewImage._id);
                      setPreviewImage(null);
                    }}
                    icon={Trash2}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Imagenologia;

