const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-xl transition inline-flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg',
    secondary: 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
