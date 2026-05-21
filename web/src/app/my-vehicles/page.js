"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Car, Plus, Trash2, Edit2, AlertCircle, Calendar, ShieldCheck, FileText, Save, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function MyVehiclesPage() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]);
  const [fetching, setFetching] = useState(true);
  
  // Modal/Form states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    photoDataUrl: '',
    licensePlate: '',
    vtvExpiry: '',
    insuranceVerified: false,
    extraNotes: ''
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const fetchVehicles = async () => {
    try {
      setFetching(true);
      const res = await api.get('/vehicles');
      setVehicles(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('No pudimos cargar tus vehículos. Reintentá más tarde.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [isAuthenticated]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear().toString(),
      color: '',
      photoDataUrl: '',
      licensePlate: '',
      vtvExpiry: '',
      insuranceVerified: false,
      extraNotes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (vehicle) => {
    setIsEditing(true);
    setCurrentId(vehicle._id);
    setFormData({
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      color: vehicle.color || '',
      photoDataUrl: vehicle.photoDataUrl || '',
      licensePlate: vehicle.licensePlate || '',
      vtvExpiry: vehicle.vtvExpiry ? new Date(vehicle.vtvExpiry).toISOString().split('T')[0] : '',
      insuranceVerified: !!vehicle.insuranceVerified,
      extraNotes: vehicle.extraNotes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que querés eliminar este vehículo?')) return;
    
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehículo eliminado con éxito.');
      fetchVehicles();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Error al eliminar el vehículo.';
      toast.error(message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800000) {
      toast.error('Elegí una imagen más liviana (máximo 800 KB)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((f) => ({ ...f, photoDataUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photoDataUrl) {
      toast.error('La foto del vehículo es obligatoria.');
      return;
    }
    if (!formData.licensePlate.trim()) {
      toast.error('La patente del vehículo es obligatoria.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await api.patch(`/vehicles/${currentId}`, formData);
        toast.success('Vehículo actualizado con éxito.');
      } else {
        await api.post('/vehicles', formData);
        toast.success('Vehículo registrado con éxito.');
      }
      setShowModal(false);
      fetchVehicles();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Error al guardar los datos del vehículo.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen theme-bg py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con botón para volver y título */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/profile')}
              className="h-10 w-10 bg-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl flex items-center justify-center text-white transition-colors shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-600">
                <Car className="h-5 w-5" />
              </div>
              <h1 className="text-3xl font-bold theme-text font-outfit uppercase tracking-tight">Mis Vehículos</h1>
            </div>
          </div>
          
          <button 
            onClick={handleOpenAdd}
            className="primary-button pr-6 pl-6 py-3 flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" /> Registrar Vehículo
          </button>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 theme-text opacity-70 font-medium">Buscando tus vehículos registrados...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="theme-card rounded-[2.5rem] p-12 text-center border border-current/5 shadow-xl flex flex-col items-center justify-center">
            <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-6">
              <Car className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold theme-text mb-2">No tenés vehículos registrados</h3>
            <p className="theme-text opacity-60 max-w-md mx-auto mb-8 text-sm">
              Para poder ofrecer viajes compartidos y llevar pasajeros o cargas, es necesario que registres tu vehículo con su foto y patente.
            </p>
            <button 
              onClick={handleOpenAdd}
              className="primary-button pr-8 pl-8 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> Registrar mi primer vehículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {vehicles.map((v) => (
              <div 
                key={v._id} 
                className="theme-card rounded-[2rem] overflow-hidden border border-current/5 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 flex flex-col h-full group"
              >
                {/* Foto del vehículo */}
                <div className="h-48 relative bg-gray-100 overflow-hidden">
                  <Image 
                    src={v.photoDataUrl} 
                    alt={`${v.brand} ${v.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-brand-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md uppercase">
                    {v.licensePlate}
                  </div>
                  
                  {/* Botones de acción flotantes sobre la foto */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(v)}
                      className="h-9 w-9 bg-white hover:bg-brand-600 text-brand-600 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-brand-200 hover:border-brand-600 transition-all duration-200"
                      title="Editar vehículo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(v._id)}
                      className="h-9 w-9 bg-white hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-red-200 hover:border-red-600 transition-all duration-200"
                      title="Eliminar vehículo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold theme-text uppercase tracking-tight leading-none mb-1">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-sm theme-text opacity-60 mb-4 font-medium">
                      Año {v.year} • Color {v.color}
                    </p>

                    {/* Estados / Validaciones */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {v.insuranceVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <ShieldCheck className="h-3 w-3" /> Seguro al día
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <AlertCircle className="h-3 w-3" /> Pendiente Verificar
                        </span>
                      )}

                      {v.vtvExpiry ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <Calendar className="h-3 w-3" /> VTV: {new Date(v.vtvExpiry).toLocaleDateString('es-AR', {month: 'short', year: 'numeric'})}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-500/10 text-gray-500 border border-gray-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <Calendar className="h-3 w-3" /> Sin VTV Declarada
                        </span>
                      )}
                    </div>

                    {v.extraNotes && (
                      <div className="bg-gray-50/50 dark:bg-gray-800/40 border border-current/5 rounded-xl p-3 text-xs theme-text opacity-75 mt-2 flex gap-2">
                        <FileText className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="italic">"{v.extraNotes}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Registro/Edición */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="theme-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-current/10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              
              {/* Header Modal */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-xl font-bold theme-text uppercase tracking-tight flex items-center gap-2">
                  <Car className="h-5 w-5 text-brand-500" />
                  {isEditing ? 'Editar Vehículo' : 'Registrar Vehículo'}
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center theme-text transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Marca *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej: Ford, Toyota"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Modelo *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej: Fiesta, Hilux"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Año *</label>
                    <input 
                      type="number" 
                      required 
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Color *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej: Rojo, Gris Plata"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Patente *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej: AE123PX o AAA123"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({...formData, licensePlate: e.target.value.toUpperCase()})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Vencimiento VTV (Opcional)</label>
                    <input 
                      type="date" 
                      value={formData.vtvExpiry}
                      onChange={(e) => setFormData({...formData, vtvExpiry: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500" 
                    />
                  </div>
                </div>

                {/* Seguro al día check */}
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-current/5">
                  <input 
                    type="checkbox" 
                    id="insuranceVerified"
                    checked={formData.insuranceVerified}
                    onChange={(e) => setFormData({...formData, insuranceVerified: e.target.checked})}
                    className="h-5 w-5 text-brand-600 rounded focus:ring-brand-500 border-gray-300 dark:border-gray-700" 
                  />
                  <label htmlFor="insuranceVerified" className="text-xs font-semibold theme-text cursor-pointer select-none">
                    Declaro bajo juramento que este vehículo posee seguro vigente obligatorio al día.
                  </label>
                </div>

                {/* Notas adicionales */}
                <div>
                  <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Notas del vehículo (Opcional)</label>
                  <textarea 
                    placeholder="Ej: Baúl amplio, aire acondicionado, no se permite fumar, etc."
                    value={formData.extraNotes}
                    maxLength="300"
                    onChange={(e) => setFormData({...formData, extraNotes: e.target.value})}
                    rows="2"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm theme-text focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Carga de Foto */}
                <div>
                  <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-1">Foto del Vehículo *</label>
                  <p className="text-[10px] theme-text opacity-50 mb-2">
                    Subí una foto nítida de frente o lateral del auto. Máximo 800 KB.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.photoDataUrl && (
                      <div className="relative h-24 w-36 rounded-xl overflow-hidden border border-current/10 shrink-0 bg-gray-100">
                        <Image src={formData.photoDataUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs w-full text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                </div>

                {/* Footer Modal Acciones */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 theme-text transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={saving}
                    className="primary-button px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Vehículo'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
