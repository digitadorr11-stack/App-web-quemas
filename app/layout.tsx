import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Control de Quemas Programadas | Ingenio La Unión',
  description: 'Sistema integral de registro, control operativo y auditoría de quemas para Ingenio La Unión.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans min-h-screen bg-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
