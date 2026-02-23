import React from 'react';
import { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const styles = {
    [ApplicationStatus.NOT_APPLIED]: 'bg-slate-100 text-slate-600 border-slate-200',
    [ApplicationStatus.APPLIED]: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    [ApplicationStatus.UNDER_REVIEW]: 'bg-brand-amber/10 text-yellow-700 border-brand-amber/20',
    [ApplicationStatus.ACCEPTED]: 'bg-green-50 text-green-700 border-green-200',
    [ApplicationStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-200',
  };

  const sizeClasses = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold border ${sizeClasses} ${styles[status]} whitespace-nowrap`}>
      {status}
    </span>
  );
};