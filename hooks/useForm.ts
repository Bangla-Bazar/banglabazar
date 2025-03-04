import { useState, useCallback, useEffect } from 'react';

interface ValidationRule<T> {
  validate: (value: T[keyof T]) => boolean;
  message: string;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: T[keyof T]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}

export default function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when initialValues change
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validateField = useCallback(
    (field: keyof T) => {
      const fieldRules = validationRules[field];
      if (!fieldRules) return;

      const value = values[field];
      let fieldError = '';

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          fieldError = rule.message;
          break;
        }
      }

      setErrors(prev => ({
        ...prev,
        [field]: fieldError,
      }));
    },
    [values, validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldRules = validationRules[field as keyof T];
      if (!fieldRules) return;

      const value = values[field as keyof T];
      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          newErrors[field as keyof T] = rule.message;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleChange = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [field]: value }));
      if (touched[field]) {
        validateField(field);
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field);
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      if (!validateForm()) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validateForm, onSubmit]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      handleChange(field, value);
    },
    [handleChange]
  );

  const setFieldTouched = useCallback(
    (field: keyof T, isTouched = true) => {
      setTouched(prev => ({ ...prev, [field]: isTouched }));
      if (isTouched) {
        validateField(field);
      }
    },
    [validateField]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setValues: (newValues: Partial<T>) =>
      setValues(prev => ({ ...prev, ...newValues })),
    resetForm,
    validateField,
    validateForm,
  };
} 