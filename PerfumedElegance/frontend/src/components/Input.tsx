import React, { forwardRef, InputHTMLAttributes } from 'react';

// Define the properties our custom Input component can accept
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// Build the component using forwardRef to pass references down to the raw input tag
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {/* Input Label */}
        <label className="label py-1">
          <span className="label-text font-semibold">{label}</span>
        </label>

        {/* The HTML Input Field */}
        <input
          ref={ref}
          className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />

        {/* Display validation error message if it exists */}
        {error && <span className="text-error text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
