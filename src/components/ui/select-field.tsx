import { forwardRef } from 'react'
import { Label } from './label'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: readonly { value: string; label: string }[] | { value: string; label: string }[]
  required?: boolean
}

/**
 * Campo de selección reutilizable con label y manejo de errores
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, required, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id}>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <select
          ref={ref}
          className={`w-full h-10 px-3 rounded-md border border-input bg-background ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
