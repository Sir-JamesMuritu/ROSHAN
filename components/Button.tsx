import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Royal Data Blue
    primary: "bg-brand-primary hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-brand-primary",
    
    // Orange Gradient for High Impact CTA
    cta: "bg-gradient-to-r from-brand-orange to-brand-amber hover:from-orange-500 hover:to-amber-500 text-white shadow-lg hover:shadow-brand-orange/40 hover:-translate-y-0.5 focus:ring-brand-orange",
    
    // Electric Blue outline
    secondary: "bg-white border-2 border-brand-electric text-brand-electric hover:bg-brand-electric hover:text-white focus:ring-brand-electric",
    
    // Standard Outline
    outline: "border-2 border-slate-300 hover:border-brand-primary hover:text-brand-primary text-slate-600 bg-transparent",
    
    // Ghost
    ghost: "hover:bg-brand-surface text-slate-300 hover:text-brand-orange"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base tracking-wide"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};