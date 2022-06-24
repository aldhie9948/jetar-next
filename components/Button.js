const Button = ({ children, className, type = 'button', onClick = null }) => {
  return (
    <div className={`flex ${className}`}>
      <button
        type={type}
        onClick={onClick}
        className='group border text-green-500 border-green-500/50 relative font-bold'
      >
        <div className='bg-green-500/50 absolute inset-0 top-auto z-[-1] h-0 group-hover:h-full duration-200 transition-all'></div>
        <div className='group-hover:text-white transition-all duration-200'>
          {children}
        </div>
      </button>
    </div>
  );
};

export default Button;
