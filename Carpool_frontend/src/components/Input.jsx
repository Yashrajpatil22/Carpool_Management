const Input = ({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        
        <input
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 ${
            error ? 'border-red-500' : 'border-slate-200'
          } rounded-xl focus:border-blue-600 focus:outline-none transition ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
