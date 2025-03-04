import React, { forwardRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  accept?: Record<string, string[]>;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  multiple?: boolean;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, error, helperText, accept, maxSize, onChange, multiple = false, className = '', ...props }, ref) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      onChange?.(acceptedFiles);
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple,
    });

    const baseClasses = 'block w-full rounded-md border-2 border-dashed p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2';
    const activeClasses = isDragActive
      ? 'border-blue-400 bg-blue-50'
      : 'border-gray-300 hover:border-gray-400';
    const errorClasses = error ? 'border-red-300 bg-red-50' : '';

    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div
          {...getRootProps()}
          className={`${baseClasses} ${activeClasses} ${errorClasses} ${className}`}
        >
          <input {...getInputProps({ ref, ...props })} />
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>
                  Drag and drop files here, or{' '}
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                </p>
              )}
            </div>
            {maxSize && (
              <p className="text-xs text-gray-500">
                Max file size: {(maxSize / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={`${props.id}-description`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload; 