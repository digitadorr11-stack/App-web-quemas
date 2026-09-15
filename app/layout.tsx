import type { Metadata } from 'next';
import { Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html lang="es" className={`${publicSans.variable} ${plexMono.variable}`}>
      <body className="antialiased font-sans bg-[#f3f5f2] text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
