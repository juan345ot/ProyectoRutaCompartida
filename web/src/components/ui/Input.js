import React from 'react';

export default function Input({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
        )}
        <input
          className={`
            w-full bg-white/50 backdrop-blur-sm
            rounded-2xl border-2 py-3 transition-all duration-300
            outline-hidden placeholder:text-gray-400
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm hover:border-gray-200'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
