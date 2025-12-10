const Avatar = ({ src, alt, size = 'md', online = false, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full rounded-full object-cover"
      />
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;
