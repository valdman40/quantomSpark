import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ title, headerActions, children, className = '', noPadding }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <span className="card-title">{title}</span>
          {headerActions && <div className="flex gap-2">{headerActions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'card-body'}>
        {children}
      </div>
    </div>
  );
}
