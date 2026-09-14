import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Control de Quemas | Ingenio La Unión',
  description: 'Sistema integral de control operativo y trazabilidad de quemas en tiempo real.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans bg-[#070C14] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
