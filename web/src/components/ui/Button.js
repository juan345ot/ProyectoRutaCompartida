import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon, 
  className = '', 
  disabled,
  ...props 
}) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/20',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-accent-500/20',
    outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-500/5',
    ghost: 'text-brand-600 hover:bg-brand-500/10',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base font-bold',
  };

  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-[0.98] outline-hidden focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
}
