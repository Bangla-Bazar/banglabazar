import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  change,
  changeType,
  className = '',
}: StatsCardProps) {
  const getChangeColor = () => {
    if (!changeType) return 'text-gray-500';
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  const ChangeIcon = changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 ${className}`}
    >
      <dt>
        <div className="absolute rounded-md bg-blue-500 p-3">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500">{title}</p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change !== undefined && (
          <p
            className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor()}`}
          >
            <ChangeIcon
              className="h-5 w-5 flex-shrink-0 self-center"
              aria-hidden="true"
            />
            <span className="sr-only">
              {changeType === 'increase' ? 'Increased' : 'Decreased'} by
            </span>
            {Math.abs(change)}%
          </p>
        )}
        {description && (
          <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <p className="text-gray-500">{description}</p>
            </div>
          </div>
        )}
      </dd>
    </div>
  );
} 