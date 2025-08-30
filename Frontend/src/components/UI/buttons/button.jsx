import Loading from "../loaders/Loading";

    const Button = ({
        children, 
        type='button',
        variant='primary',
        size='md',
        disabled=false,
        loading=false,
        onClick,
        className='',
        ...props
    }) => {
        const baseClasses = 'btn transition-all duration-200 focus:outline-none focus:ring-1';

        const variants = {
            primary: `
                bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500
                disabled:bg-indigo-400 disabled:hover:bg-indigo-400
            `,
            secondary: `
                bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500
                disabled:bg-gray-300 disabled:hover:bg-gray-300
            `,
            success: `
                bg-green-600 hover:bg-green-700 text-white focus:ring-green-500
                disabled:bg-green-400 disabled:hover:bg-green-400
            `,
            danger: `
                bg-red-600 hover:bg-red-700 text-white focus:ring-red-500
                disabled:bg-red-400 disabled:hover:bg-red-400
            `,
            outline: `
                border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500
                disabled:border-indigo-300 disabled:text-indigo-300 disabled:hover:bg-transparent
            `,
            ghost: `
                text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500
                disabled:text-indigo-300 disabled:hover:bg-transparent
            `,
            };



        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            xl: 'px-8 py-4 text-lg',
        };

        const classes = `
                ${baseClasses}
                ${variants[variant]}
                ${sizes[size]}
                ${disabled || loading ? 'cursor-not-allowed' : ''}
                ${className}
                `.trim().replace(/\s+/g, ' ');


        return (
            <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
            >
                {children}
            </button>
        )
    }
    
export default Button;
