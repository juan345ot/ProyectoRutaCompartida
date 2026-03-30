"use client";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Route, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/search');
    }
  }, [isAuthenticated, router]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
    }
    
    if (!acceptedTerms) {
      toast.error('Debes aceptar los Términos y Condiciones para registrarte.');
      setIsLoading(false);
      return;
    }

    try {
      await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
      });
      toast.success('¡Cuenta creada exitosamente!');
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center text-brand-500 mb-6">
           <Route className="h-12 w-12" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold font-outfit">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm opacity-80">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-bold underline decoration-accent-500 transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="theme-card py-8 px-6 rounded-3xl relative overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-accent-500 to-brand-500" />
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Nombre Completo"
              name="name"
              placeholder="Juan Pérez"
              icon={User}
              required
              value={formData.name}
              onChange={onChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              icon={Mail}
              required
              value={formData.email}
              onChange={onChange}
            />

            <Input
              label="Teléfono / WhatsApp"
              name="phone"
              placeholder="+54 9 11 1234-5678"
              icon={Phone}
              required
              value={formData.phone}
              onChange={onChange}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={formData.password}
              onChange={onChange}
            />

            <Input
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={formData.confirmPassword}
              onChange={onChange}
            />

            {/* Terms and conditions */}
            <div className="flex items-start gap-3 mt-4 mb-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-gray-600">
                He leído y acepto los{' '}
                <Link href="/terminos-de-servicio" target="_blank" className="font-semibold text-brand-600 hover:text-brand-500 underline decoration-brand-300 transition-colors">
                  Términos de Servicio
                </Link>
                {', la '}
                <Link href="/politica-de-privacidad" target="_blank" className="font-semibold text-brand-600 hover:text-brand-500 underline decoration-brand-300 transition-colors">
                  Política de Privacidad
                </Link>
                {' y las '}
                <Link href="/reglas-de-convivencia" target="_blank" className="font-semibold text-brand-600 hover:text-brand-500 underline decoration-brand-300 transition-colors">
                  Reglas de Convivencia
                </Link>
                {' de la plataforma.'}
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isLoading}
                icon={ArrowRight}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
