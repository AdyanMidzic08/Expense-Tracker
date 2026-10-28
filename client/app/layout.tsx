// app/layout.tsx
import './global.css';
import Navbar from './components/Navbar';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <div className="flex h-screen bg-slate-50 items-center justify-center text-slate-500">
              Laden...
            </div>
          }
        >
          <Navbar>{children}</Navbar>
        </Suspense>
      </body>
    </html>
  );
}
