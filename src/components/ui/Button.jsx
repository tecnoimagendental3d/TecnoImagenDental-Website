import { Loader2 } from "lucide-react"

const Button = ({
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  children, 
  icon: Icon, 
  ...props }) => {

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-dark hover:bg-[#0a2768] text-white',
    secondary: 'bg-white hover:bg-gray-50 text-primary-dark border-2 border-primary-dark',
    teal: 'bg-primary-teal hover:bg-[#10b3bb] text-white',
    orange: 'bg-primary-orange hover:bg-[#d15f18] text-white',
    ghost: 'bg-transparent hover:bg-gray-100 text-primary-dark',
  };

  const sizeClasses = {
    small: 'px-3 py-1 h-8 text-sm',
    medium: 'px-4 py-2 h-10 text-sm',
    large: 'px-6 py-3 h-12 text-base',
  };


  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button