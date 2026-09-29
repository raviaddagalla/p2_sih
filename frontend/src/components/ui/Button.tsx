'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-brand-indigo hover:bg-brand-indigoHover text-white shadow-sm hover:shadow active:scale-[0.98] border border-transparent';
      case 'gradient':
        return 'bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-pink hover:opacity-95 text-white shadow-md shadow-brand-indigo/20 active:scale-[0.98] border border-transparent';
      case 'secondary':
        return 'bg-surface hover:bg-subtle text-primary border border-border hover:border-border-strong shadow-xs active:scale-[0.98]';
      case 'soft':
        return 'bg-brand-indigoTint hover:bg-brand-indigo/20 text-brand-indigo font-semibold border border-brand-indigo/20';
      case 'danger':
        return 'bg-semantic-danger hover:bg-[#DC2626] text-white shadow-sm active:scale-[0.98] border border-transparent';
      case 'success':
        return 'bg-semantic-success hover:bg-[#059669] text-white shadow-sm active:scale-[0.98] border border-transparent';
      case 'ghost':
        return 'bg-transparent hover:bg-subtle text-secondary hover:text-primary border border-transparent';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1 text-xs rounded-lg gap-1.5 h-7';
      case 'md':
        return 'px-3.5 py-2 text-xs font-semibold rounded-xl gap-2 h-9';
      case 'lg':
        return 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2.5 h-11';
      case 'icon':
        return 'p-2 rounded-lg justify-center w-9 h-9';
    }
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-sans transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
