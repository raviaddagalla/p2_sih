'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentTop?: 'indigo' | 'emerald' | 'amber' | 'cyan' | 'pink' | 'none';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  accentTop = 'none',
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const getAccentBar = () => {
    switch (accentTop) {
      case 'indigo':
        return 'border-t-4 border-t-brand-indigo';
      case 'emerald':
        return 'border-t-4 border-t-semantic-success';
      case 'amber':
        return 'border-t-4 border-t-semantic-warning';
      case 'cyan':
        return 'border-t-4 border-t-brand-cyan';
      case 'pink':
        return 'border-t-4 border-t-brand-pink';
      default:
        return '';
    }
  };

  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-xs ${
        interactive
          ? 'hover:border-border-strong hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5'
          : ''
      } ${getAccentBar()} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
