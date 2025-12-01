interface FormErrorMessageProps {
  message?: string
  className?: string
}

function FormErrorMessage({ message, className }: FormErrorMessageProps) {
  if (!message) return null

  return (
    <p className={`text-sm text-red-600 ${className || ''}`} role="alert">
      {message}
    </p>
  )
}

export default FormErrorMessage
