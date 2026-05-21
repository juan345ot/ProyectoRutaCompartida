/**
 * @file Crear o editar una publicación de viaje.
 * @description Formulario de oferta/solicitud con vehículos, ruta (Google Places) y validaciones de conductor.
 */
"use client";
import { useState, useContext, useEffect, useRef, Suspense } from "react";
import { MapPin, Calendar, Package, Users, Info, Car, Shield } from "lucide-react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

const PLACEHOLDER_HINTS = ["via.placeholder", "ui-avatars.com"];

/**
 * Indica si el usuario tiene una foto de perfil real (no avatar genérico).
 * @param {object|null} u - Usuario con campo profileImage.
 * @returns {boolean}
 */
function userHasProfilePhoto(u) {
  if (!u?.profileImage) return false;
  const s = String(u.profileImage).toLowerCase();
  return !PLACEHOLDER_HINTS.some((h) => s.includes(h));
}

/** Formulario principal de publicación (envuelto en Suspense por useSearchParams). */
function PublishContent() {
  // --- Estado ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const [formData, setFormData] = useState({
    type: "offer",
    category: "passenger",
    origin: "",
    destination: "",
    date: "",
    time: "",
    arrivalApprox: "",
    seats: 1,
    weight: "",
    dimensions: { length: "", width: "", height: "" },
    description: "",
    smoke: false,
    pets: false,
  });

  // Vehículos (Nueva Arquitectura)
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [legacyVehicle, setLegacyVehicle] = useState(null);

  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Efectos ---
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=publish");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchMyVehicles = async () => {
      if (isAuthenticated) {
        try {
          setLoadingVehicles(true);
          const res = await api.get("/vehicles");
          const data = res.data || [];
          setVehicles(data);
          // Si estamos editando y ya se configuró un id, no pisarlo
          if (data.length > 0 && !selectedVehicleId) {
            setSelectedVehicleId(data[0]._id);
          }
        } catch (err) {
          console.error("Error fetching vehicles:", err);
        } finally {
          setLoadingVehicles(false);
        }
      }
    };
    fetchMyVehicles();
  }, [isAuthenticated]);

  useEffect(() => {
    const edit = searchParams.get("edit");
    if (edit) {
      setIsEditing(true);
      setEditId(edit);
      fetchEditData(edit);
    }
  }, [searchParams]);

  // --- Handlers ---
  const fetchEditData = async (id) => {
     try {
        const { data } = await api.get(`/posts/${id}`);
        // Basic fields
        const dateObj = new Date(data.departureDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const hh = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');

        setFormData({
          type: data.type,
          category: data.category,
          origin: data.origin,
          destination: data.destination,
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${min}`,
          arrivalApprox: data.arrivalApprox || "",
          seats: data.seats || 1,
          weight: data.weight || "",
          dimensions: data.dimensions || { length: "", width: "", height: "" },
          description: data.description || "",
          smoke: data.preferences?.smoke || false,
          pets: data.preferences?.pets || false,
        });

        if (data.vehicle) {
          const isId = (typeof data.vehicle === 'string' && data.vehicle.length === 24) || (data.vehicle && data.vehicle._id);
          if (isId) {
            setSelectedVehicleId(data.vehicle._id || data.vehicle);
            setLegacyVehicle(null);
          } else {
            // Es un objeto legacy completo
            setLegacyVehicle(data.vehicle);
            setSelectedVehicleId("legacy");
          }
        }
     } catch (err) {
        toast.error("Error al cargar datos para editar");
     }
  };

  useEffect(() => {
    let intervalId = null;
    
    const initAutocomplete = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        originRef.current &&
        destinationRef.current
      ) {
        const options = { componentRestrictions: { country: "ar" }, fields: ["formatted_address", "name"] };
        const autocompleteOrigin = new window.google.maps.places.Autocomplete(originRef.current, options);
        const autocompleteDest = new window.google.maps.places.Autocomplete(destinationRef.current, options);

        autocompleteOrigin.addListener("place_changed", () => {
          const place = autocompleteOrigin.getPlace();
          if (place.formatted_address || place.name) {
            setFormData(prev => ({ ...prev, origin: place.formatted_address || place.name }));
          }
        });
        autocompleteDest.addListener("place_changed", () => {
          const place = autocompleteDest.getPlace();
          if (place.formatted_address || place.name) {
            setFormData(prev => ({ ...prev, destination: place.formatted_address || place.name }));
          }
        });

        if (intervalId) {
          clearInterval(intervalId);
        }
        return true;
      }
      return false;
    };

    const success = initAutocomplete();
    if (!success) {
      intervalId = setInterval(() => {
        const initialized = initAutocomplete();
        if (initialized && intervalId) {
          clearInterval(intervalId);
        }
      }, 300);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.date || !formData.time) {
        throw new Error("Seleccioná fecha y hora del viaje");
      }
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Fecha u hora inválida");
      }

      if (formData.type === "offer") {
        const { data: me } = await api.get("/auth/me");
        if (!userHasProfilePhoto(me)) {
          throw new Error(
            "Para ofrecer lugar necesitás una foto de perfil real en Mis Datos. Podés publicar búsquedas sin foto."
          );
        }
        if (!selectedVehicleId) {
          throw new Error("Seleccioná un vehículo. Si no tenés uno, registralo en 'Mis Vehículos'.");
        }
      }

      const departureDate = dateObj.toISOString();
      const payload = {
        type: formData.type,
        category: formData.category,
        origin: formData.origin,
        destination: formData.destination,
        departureDate,
        arrivalApprox: formData.arrivalApprox || undefined,
        description: formData.description,
        capacity: formData.category === "passenger" ? `${formData.seats} lugares` : `${formData.weight} kg`,
      };

      if (formData.category === "passenger") {
        if (!formData.seats || formData.seats < 1) throw new Error("Indicá al menos 1 lugar/asiento");
        payload.seats = Number(formData.seats);
      } else {
        if (!formData.weight || formData.weight < 1) throw new Error("Indicá el peso máximo o estimado del paquete");
        payload.weight = Number(formData.weight);
        payload.dimensions = {
          length: Number(formData.dimensions.length) || 0,
          width: Number(formData.dimensions.width) || 0,
          height: Number(formData.dimensions.height) || 0,
        };
      }

      payload.preferences = {
        smoke: formData.smoke,
        pets: formData.pets,
        ac: true // Fixed for now as per user instruction on clima badge visibility
      };

      if (formData.type === "offer") {
        if (selectedVehicleId === "legacy") {
          payload.vehicle = legacyVehicle;
        } else {
          payload.vehicle = selectedVehicleId;
        }
      }

      if (isEditing) {
        await api.patch(`/posts/${editId}`, payload);
        toast.success("¡Publicación actualizada exitosamente!");
      } else {
        await api.post("/posts", payload);
        toast.success("¡Publicación creada exitosamente!");
      }

      router.push("/search");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Error al publicar";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4" />
        <p className="text-gray-500">Comprobando sesión...</p>
      </div>
    );
  }

  // --- Render principal ---
  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-outfit theme-text mb-4">
             {isEditing ? "Editar Publicación" : "Crea una Publicación"}
          </h1>
          <p className="theme-text opacity-80">
            Ofrecer lugar requiere más datos (vehículo, VTV, foto de perfil). Buscar lugar sigue siendo
            simple.
          </p>
        </div>

        <div className="theme-card p-8 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-brand-500 to-accent-500" />

          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b border-white/10 pb-2 theme-text">
                1. ¿Qué vas a hacer?
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "offer" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    formData.type === "offer"
                      ? "border-emerald-700 bg-emerald-700 text-white scale-[1.02] shadow-lg shadow-emerald-500/30"
                      : "border-gray-200 hover:border-emerald-300 theme-text opacity-90 hover:bg-emerald-500/10"
                  }`}
                >
                  <span className="block font-bold mb-1">Ofrezco Lugar</span>
                  <span className={`text-xs ${formData.type === "offer" ? "text-emerald-100" : ""}`}>
                    Tengo espacio (datos del auto)
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "request" })}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    formData.type === "request"
                      ? "border-orange-600 bg-orange-600 text-white scale-[1.02] shadow-lg shadow-orange-500/30"
                      : "border-gray-200 hover:border-orange-300 theme-text opacity-90 hover:bg-orange-500/10"
                  }`}
                >
                  <span className="block font-bold mb-1">Busco Lugar</span>
                  <span className={`text-xs ${formData.type === "request" ? "text-orange-100" : ""}`}>
                    Necesito viaje o envío
                  </span>
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium theme-text mb-3">Categoría:</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer theme-text">
                    <input
                      type="radio"
                      checked={formData.category === "passenger"}
                      onChange={() => setFormData({ ...formData, category: "passenger" })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <Users className="h-4 w-4" /> Pasajeros
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer theme-text">
                    <input
                      type="radio"
                      checked={formData.category === "package"}
                      onChange={() => setFormData({ ...formData, category: "package" })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <Package className="h-4 w-4" /> Paquetes / Carga
                  </label>
                </div>
              </div>
            </div>

            {formData.type === "offer" && (
              <div className="space-y-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 shadow-inner relative overflow-hidden animate-in fade-in duration-300">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600" />
                
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h2 className="text-lg font-bold theme-text flex items-center gap-2 uppercase tracking-wide text-xs">
                    <Car className="h-5 w-5 text-emerald-600" /> Selección de Vehículo
                  </h2>
                  {vehicles.length > 0 && (
                    <Link 
                      href="/my-vehicles" 
                      target="_blank"
                      className="text-xs font-bold text-brand-600 hover:text-brand-500 underline flex items-center gap-1"
                    >
                      ✏️ Administrar Vehículos
                    </Link>
                  )}
                </div>

                {!userHasProfilePhoto(user) && (
                  <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex gap-2">
                    <Shield className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Foto de perfil obligatoria:</strong> Recordá que necesitás una foto de perfil real en{" "}
                      <Link href="/profile" className="underline font-bold hover:text-amber-500">
                        Mis Datos
                      </Link>{" "}
                      para poder ofrecer viajes.
                    </span>
                  </p>
                )}

                {loadingVehicles ? (
                  <div className="flex items-center justify-center py-6 gap-2">
                    <div className="h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm theme-text opacity-70">Buscando tus vehículos...</p>
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="border border-dashed border-emerald-500/30 rounded-2xl p-6 text-center bg-white/50 dark:bg-gray-900/30">
                    <Car className="h-10 w-10 text-emerald-600/50 mx-auto mb-3" />
                    <h4 className="text-sm font-bold theme-text mb-1">No tenés ningún vehículo registrado</h4>
                    <p className="text-xs theme-text opacity-60 max-w-sm mx-auto mb-4 leading-relaxed">
                      Para ofrecer un viaje, primero debés registrar un vehículo en la nueva sección de tu cuenta.
                    </p>
                    <Link 
                      href="/my-vehicles"
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      ✚ Registrar mi vehículo ahora
                    </Link>
                    <p className="text-[10px] theme-text opacity-40 mt-2 font-medium">
                      (Al finalizar, refrescá esta página para seleccionarlo)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold theme-text opacity-70 uppercase tracking-wider mb-2">
                        Elegí uno de tus vehículos *
                      </label>
                      <select
                        value={selectedVehicleId}
                        onChange={(e) => {
                          setSelectedVehicleId(e.target.value);
                          if (e.target.value !== "legacy") {
                            setLegacyVehicle(null);
                          }
                        }}
                        className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm theme-text focus:ring-2 focus:ring-brand-500 transition-shadow shadow-sm"
                      >
                        {vehicles.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.brand} {v.model} ({v.licensePlate})
                          </option>
                        ))}
                        {selectedVehicleId === "legacy" && legacyVehicle && (
                          <option value="legacy">
                            [Anterior] {legacyVehicle.brand} {legacyVehicle.model} ({legacyVehicle.licensePlate})
                          </option>
                        )}
                      </select>
                    </div>

                    {/* Previsualización del auto seleccionado */}
                    {(() => {
                      const activeVehicle = selectedVehicleId === "legacy" 
                        ? legacyVehicle 
                        : vehicles.find(v => v._id === selectedVehicleId);
                        
                      if (!activeVehicle) return null;

                      return (
                        <div className="bg-white dark:bg-gray-900/50 border border-current/5 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row gap-4 animate-in fade-in duration-300">
                          {activeVehicle.photoDataUrl && (
                            <div className="relative h-24 w-full sm:w-36 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-current/10">
                              <Image 
                                src={activeVehicle.photoDataUrl} 
                                alt={`${activeVehicle.brand} ${activeVehicle.model}`} 
                                fill 
                                className="object-cover" 
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between sm:justify-start gap-3">
                                <h4 className="font-bold theme-text text-md uppercase tracking-tight">
                                  {activeVehicle.brand} {activeVehicle.model}
                                </h4>
                                <span className="bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border border-emerald-500/10">
                                  {activeVehicle.licensePlate}
                                </span>
                              </div>
                              <p className="text-xs theme-text opacity-60 mt-1">
                                Color {activeVehicle.color} • Año {activeVehicle.year}
                              </p>
                              {activeVehicle.extraNotes && (
                                <p className="text-[10px] theme-text opacity-70 italic mt-2 line-clamp-2">
                                  &ldquo;{activeVehicle.extraNotes}&rdquo;
                                </p>
                              )}
                            </div>
                            
                            {selectedVehicleId === "legacy" && (
                              <div className="mt-2 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-lg border border-amber-500/10 font-bold flex items-center gap-1">
                                <Info className="h-3 w-3" /> Vehículo antiguo guardado en esta publicación.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-bold theme-text border-b border-white/10 pb-2">2. La Ruta</h2>
              <div className="space-y-4 relative">
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Origen</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      ref={originRef}
                      type="text"
                      required
                      placeholder="Ciudad de salida"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 theme-text bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Destino</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      ref={destinationRef}
                      type="text"
                      required
                      placeholder="Ciudad de llegada"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 theme-text bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold theme-text border-b border-white/10 pb-2">3. Detalles del Viaje</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      min={new Date().toLocaleDateString('en-CA')}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 theme-text bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Hora de salida</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              {formData.type === "offer" && (
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">
                    Llegada aproximada (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.arrivalApprox}
                    onChange={(e) => setFormData({ ...formData, arrivalApprox: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                    placeholder="ej. 18:30 o según tráfico"
                  />
                </div>
              )}

              {formData.category === "passenger" ? (
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Asientos / Lugares {formData.type === "offer" ? "disponibles" : "requeridos"}</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      className="w-24 rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                    />
                    <span className="theme-text opacity-70">personas</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium theme-text mb-1">Peso máximo / estimado (kg) {formData.type === "offer" ? "disponible" : "necesario"}</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                      placeholder="Ej: 5"
                    />
                  </div>
                  <div>
                    <label className="block font-medium theme-text mb-2 text-xs uppercase tracking-wider opacity-60">Dimensiones máximas aproximadas (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] theme-text uppercase mb-1">Largo</label>
                        <input
                          type="number"
                          placeholder="cm"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, length: e.target.value }
                          })}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-2 px-3 theme-text bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] theme-text uppercase mb-1">Ancho</label>
                        <input
                          type="number"
                          placeholder="cm"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, width: e.target.value }
                          })}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-2 px-3 theme-text bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] theme-text uppercase mb-1">Alto</label>
                        <input
                          type="number"
                          placeholder="cm"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({
                            ...formData,
                            dimensions: { ...formData.dimensions, height: e.target.value }
                          })}
                          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-2 px-3 theme-text bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium theme-text mb-1">Notas adicionales</label>
                <textarea
                  rows="3"
                  placeholder="Restricciones, mascotas, desvíos..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900 resize-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                 <p className="text-sm font-bold theme-text uppercase tracking-widest opacity-60">Reglas y Preferencias</p>
                 <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.smoke ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={formData.smoke}
                             onChange={(e) => setFormData({ ...formData, smoke: e.target.checked })}
                          />
                          {formData.smoke && <div className="h-2 w-2 bg-white rounded-full" />}
                       </div>
                       <span className="theme-text font-bold text-sm">Permite Fumar</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className={`h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.pets ? 'bg-brand-500 border-brand-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={formData.pets}
                             onChange={(e) => setFormData({ ...formData, pets: e.target.checked })}
                          />
                          {formData.pets && <div className="h-2 w-2 bg-white rounded-full" />}
                       </div>
                       <span className="theme-text font-bold text-sm">Acepta Mascotas</span>
                    </label>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t theme-border flex items-center justify-between gap-4">
              <Link 
                href="/search" 
                className="flex-1 text-center py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-gray-400 hover:bg-gray-500 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`primary-button px-8 shadow-lg shadow-brand-500/30 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (isEditing ? "Guardando..." : "Publicando...") : (isEditing ? "Guardar Cambios" : "Publicar Ahora")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Punto de entrada: carga el formulario dentro de Suspense (parámetro ?edit=). */
export default function PublishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mb-4" />
        <p className="text-gray-500">Cargando...</p>
      </div>
    }>
      <PublishContent />
    </Suspense>
  );
}
