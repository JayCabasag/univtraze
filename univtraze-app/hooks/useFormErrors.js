import { useState } from 'react';

export default function useFormErrors(fields) {
  const initialErrors = Object.fromEntries(
    fields?.map((field) => [field, { hasError: false, message: '' }])
  );
  const [formErrors, setErrors] = useState(initialErrors);

  function setFormErrors(fieldName, message) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: { hasError: true, message: message },
    }));
  }

  function resetFormErrors() {
    setErrors(initialErrors);
  }

  return { formErrors, setFormErrors, resetFormErrors };
}