import type { ReactElement } from 'react';

export function PageHeader({ children }: { children: ReactElement }) {
  return (
    <div data-component="page-header" className="mb-4">
      {children}
    </div>
  );
}
