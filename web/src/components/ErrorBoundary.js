"use client";
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-50 rounded-full text-red-500">
                <AlertTriangle size={48} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-outfit">
              ¡Ups! Algo salió mal
            </h1>
            <p className="text-gray-600 mb-8">
              Lo sentimos, ha ocurrido un error inesperado. Estamos trabajando para solucionarlo.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full flex items-center justify-center gap-2"
                icon={RefreshCw}
              >
                Recargar página
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
