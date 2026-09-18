'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NuevaSolicitudRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?modulo=nueva');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500">
      <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-semibold tracking-wide text-slate-600">
        Redirigiendo a Nueva Solicitud en el panel principal...
      </p>
    </div>
  );
}
