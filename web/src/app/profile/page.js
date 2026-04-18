"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Save, Activity } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, refreshUser } = useContext(AuthContext);
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', phone: '', profileImage: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
        await api.put('/users/me', formData);
        await refreshUser();
        toast.success('Perfil actualizado con éxito');
        setMessage({ text: 'Perfil actualizado con éxito', type: 'success' });
    } catch (error) {
       console.error(error);
       setMessage({ text: 'Error al actualizar el perfil', type: 'error' });
    } finally {
       setIsSaving(false);
    }
  };

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen theme-bg py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-600">
               <User className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold theme-text font-outfit uppercase tracking-tight">Mis Datos</h1>
        </div>

        <div className="theme-card rounded-[2.5rem] shadow-2xl overflow-hidden mb-8 relative border border-current/5">
            <div className="bg-linear-to-r from-brand-600 to-brand-400 h-32"></div>
            <div className="px-8 pb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 relative z-10">
                <div className="h-28 w-28 rounded-full border-4 border-current/20 bg-white dark:bg-gray-800 shadow-xl relative overflow-hidden group">
                    <Image 
                      src={formData.profileImage || user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=14b8a6&color=fff`} 
                      alt={user.name} 
                      fill
                      className="object-cover" 
                    />
                </div>
                <div className="flex-1 mb-2">
                    <h2 className="text-3xl font-black theme-text uppercase tracking-tighter leading-none mb-1">{user.name}</h2>
                    <p className="theme-text opacity-50 flex items-center gap-1 text-sm font-medium"><Mail className="h-4 w-4" /> {user.email}</p>
                </div>
                <div className="bg-brand-500/10 rounded-3xl p-4 border border-brand-500/10 mb-2 flex items-center gap-4 shadow-xl backdrop-blur-sm">
                   <div className="text-brand-500 font-black text-3xl">★ {user.averageRating || '0.0'}</div>
                   <div className="text-[10px] text-gray-900 font-black uppercase leading-tight opacity-70">
                     Puntaje<br/>Promedio
                   </div>
                </div>
            </div>
        </div>

        <div className="theme-card rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-current/5">
            <h3 className="font-black theme-text mb-8 flex items-center gap-3 uppercase tracking-widest text-[11px]">
                <Activity className="h-5 w-5 text-brand-500" /> Información Personal
            </h3>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                          type="text" 
                          required 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-10 w-full rounded-xl border border-gray-300 py-3 focus:ring-2 focus:ring-brand-500" 
                      />
                   </div>
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email (No se puede cambiar)</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input type="text" disabled value={user.email} className="pl-10 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-gray-500 cursor-not-allowed" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                          type="text" 
                          required 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="pl-10 w-full rounded-xl border border-gray-300 py-3 focus:ring-2 focus:ring-brand-500" 
                      />
                   </div>
                   <p className="text-xs text-gray-500 mt-1">
                     El teléfono se comparte solo con usuarios que vos apruebes en un viaje (desde el itinerario),
                     según las reglas de la plataforma.
                   </p>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Foto de perfil</label>
                   <p className="text-xs text-gray-500 mb-2">
                     Necesaria para <strong>ofrecer</strong> viajes (no hace falta para publicar búsquedas). Subí una
                     foto real tuya, no un ícono genérico.
                   </p>
                   <input
                     type="file"
                     accept="image/*"
                     className="text-sm w-full text-gray-600"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (!file) return;
                       if (file.size > 600000) {
                         toast.error('Elegí una imagen más liviana (menos de 600 KB)');
                         return;
                       }
                       const reader = new FileReader();
                       reader.onloadend = () => {
                         setFormData((f) => ({ ...f, profileImage: reader.result }));
                       };
                       reader.readAsDataURL(file);
                     }}
                   />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                       type="submit" 
                       disabled={isSaving}
                       className="primary-button pr-8 pl-8 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                       <Save className="h-4 w-4"/> {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
