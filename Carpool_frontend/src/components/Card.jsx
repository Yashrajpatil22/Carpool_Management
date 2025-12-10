const Card = ({ children, className = '', hover = false, gradient = false }) => {
  const baseStyles = 'bg-white rounded-2xl p-6 border border-slate-200';
  const hoverStyles = hover ? 'hover:shadow-xl transition-all duration-300 cursor-pointer' : '';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-blue-50 to-teal-50' : '';
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-slate-900 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-slate-200 ${className}`}>
    {children}
  </div>
);

export default Card;
