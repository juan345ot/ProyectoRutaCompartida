"use client";
import { useState, useContext, useEffect } from "react";
import { MapPin, Calendar, Package, Users, Info, Car, Shield } from "lucide-react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

const PLACEHOLDER_HINTS = ["via.placeholder", "ui-avatars.com"];

function userHasProfilePhoto(u) {
  if (!u?.profileImage) return false;
  const s = String(u.profileImage).toLowerCase();
  return !PLACEHOLDER_HINTS.some((h) => s.includes(h));
}

export default function PublishPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "offer",
    category: "passenger",
    origin: "",
    destination: "",
    date: "",
    time: "",
    arrivalApprox: "",
    capacity: "",
    description: "",
  });
  const [vehiclePhotoPreview, setVehiclePhotoPreview] = useState(null);
  const [vehicleFields, setVehicleFields] = useState({
    licensePlate: "",
    vtvExpiry: "",
    insuranceVerified: false,
    extraNotes: "",
  });

  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=publish");
    }
  }, [isAuthenticated, loading, router]);

  const handleVehiclePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800000) {
      toast.error("La foto debe pesar menos de ~800 KB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setVehiclePhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
        if (!vehiclePhotoPreview || vehiclePhotoPreview.length < 100) {
          throw new Error("Subí una foto del vehículo");
        }
        if (!vehicleFields.licensePlate.trim()) {
          throw new Error("Completá la patente");
        }
        if (!vehicleFields.vtvExpiry) {
          throw new Error("Indicá la fecha de VTV o revisación");
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
        capacity: formData.capacity,
        description: formData.description,
      };

      if (formData.type === "offer") {
        payload.vehicle = {
          photoDataUrl: vehiclePhotoPreview,
          licensePlate: vehicleFields.licensePlate.trim(),
          vtvExpiry: new Date(vehicleFields.vtvExpiry).toISOString(),
          insuranceVerified: vehicleFields.insuranceVerified,
          extraNotes: vehicleFields.extraNotes || undefined,
        };
      }

      await api.post("/posts", payload);
      toast.success("¡Publicación creada exitosamente!");
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

  return (
    <div className="min-h-screen bg-transparent py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-outfit theme-text mb-4">Crea una Publicación</h1>
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
              <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <h2 className="text-lg font-bold theme-text flex items-center gap-2">
                  <Car className="h-5 w-5 text-emerald-600" /> Datos del vehículo (obligatorio para ofrecer)
                </h2>
                {!userHasProfilePhoto(user) && (
                  <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-500/15 p-3 rounded-xl border border-amber-500/30">
                    <Shield className="inline h-4 w-4 mr-1" />
                    Subí una foto de perfil real en{" "}
                    <Link href="/profile" className="underline font-semibold">
                      Mis Datos
                    </Link>{" "}
                    antes de ofrecer un viaje.
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Foto del vehículo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVehiclePhoto}
                    className="w-full text-sm theme-text"
                  />
                  {vehiclePhotoPreview && (
                    <div className="relative mt-3 h-40 rounded-xl overflow-hidden border border-current/20">
                      <Image src={vehiclePhotoPreview} alt="Vista previa" fill className="object-cover" unoptimized />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Patente</label>
                  <input
                    type="text"
                    required={formData.type === "offer"}
                    value={vehicleFields.licensePlate}
                    onChange={(e) => setVehicleFields({ ...vehicleFields, licensePlate: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                    placeholder="AA 123 BB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">
                    Vencimiento VTV / revisación técnica
                  </label>
                  <input
                    type="date"
                    required={formData.type === "offer"}
                    value={vehicleFields.vtvExpiry}
                    onChange={(e) => setVehicleFields({ ...vehicleFields, vtvExpiry: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                  />
                </div>
                <label className="flex items-center gap-2 theme-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleFields.insuranceVerified}
                    onChange={(e) =>
                      setVehicleFields({ ...vehicleFields, insuranceVerified: e.target.checked })
                    }
                  />
                  Declaro que el seguro del vehículo se encuentra vigente
                </label>
                <div>
                  <label className="block text-sm font-medium theme-text mb-1">Notas del vehículo (opcional)</label>
                  <input
                    type="text"
                    value={vehicleFields.extraNotes}
                    onChange={(e) => setVehicleFields({ ...vehicleFields, extraNotes: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                    placeholder="Modelo, color, etc."
                  />
                </div>
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
              <div>
                <label className="block text-sm font-medium theme-text mb-1">
                  Llegada aproximada (texto u hora)
                </label>
                <input
                  type="text"
                  value={formData.arrivalApprox}
                  onChange={(e) => setFormData({ ...formData, arrivalApprox: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                  placeholder="ej. 18:30 o según tráfico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text mb-1">Capacidad / Espacio</label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.category === "passenger"
                      ? "Ej: 2 asientos"
                      : "Ej: hasta 10 kg"
                  }
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text mb-1">Notas adicionales</label>
                <textarea
                  rows="3"
                  placeholder="Restricciones, mascotas, desvíos..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 px-4 theme-text bg-white dark:bg-gray-900 resize-none"
                />
                <p className="text-xs theme-text opacity-70 mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Máximo 500 caracteres.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <Link href="/" className="outline-button px-6 py-2.5">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`primary-button px-8 shadow-lg shadow-brand-500/30 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Publicando..." : "Publicar Ahora"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
